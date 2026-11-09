"use client";

import { FormEvent, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { DEMO_SITES } from "@/lib/demo-sites";

type PaymentMethods = { enabled?: boolean; bkash?: { number: string; label: string } | null; nagad?: { number: string; label: string } | null; instructions?: string };
type Project = { id: string; title?: string; service?: string; status?: string; paymentStatus?: string; dueDate?: string; quoteAmount?: number; quoteCurrency?: string; budget?: string; timeline?: string; brief?: string; createdAt?: unknown };

export default function PortalClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [service, setService] = useState("Custom software / SaaS development");
  const [brief, setBrief] = useState("");
  const [budget, setBudget] = useState("Not sure yet");
  const [timeline, setTimeline] = useState("Flexible");
  const [saving, setSaving] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("demo");
    if (!slug) return;
    const demo = DEMO_SITES.find((item) => item.slug === slug);
    if (!demo) return;
    setTitle(`Website: ${demo.name} — ${demo.title}`);
    setService("Website design & development");
    setBrief(`I want to purchase/customise the NEXORA ${demo.name} demo ( ${demo.title} ). Please contact me with the final quotation, delivery timeline and next steps.`);
  }, []);

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setLoading(false); }), []);
  useEffect(() => {
    if (!user) { setProjects([]); setPaymentMethods(null); return; }
    (async () => {
      try {
        const snapshot = await getDoc(doc(db, "settings", "paymentMethods"));
        if (!snapshot.exists()) { setPaymentMethods({ enabled: false }); return; }
        const data = snapshot.data();
        setPaymentMethods({
          enabled: Boolean(data.bkash?.enabled || data.nagad?.enabled),
          bkash: data.bkash?.enabled ? { number: String(data.bkash.number || ""), label: "bKash" } : null,
          nagad: data.nagad?.enabled ? { number: String(data.nagad.number || ""), label: "Nagad" } : null,
          instructions: String(data.instructions || "")
        });
      } catch { setPaymentMethods(null); }
    })();
    const q = query(collection(db, "projects"), where("ownerUid", "==", user.uid));
    return onSnapshot(q, (snap) => setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))), (err) => setMessage(err.message));
  }, [user]);

  async function submitAuth(e: FormEvent) {
    e.preventDefault(); setMessage("");
    try {
      if (register) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const { setDoc, doc } = await import("firebase/firestore");
        await setDoc(doc(db, "customers", credential.user.uid), {
          uid: credential.user.uid, name: name.trim(), email: credential.user.email,
          role: "customer", createdAt: serverTimestamp(), status: "active"
        });
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setRegister(false);
        setPassword("");
        setMessage("অ্যাকাউন্ট তৈরি হয়েছে। আপনার ইমেইলে পাঠানো verification link-এ ক্লিক করে অ্যাকাউন্ট সক্রিয় করুন, তারপর Sign in করুন।");
      } else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not complete sign-in."); }
  }

  async function resetPassword() {
    setMessage("");
    if (!email.trim()) { setMessage("পাসওয়ার্ড রিসেট লিংক পেতে আগে আপনার ইমেইল ঠিকানা লিখুন।"); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("পাসওয়ার্ড রিসেট করার লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "পাসওয়ার্ড রিসেট ইমেইল পাঠানো যায়নি।");
    }
  }

  async function requestPasswordHelp() {
    if (!user?.email) return;
    setMessage("");
    try {
      await addDoc(collection(db, "passwordResetRequests"), {uid: user.uid, email: user.email, status: "pending", createdAt: serverTimestamp()});
      setMessage("আপনার পাসওয়ার্ড সহায়তার অনুরোধ অ্যাডমিনের কাছে পাঠানো হয়েছে। NEXORA টিম আপনার ইমেইলে নিরাপদ রিসেট লিংক পাঠাবে।");
    } catch (err) { setMessage(err instanceof Error ? err.message : "সহায়তার অনুরোধ পাঠানো যায়নি।"); }
  }

  async function acceptQuote(project: Project) {
    if (!user || typeof project.quoteAmount !== "number") return;
    setSaving(true); setMessage("");
    try {
      await addDoc(collection(db, "quoteApprovals"), {
        projectId: project.id, ownerUid: user.uid, ownerEmail: user.email,
        quoteAmount: project.quoteAmount, quoteCurrency: project.quoteCurrency || "USD",
        status: "customer_accepted", createdAt: serverTimestamp()
      });
      setMessage("আপনি কোটেশন গ্রহণ করেছেন। NEXORA টিম এখন ইনভয়েস ও নিরাপদ পেমেন্ট নির্দেশনা নিশ্চিত করবে।");
    } catch (err) { setMessage(err instanceof Error ? err.message : "কোটেশন গ্রহণ করা যায়নি।"); }
    finally { setSaving(false); }
  }

  async function startPayment(project: Project) {
    if (!user) return;
    if (!billingName.trim() || !billingPhone.trim() || !billingAddress.trim()) {
      setMessage("পেমেন্টের আগে billing name, phone এবং address পূরণ করুন।"); return;
    }
    setSaving(true); setMessage("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/payments/sslcommerz/initiate", {
        method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId: project.id, name: billingName.trim(), phone: billingPhone.trim(), address: billingAddress.trim() })
      });
      const result = await response.json();
      if (!response.ok || !result.paymentUrl) throw new Error(result.error || "Payment could not be started.");
      window.location.href = result.paymentUrl;
    } catch (err) { setMessage(err instanceof Error ? err.message : "Payment could not be started."); setSaving(false); }
  }

  async function submitProject(e: FormEvent) {
    e.preventDefault(); if (!user || !title.trim()) return;
    if (!user.emailVerified) { setMessage("প্রজেক্ট জমা দেওয়ার আগে ইমেইল যাচাই করুন।"); return; }
    setSaving(true); setMessage("");
    try {
      const customerSnapshot = await getDoc(doc(db, "customers", user.uid));
      if (!customerSnapshot.exists() || customerSnapshot.data().status !== "active") {
        setMessage("আপনার customer account বর্তমানে সক্রিয় নয়। সহায়তার জন্য NEXORA support-এ যোগাযোগ করুন।");
        return;
      }
      await addDoc(collection(db, "projects"), {
        ownerUid: user.uid, ownerEmail: user.email, title: title.trim(), service, brief: brief.trim(), budget, timeline, currency: "USD",
        status: "pending", createdAt: serverTimestamp(), paymentStatus: "awaiting_quote"
      });
      setTitle(""); setBrief(""); setBudget("Not sure yet"); setTimeline("Flexible"); setMessage("আপনার প্রজেক্ট অনুরোধ জমা হয়েছে। NEXORA টিম পর্যালোচনা করবে এবং পরবর্তী ধাপ জানাবে।");
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not submit request."); }
    finally { setSaving(false); }
  }

  if (loading) return <main className="portal-shell"><p>Loading secure portal…</p></main>;
  return <main className="portal-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><div><Link href="/solutions">Solutions</Link> · <Link href="/pricing">Pricing</Link> · <Link href="/">Back to website ↗</Link></div></div>
    {!user ? <section className="portal-panel">
      <p className="portal-kicker">CUSTOMER ACCESS</p><h1>{register ? "Create your account" : "Welcome back"}</h1>
      <p className="portal-muted">Register or sign in to submit project requests and track your work.</p>
      <form className="portal-form" onSubmit={submitAuth}>
        {register && <label>Full name<input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" /></label>}
        <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={register ? "new-password" : "current-password"} /></label>
        <button className="portal-button" type="submit">{register ? "Create account" : "Sign in"}</button>
      </form>
      {!register && <button type="button" className="portal-switch" onClick={resetPassword}>Forgot password?</button>}
      <button className="portal-switch" onClick={()=>{setRegister(!register);setMessage("");}}>{register ? "Already registered? Sign in" : "New customer? Create an account"}</button>
      {message && <p className="portal-message">{message}</p>}
    </section> : <section className="portal-dashboard">
      <div className="portal-heading"><div><p className="portal-kicker">CUSTOMER DASHBOARD</p><h1>Hello, {user.displayName || user.email}</h1><p className="portal-muted">{user.email}</p></div><button className="portal-outline" onClick={()=>signOut(auth)}>Sign out</button></div>
      <div className="portal-panel"><h2>Password assistance</h2><p className="portal-muted">পাসওয়ার্ড নিয়ে সমস্যা হলে অ্যাডমিনকে জানান। আপনার ইমেইলে নিরাপদ রিসেট লিংক পাঠানো হবে; কেউ আপনার পুরোনো পাসওয়ার্ড দেখতে পাবে না।</p><button type="button" className="portal-outline" onClick={requestPasswordHelp}>Request password reset help</button></div>
      <div className="portal-panel"><h2>Request a new project</h2><form className="portal-form" onSubmit={submitProject}>
        <label>Project / website name<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. My business website" /></label>
        <label>Service<select value={service} onChange={e=>setService(e.target.value)}><option>Custom software / SaaS development</option><option>Accounting, CRM, HR or ERP software</option><option>AI & business automation</option><option>Website design & development</option><option>Mobile app development</option><option>Domain registration assistance</option><option>Web hosting & cloud services</option><option>Business email & DNS</option><option>Cybersecurity & system integration</option><option>Website maintenance</option></select></label>
        <label>Project brief / required features<textarea value={brief} onChange={e=>setBrief(e.target.value)} rows={4} maxLength={3000} placeholder="Describe the business problem, required features, users and integrations." /></label>
        <div className="portal-form-row"><label>Estimated budget<select value={budget} onChange={e=>setBudget(e.target.value)}><option>Not sure yet</option><option>Under USD 500</option><option>USD 500–1,500</option><option>USD 1,500–5,000</option><option>USD 5,000–15,000</option><option>USD 15,000+</option></select></label><label>Target timeline<select value={timeline} onChange={e=>setTimeline(e.target.value)}><option>Flexible</option><option>Within 2 weeks</option><option>Within 1 month</option><option>Within 2–3 months</option><option>3+ months</option></select></label></div>
        <button className="portal-button" disabled={saving}>{saving ? "Submitting…" : "Submit project request"}</button>
      </form></div>
      <div className="portal-panel"><h2>Available payment methods</h2>{paymentMethods?.enabled && (paymentMethods.bkash || paymentMethods.nagad) ? <><p className="portal-muted">আপনার ইনভয়েসের পরিমাণ NEXORA-র সঙ্গে নিশ্চিত করে নিচের অনুমোদিত প্রদর্শিত নম্বরে পেমেন্ট করতে পারবেন।</p>{paymentMethods.bkash && <p><b>bKash:</b> {paymentMethods.bkash.number}</p>}{paymentMethods.nagad && <p><b>Nagad:</b> {paymentMethods.nagad.number}</p>}{paymentMethods.instructions && <p className="portal-muted">{paymentMethods.instructions}</p>}<p className="portal-muted">পেমেন্ট করার পর Sender Number ও Transaction ID NEXORA-কে জানান। যাচাই না হওয়া পর্যন্ত আপনার পেমেন্টের অবস্থা Paid হবে না।</p></> : <p className="portal-muted">বর্তমানে কোনো ম্যানুয়াল পেমেন্ট পদ্ধতি চালু নেই।</p>}</div>
      <div className="portal-panel"><h2>Billing information for future checkout</h2><p className="portal-muted">Billing details are collected for invoice preparation. Online payment is currently disabled while NEXORA completes merchant onboarding. Do not send card details, wallet PINs or OTPs here.</p><div className="portal-form"><label>Billing name<input value={billingName} onChange={e=>setBillingName(e.target.value)} autoComplete="name" /></label><label>Mobile number<input value={billingPhone} onChange={e=>setBillingPhone(e.target.value)} autoComplete="tel" /></label><label>Billing address<input value={billingAddress} onChange={e=>setBillingAddress(e.target.value)} autoComplete="street-address" /></label></div></div>
      <div className="portal-panel"><h2>Your projects</h2>{projects.length ? <div className="portal-project-list">{projects.map(p=><article key={p.id}><div><b>{p.title}</b><small>{p.service}</small><small>Budget: {p.budget || "Not specified"} · Timeline: {p.timeline || "Flexible"}</small>{p.brief && <p className="portal-project-brief">{p.brief}</p>}</div><span className="portal-status">{p.status || "pending"}</span>{typeof p.quoteAmount === "number" && <><p className="portal-quote">NEXORA quotation: {p.quoteCurrency || "USD"} {p.quoteAmount.toLocaleString()}</p>{p.paymentStatus === "quote_sent" && <button className="portal-button" disabled={saving} onClick={()=>acceptQuote(p)}>Accept quotation & request invoice</button>}{p.paymentStatus === "awaiting_payment" && <p className="portal-muted">Online payment is not active yet. NEXORA will provide an approved payment method after merchant setup is complete.</p>}</>}<p className="portal-due-note">Payment status: {(p.paymentStatus || "awaiting_quote").replaceAll("_"," ")}</p>{p.paymentStatus === "awaiting_payment" && p.dueDate && <p className="portal-due-alert">Payment due by {p.dueDate}. Contact NEXORA for official payment instructions.</p>}</article>)}</div> : <p className="portal-muted">No projects yet. Submit your first request above.</p>}</div>
      {message && <p className="portal-message">{message}</p>}
    </section>}
    <p className="portal-foot">Secure customer access · NEXORA INTERNATIONAL TECHNOLOGY</p>
  </main>;
}
