"use client";

import { FormEvent, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";

type Project = { id: string; title?: string; service?: string; status?: string; paymentStatus?: string; dueDate?: string; createdAt?: unknown };

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

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setLoading(false); }), []);
  useEffect(() => {
    if (!user) { setProjects([]); return; }
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
      const due = new Date();
      due.setDate(due.getDate() + 10);
      const dueDate = due.getFullYear() + "-" + String(due.getMonth() + 1).padStart(2, "0") + "-" + String(due.getDate()).padStart(2, "0");
      await addDoc(collection(db, "projects"), {
        ownerUid: user.uid, ownerEmail: user.email, title: title.trim(), service, brief: brief.trim(), budget, timeline, currency: "USD",
        status: "pending", createdAt: serverTimestamp(), dueDate, paymentStatus: "unpaid"
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
      <div className="portal-panel"><h2>Your projects</h2>{projects.length ? <div className="portal-project-list">{projects.map(p=><article key={p.id}><div><b>{p.title}</b><small>{p.service}</small></div><span className="portal-status">{p.status || "pending"}</span>{p.paymentStatus !== "paid" && p.dueDate && (() => { const days = Math.ceil((new Date(p.dueDate + "T23:59:59").getTime() - Date.now()) / 86400000); return <p className={days < 0 ? "portal-due-alert overdue" : days <= 10 ? "portal-due-alert" : "portal-due-note"}>{days < 0 ? `Payment deadline passed ${Math.abs(days)} day(s) ago. Please contact NEXORA.` : days <= 10 ? `Payment reminder: ${days} day(s) left. Please contact NEXORA to confirm payment.` : `Payment due by ${p.dueDate}`}</p>; })()}</article>)}</div> : <p className="portal-muted">No projects yet. Submit your first request above.</p>}</div>
      {message && <p className="portal-message">{message}</p>}
    </section>}
    <p className="portal-foot">Secure customer access · NEXORA INTERNATIONAL TECHNOLOGY</p>
  </main>;
}
