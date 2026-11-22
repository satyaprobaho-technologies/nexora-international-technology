"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ADMIN_EMAIL, isAdminEmail, auth, db } from "@/lib/firebase";

type Customer = { id: string; name?: string; email?: string; status?: string };
type Project = { id: string; ownerUid?: string; ownerEmail?: string; title?: string; service?: string; brief?: string; budget?: string; timeline?: string; quoteAmount?: number; quoteCurrency?: string; status?: string; paymentStatus?: string; dueDate?: string };
type QuoteApproval = { id: string; projectId?: string; ownerEmail?: string; quoteAmount?: number; quoteCurrency?: string; status?: string };
type Payment = { id: string; projectId?: string; customerEmail?: string; provider?: string; tranId?: string; amount?: number; currency?: string; status?: string };
type ResetRequest = { id: string; uid?: string; email?: string; status?: string; createdAt?: unknown };

export default function AdminClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resetRequests, setResetRequests] = useState<ResetRequest[]>([]);
  const [quoteApprovals, setQuoteApprovals] = useState<QuoteApproval[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [bkashEnabled, setBkashEnabled] = useState(false);
  const [nagadEnabled, setNagadEnabled] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState("ইনভয়েসের নির্ধারিত টাকা পাঠানোর আগে NEXORA-র সঙ্গে পরিমাণ নিশ্চিত করুন। টাকা পাঠানোর পর Sender Number ও Transaction ID জমা দিন। অ্যাডমিন টাকা গ্রহণ যাচাই না করা পর্যন্ত পেমেন্ট Paid হবে না।");

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setReady(true); }), []);
  useEffect(() => {
    if (!user || !isAdminEmail(user.email) || !user.emailVerified) { setCustomers([]); setProjects([]); return; }
    (async () => {
      try {
        setMessage("");
        const results = await Promise.allSettled([
          getDocs(query(collection(db, "customers"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "quoteApprovals"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "passwordResetRequests"), orderBy("createdAt", "desc")))
        ]);
        const errors: string[] = [];
        const [c, p, qa, pay, resets] = results;
        if (c.status === "fulfilled") setCustomers(c.value.docs.map(d=>({id:d.id,...d.data()} as Customer)));
        else errors.push("Customers");
        if (p.status === "fulfilled") setProjects(p.value.docs.map(d=>({id:d.id,...d.data()} as Project)));
        else errors.push("Projects");
        if (qa.status === "fulfilled") setQuoteApprovals(qa.value.docs.map(d=>({id:d.id,...d.data()} as QuoteApproval)));
        else errors.push("Quotation acceptances");
        if (pay.status === "fulfilled") setPayments(pay.value.docs.map(d=>({id:d.id,...d.data()} as Payment)));
        else errors.push("Payments");
        if (resets.status === "fulfilled") setResetRequests(resets.value.docs.map(d=>({id:d.id,...d.data()} as ResetRequest)));
        else errors.push("Password help requests");
        if (errors.length) setMessage("Some dashboard sections could not be loaded: " + errors.join(", ") + ". Check the matching Firestore rules.");
      } catch (err) { setMessage(err instanceof Error ? err.message : "Unable to load admin data."); }
    })();
  }, [user]);

  useEffect(() => {
    if (!user || !isAdminEmail(user.email) || !user.emailVerified) return;
    (async () => {
      try {
        const snapshot = await getDoc(doc(db, "settings", "paymentMethods"));
        const data = snapshot.exists() ? snapshot.data() : {};
        setBkashNumber(data.bkash?.number || ""); setNagadNumber(data.nagad?.number || "");
        setBkashEnabled(data.bkash?.enabled === true); setNagadEnabled(data.nagad?.enabled === true);
        setPaymentInstructions(data.instructions || "ইনভয়েসের নির্ধারিত টাকা পাঠানোর আগে NEXORA-র সঙ্গে পরিমাণ নিশ্চিত করুন। টাকা পাঠানোর পর Sender Number ও Transaction ID জমা দিন। অ্যাডমিন টাকা গ্রহণ যাচাই না করা পর্যন্ত পেমেন্ট Paid হবে না।");
      } catch (err) { setMessage(err instanceof Error ? err.message : "Payment settings could not be loaded."); }
    })();
  }, [user]);

  async function savePaymentMethods() {
    if (!user) return;
    setSaving("payment-methods"); setMessage("");
    try {
      const cleanBkash = bkashNumber.replace(/[^0-9]/g, "").slice(0, 14);
      const cleanNagad = nagadNumber.replace(/[^0-9]/g, "").slice(0, 14);
      if ((bkashEnabled && !/^01[3-9][0-9]{8}$/.test(cleanBkash)) || (nagadEnabled && !/^01[3-9][0-9]{8}$/.test(cleanNagad))) {
        throw new Error("চালু করতে হলে বৈধ ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।");
      }
      await setDoc(doc(db, "settings", "paymentMethods"), {
        bkash: { number: cleanBkash, enabled: bkashEnabled, label: "bKash" },
        nagad: { number: cleanNagad, enabled: nagadEnabled, label: "Nagad" },
        instructions: paymentInstructions.slice(0, 1000),
        updatedAt: new Date().toISOString()
      });
      setBkashNumber(cleanBkash); setNagadNumber(cleanNagad);
      setMessage("পেমেন্ট নম্বর ও গ্রাহক প্রদর্শনের সেটিংস সংরক্ষিত হয়েছে।");
    } catch (err) { setMessage(err instanceof Error ? err.message : "Payment settings could not be saved."); }
    finally { setSaving(""); }
  }

  async function login(e: FormEvent) {
    e.preventDefault(); setMessage("");
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!isAdminEmail(credential.user.email) || !credential.user.emailVerified) {
        await signOut(auth); setMessage("এই অ্যাকাউন্টের Admin access নেই অথবা ইমেইল ভেরিফাই করা হয়নি।"); return;
      }
    } catch (err) { setMessage(err instanceof Error ? err.message : "Admin sign-in failed."); }
  }
  async function resetAdminPassword() {
    setMessage("");
    if (!email.trim()) { setMessage("পাসওয়ার্ড রিসেটের জন্য অ্যাডমিন ইমেইল লিখুন।"); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("অ্যাডমিন পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "পাসওয়ার্ড রিসেট ইমেইল পাঠানো যায়নি।");
    }
  }

  async function sendResetToCustomerEmail(customerEmail?: string) {
    if (!customerEmail) return;
    setSaving(customerEmail); setMessage("");
    try {
      await sendPasswordResetEmail(auth, customerEmail);
      setMessage(`পাসওয়ার্ড রিসেট লিংক ${customerEmail} ঠিকানায় পাঠানো হয়েছে।`);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Reset email could not be sent."); }
    finally { setSaving(""); }
  }

  async function sendCustomerReset(request: ResetRequest) {
    if (!request.email) return;
    setSaving(request.id); setMessage("");
    try {
      await sendPasswordResetEmail(auth, request.email);
      await updateDoc(doc(db, "passwordResetRequests", request.id), {status: "sent", handledAt: serverTimestamp()});
      setResetRequests(items=>items.map(item=>item.id===request.id?{...item,status:"sent"}:item));
      setMessage(`পাসওয়ার্ড রিসেট লিংক ${request.email} ঠিকানায় পাঠানো হয়েছে।`);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Reset email could not be sent."); }
    finally { setSaving(""); }
  }

  async function updateProject(id: string, patch: Partial<Project>) {
    setSaving(id); setMessage("");
    try {
      await updateDoc(doc(db, "projects", id), patch);
      setProjects(current=>current.map(p=>p.id===id?{...p,...patch}:p));
    } catch (err) { setMessage(err instanceof Error ? err.message : "Update failed."); }
    finally { setSaving(""); }
  }
  async function updateCustomer(id: string, status: string) {
    try { await updateDoc(doc(db, "customers", id), {status}); setCustomers(c=>c.map(x=>x.id===id?{...x,status}:x)); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Customer update failed."); }
  }

  if (!ready) return <main className="portal-shell"><p>Loading admin access…</p></main>;
  if (!user || !isAdminEmail(user.email) || !user.emailVerified) return <main className="portal-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><Link href="/">Back to website ↗</Link></div>
    <section className="portal-panel"><p className="portal-kicker">STAFF ACCESS</p><h1>Administrator sign in</h1><p className="portal-muted">Restricted access for authorized NEXORA staff.</p>
      <form className="portal-form" onSubmit={login}><label>Admin email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label><button className="portal-button">Sign in securely</button></form><button type="button" className="portal-switch" onClick={resetAdminPassword}>Forgot password?</button>{message && <p className="portal-message">{message}</p>}
    </section>
  </main>;

  const term = search.trim().toLowerCase();
  const visibleCustomers = customers.filter(c=>(c.email||"").toLowerCase().includes(term)||(c.name||"").toLowerCase().includes(term));
  const visibleProjects = projects.filter(p=>(p.ownerEmail||"").toLowerCase().includes(term)||(p.title||"").toLowerCase().includes(term));
  return <main className="portal-shell admin-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><button className="portal-outline" onClick={()=>signOut(auth)}>Sign out</button></div>
    <section className="portal-panel"><h2>NEXORA Social Media Accounts</h2><p className="portal-muted">এগুলো শুধুমাত্র NEXORA-র নিজস্ব সামাজিক যোগাযোগমাধ্যম অ্যাকাউন্টে প্রবেশের লিংক। সত্যপ্রবাহের কোনো অ্যাকাউন্ট বা ডেটা এখানে যুক্ত নয়।</p><div className="portal-actions"><a className="portal-button" href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer">NEXORA Facebook / Meta Login ↗</a><a className="portal-button" href="https://studio.youtube.com/" target="_blank" rel="noopener noreferrer">NEXORA YouTube Studio Login ↗</a></div><p className="portal-muted">নোট: এগুলো Meta ও Google-এর অফিসিয়াল লগইন পোর্টাল; NEXORA ওয়েবসাইটে স্বয়ংক্রিয় পোস্টিং OAuth সংযোগ এখনো আলাদাভাবে কনফিগার করতে হবে।</p></section>
    <div className="portal-heading"><div><p className="portal-kicker">NEXORA CONTROL CENTER</p><h1>Admin Dashboard</h1><p className="portal-muted">Signed in as {user.email}</p></div></div>
    <section className="portal-panel"><h2>Marketing</h2><p className="portal-muted">সম্মতিপ্রাপ্ত ব্যবসায়িক ও ব্যক্তিগত গ্রাহকদের ইমেইল ক্যাম্পেইন পরিচালনা করুন।</p><Link className="portal-button" href="/admin/marketing">Open Marketing Center →</Link></section>
    <div className="admin-stats"><article><b>{customers.length}</b><span>Customers</span></article><article><b>{projects.length}</b><span>Projects</span></article><article><b>{projects.filter(p=>p.status==="pending").length}</b><span>Pending</span></article><article><b>{projects.filter(p=>p.paymentStatus!=="paid").length}</b><span>Unpaid</span></article></div>
    <section className="portal-panel"><h2>Find customer or project</h2><input className="admin-search" placeholder="Search by any customer email or project name…" value={search} onChange={e=>setSearch(e.target.value)} /></section>
    <section className="portal-panel"><h2>Customer payment methods</h2><p className="portal-muted">এখানে নম্বর পরিবর্তন ও চালু/বন্ধ করলে গ্রাহক পোর্টালে তা দেখা যাবে। নম্বরগুলো Firestore-এর অ্যাক্সেস নিয়মে সুরক্ষিত থাকে এবং শুধু ভেরিফাইড গ্রাহকরা দেখতে পারেন।</p><div className="portal-form"><label>bKash number<input inputMode="numeric" value={bkashNumber} onChange={e=>setBkashNumber(e.target.value)} /></label><label><input type="checkbox" checked={bkashEnabled} onChange={e=>setBkashEnabled(e.target.checked)} /> গ্রাহকদের জন্য bKash চালু</label><label>Nagad number<input inputMode="numeric" value={nagadNumber} onChange={e=>setNagadNumber(e.target.value)} /></label><label><input type="checkbox" checked={nagadEnabled} onChange={e=>setNagadEnabled(e.target.checked)} /> গ্রাহকদের জন্য Nagad চালু</label><label>গ্রাহকের জন্য পেমেন্ট নির্দেশনা<textarea rows={3} value={paymentInstructions} onChange={e=>setPaymentInstructions(e.target.value)} /></label><button type="button" className="portal-button" disabled={saving==="payment-methods"} onClick={savePaymentMethods}>{saving==="payment-methods" ? "Saving…" : "Save & enable payment methods"}</button></div></section>
    <section className="portal-panel"><h2>Password help requests ({resetRequests.filter(r=>r.status!=="sent").length} pending)</h2><p className="portal-muted">গ্রাহকরা পাসওয়ার্ডে সমস্যায় পড়লে এখানে সহায়তার অনুরোধ পাঠাতে পারবেন। রিসেট লিংক পাঠালে সেটি গ্রাহকের ইমেইলে যাবে।</p><div className="admin-table">{resetRequests.length ? resetRequests.map(r=><article key={r.id}><div><b>{r.email || "Unknown email"}</b><small>{r.status === "sent" ? "Reset link sent" : "Needs password help"}</small></div><button className="portal-button" disabled={saving===r.id || r.status==="sent"} onClick={()=>sendCustomerReset(r)}>{saving===r.id ? "Sending…" : r.status==="sent" ? "Sent" : "Send reset link"}</button></article>) : <p className="portal-muted">No password help requests yet.</p>}</div></section>
    <section className="portal-panel"><h2>Customers ({visibleCustomers.length})</h2><div className="admin-table">{visibleCustomers.map(c=><article key={c.id}><div><b>{c.name || "Customer"}</b><small>{c.email}</small></div><button className="portal-outline" disabled={saving===c.email} onClick={()=>sendResetToCustomerEmail(c.email)}>{saving===c.email ? "Sending…" : "Send password reset"}</button><select value={c.status||"active"} onChange={e=>updateCustomer(c.id,e.target.value)}><option value="active">Active</option><option value="suspended">Suspended</option></select></article>)}</div></section>
    <section className="portal-panel"><h2>Quotation acceptances ({quoteApprovals.length})</h2><div className="admin-table">{quoteApprovals.length ? quoteApprovals.map(q=><article key={q.id}><div><b>{q.ownerEmail}</b><small>Project: {q.projectId}</small><small>Accepted quote: {q.quoteCurrency || "USD"} {q.quoteAmount?.toLocaleString()}</small></div><span className="portal-status">{q.status || "customer_accepted"}</span></article>) : <p className="portal-muted">No accepted quotations yet.</p>}</div></section>
    <section className="portal-panel"><h2>Payment transactions ({payments.length})</h2><p className="portal-muted">Payment status is updated only after server-side provider verification. Pending and risk-review payments are not treated as paid.</p><div className="admin-table">{payments.length ? payments.map(p=><article key={p.id}><div><b>{p.customerEmail || "Customer"}</b><small>Project: {p.projectId || "—"} · Ref: {p.tranId || p.id}</small><small>{p.provider || "Gateway"} · {p.currency || ""} {p.amount?.toLocaleString()}</small></div><span className="portal-status">{p.status || "pending"}</span></article>) : <p className="portal-muted">No payment transactions yet.</p>}</div></section>
    <section className="portal-panel"><h2>Projects ({visibleProjects.length})</h2><div className="admin-table">{visibleProjects.map(p=><article key={p.id}><div className="admin-project-info"><b>{p.title}</b><small>{p.ownerEmail} · {p.service}</small><small>Budget: {p.budget || "Not provided"} · Timeline: {p.timeline || "Not specified"}</small>{p.brief && <p className="admin-project-brief">{p.brief}</p>}</div><label className="admin-quote-field">Quote (USD)<input type="number" min="0" step="0.01" defaultValue={p.quoteAmount ?? ""} placeholder="Enter quote" onBlur={e=>{if(e.target.value.trim()) updateProject(p.id,{quoteAmount:Number(e.target.value),quoteCurrency:"USD",paymentStatus:"quote_sent"});}} /></label><select value={p.status||"pending"} disabled={saving===p.id} onChange={e=>updateProject(p.id,{status:e.target.value})}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option><option value="suspended">Suspended</option></select><select value={p.paymentStatus||"awaiting_quote"} disabled={saving===p.id} onChange={e=>updateProject(p.id,{paymentStatus:e.target.value})}><option value="awaiting_quote">Awaiting quote</option><option value="quote_sent">Quote sent</option><option value="awaiting_payment">Awaiting payment</option><option value="paid">Paid</option></select><input aria-label="Payment due date" type="date" value={p.dueDate||""} onChange={e=>updateProject(p.id,{dueDate:e.target.value})}/></article>)}</div></section>
    {message && <p className="portal-message">{message}</p>}<p className="portal-foot">Admin actions are protected by Firebase Authentication and Firestore rules.</p>
  </main>;
}
