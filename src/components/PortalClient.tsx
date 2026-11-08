"use client";

import { FormEvent, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";

type Project = { id: string; title?: string; service?: string; status?: string; dueDate?: string; createdAt?: unknown };

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
  const [service, setService] = useState("Website design & development");
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
      } else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not complete sign-in."); }
  }

  async function submitProject(e: FormEvent) {
    e.preventDefault(); if (!user || !title.trim()) return;
    setSaving(true); setMessage("");
    try {
      await addDoc(collection(db, "projects"), {
        ownerUid: user.uid, ownerEmail: user.email, title: title.trim(), service,
        status: "pending", createdAt: serverTimestamp(), dueDate: null, paymentStatus: "unpaid"
      });
      setTitle(""); setMessage("আপনার প্রজেক্ট অনুরোধ জমা হয়েছে। NEXORA টিম পর্যালোচনা করবে।");
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not submit request."); }
    finally { setSaving(false); }
  }

  if (loading) return <main className="portal-shell"><p>Loading secure portal…</p></main>;
  return <main className="portal-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><Link href="/">Back to website ↗</Link></div>
    {!user ? <section className="portal-panel">
      <p className="portal-kicker">CUSTOMER ACCESS</p><h1>{register ? "Create your account" : "Welcome back"}</h1>
      <p className="portal-muted">Register or sign in to submit project requests and track your work.</p>
      <form className="portal-form" onSubmit={submitAuth}>
        {register && <label>Full name<input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" /></label>}
        <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={register ? "new-password" : "current-password"} /></label>
        <button className="portal-button" type="submit">{register ? "Create account" : "Sign in"}</button>
      </form>
      <button className="portal-switch" onClick={()=>{setRegister(!register);setMessage("");}}>{register ? "Already registered? Sign in" : "New customer? Create an account"}</button>
      {message && <p className="portal-message">{message}</p>}
    </section> : <section className="portal-dashboard">
      <div className="portal-heading"><div><p className="portal-kicker">CUSTOMER DASHBOARD</p><h1>Hello, {user.displayName || user.email}</h1><p className="portal-muted">{user.email}</p></div><button className="portal-outline" onClick={()=>signOut(auth)}>Sign out</button></div>
      <div className="portal-panel"><h2>Request a new project</h2><form className="portal-form" onSubmit={submitProject}>
        <label>Project / website name<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. My business website" /></label>
        <label>Service<select value={service} onChange={e=>setService(e.target.value)}><option>Website design & development</option><option>Domain registration assistance</option><option>Web hosting</option><option>Business email & DNS</option><option>Website maintenance</option><option>Mobile app / web application</option></select></label>
        <button className="portal-button" disabled={saving}>{saving ? "Submitting…" : "Submit project request"}</button>
      </form></div>
      <div className="portal-panel"><h2>Your projects</h2>{projects.length ? <div className="portal-project-list">{projects.map(p=><article key={p.id}><div><b>{p.title}</b><small>{p.service}</small></div><span className="portal-status">{p.status || "pending"}</span>{p.dueDate && <small>Payment due: {p.dueDate}</small>}</article>)}</div> : <p className="portal-muted">No projects yet. Submit your first request above.</p>}</div>
      {message && <p className="portal-message">{message}</p>}
    </section>}
    <p className="portal-foot">Secure customer access · NEXORA INTERNATIONAL TECHNOLOGY</p>
  </main>;
}
