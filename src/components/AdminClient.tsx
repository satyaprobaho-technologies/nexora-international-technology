"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ADMIN_EMAIL, auth, db } from "@/lib/firebase";

type Customer = { id: string; name?: string; email?: string; status?: string };
type Project = { id: string; ownerUid?: string; ownerEmail?: string; title?: string; service?: string; brief?: string; budget?: string; timeline?: string; quoteAmount?: number; quoteCurrency?: string; status?: string; paymentStatus?: string; dueDate?: string };
type QuoteApproval = { id: string; projectId?: string; ownerEmail?: string; quoteAmount?: number; quoteCurrency?: string; status?: string };
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
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState("");

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setReady(true); }), []);
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) { setCustomers([]); setProjects([]); return; }
    (async () => {
      try {
        const [c, p, qa] = await Promise.all([
          getDocs(query(collection(db, "customers"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "quoteApprovals"), orderBy("createdAt", "desc")))
        ]);
        setCustomers(c.docs.map(d=>({id:d.id,...d.data()} as Customer)));
        setProjects(p.docs.map(d=>({id:d.id,...d.data()} as Project)));
        setQuoteApprovals(qa.docs.map(d=>({id:d.id,...d.data()} as QuoteApproval)));
        try {
          const r = await getDocs(query(collection(db, "passwordResetRequests"), orderBy("createdAt", "desc")));
          setResetRequests(r.docs.map(d=>({id:d.id,...d.data()} as ResetRequest)));
        } catch {
          setResetRequests([]);
        }
      } catch (err) { setMessage(err instanceof Error ? err.message : "Unable to load admin data."); }
    })();
  }, [user]);

  async function login(e: FormEvent) {
    e.preventDefault(); setMessage("");
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (credential.user.email !== ADMIN_EMAIL || !credential.user.emailVerified) {
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
  if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) return <main className="portal-shell">
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
    <div className="portal-heading"><div><p className="portal-kicker">NEXORA CONTROL CENTER</p><h1>Admin Dashboard</h1><p className="portal-muted">Signed in as {user.email}</p></div></div>
    <div className="admin-stats"><article><b>{customers.length}</b><span>Customers</span></article><article><b>{projects.length}</b><span>Projects</span></article><article><b>{projects.filter(p=>p.status==="pending").length}</b><span>Pending</span></article><article><b>{projects.filter(p=>p.paymentStatus!=="paid").length}</b><span>Unpaid</span></article></div>
    <section className="portal-panel"><h2>Find customer or project</h2><input className="admin-search" placeholder="Search by any customer email or project name…" value={search} onChange={e=>setSearch(e.target.value)} /></section>
    <section className="portal-panel"><h2>Password help requests ({resetRequests.filter(r=>r.status!=="sent").length} pending)</h2><p className="portal-muted">গ্রাহকরা পাসওয়ার্ডে সমস্যায় পড়লে এখানে সহায়তার অনুরোধ পাঠাতে পারবেন। রিসেট লিংক পাঠালে সেটি গ্রাহকের ইমেইলে যাবে।</p><div className="admin-table">{resetRequests.length ? resetRequests.map(r=><article key={r.id}><div><b>{r.email || "Unknown email"}</b><small>{r.status === "sent" ? "Reset link sent" : "Needs password help"}</small></div><button className="portal-button" disabled={saving===r.id || r.status==="sent"} onClick={()=>sendCustomerReset(r)}>{saving===r.id ? "Sending…" : r.status==="sent" ? "Sent" : "Send reset link"}</button></article>) : <p className="portal-muted">No password help requests yet.</p>}</div></section>
    <section className="portal-panel"><h2>Customers ({visibleCustomers.length})</h2><div className="admin-table">{visibleCustomers.map(c=><article key={c.id}><div><b>{c.name || "Customer"}</b><small>{c.email}</small></div><button className="portal-outline" disabled={saving===c.email} onClick={()=>sendResetToCustomerEmail(c.email)}>{saving===c.email ? "Sending…" : "Send password reset"}</button><select value={c.status||"active"} onChange={e=>updateCustomer(c.id,e.target.value)}><option value="active">Active</option><option value="suspended">Suspended</option></select></article>)}</div></section>
    <section className="portal-panel"><h2>Quotation acceptances ({quoteApprovals.length})</h2><div className="admin-table">{quoteApprovals.length ? quoteApprovals.map(q=><article key={q.id}><div><b>{q.ownerEmail}</b><small>Project: {q.projectId}</small><small>Accepted quote: {q.quoteCurrency || "USD"} {q.quoteAmount?.toLocaleString()}</small></div><span className="portal-status">{q.status || "customer_accepted"}</span></article>) : <p className="portal-muted">No accepted quotations yet.</p>}</div></section>
    <section className="portal-panel"><h2>Projects ({visibleProjects.length})</h2><div className="admin-table">{visibleProjects.map(p=><article key={p.id}><div className="admin-project-info"><b>{p.title}</b><small>{p.ownerEmail} · {p.service}</small><small>Budget: {p.budget || "Not provided"} · Timeline: {p.timeline || "Not specified"}</small>{p.brief && <p className="admin-project-brief">{p.brief}</p>}</div><label className="admin-quote-field">Quote (USD)<input type="number" min="0" step="0.01" defaultValue={p.quoteAmount ?? ""} placeholder="Enter quote" onBlur={e=>{if(e.target.value.trim()) updateProject(p.id,{quoteAmount:Number(e.target.value),quoteCurrency:"USD",paymentStatus:"quote_sent"});}} /></label><select value={p.status||"pending"} disabled={saving===p.id} onChange={e=>updateProject(p.id,{status:e.target.value})}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option><option value="suspended">Suspended</option></select><select value={p.paymentStatus||"awaiting_quote"} disabled={saving===p.id} onChange={e=>updateProject(p.id,{paymentStatus:e.target.value})}><option value="awaiting_quote">Awaiting quote</option><option value="quote_sent">Quote sent</option><option value="awaiting_payment">Awaiting payment</option><option value="paid">Paid</option></select><input aria-label="Payment due date" type="date" value={p.dueDate||""} onChange={e=>updateProject(p.id,{dueDate:e.target.value})}/></article>)}</div></section>
    {message && <p className="portal-message">{message}</p>}<p className="portal-foot">Admin actions are protected by Firebase Authentication and Firestore rules.</p>
  </main>;
}
