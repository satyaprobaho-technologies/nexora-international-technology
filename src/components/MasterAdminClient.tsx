"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import Link from "next/link";
import { auth } from "@/lib/firebase";

const MASTER_EMAIL = "satyaprobaho.official@gmail.com";
const card: React.CSSProperties = { display: "block", padding: 22, border: "1px solid #dbe3ee", borderRadius: 16, background: "#fff", color: "#142b45", textDecoration: "none" };

export default function MasterAdminClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(MASTER_EMAIL);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(auth, next => { setUser(next); setReady(true); }), []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      if (result.user.email?.toLowerCase() !== MASTER_EMAIL || !result.user.emailVerified) {
        await signOut(auth);
        setMessage("এই ইমেইলের Master Admin অনুমতি নেই অথবা ইমেইল ভেরিফাই করা হয়নি।");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "লগইন করা যায়নি।");
    } finally { setBusy(false); }
  }

  if (!ready) return <main style={{ maxWidth: 900, margin: "60px auto", padding: 24 }}>Master Admin যাচাই হচ্ছে…</main>;
  if (!user || user.email?.toLowerCase() !== MASTER_EMAIL || !user.emailVerified) {
    return <main style={{ maxWidth: 520, margin: "60px auto", padding: 24, fontFamily: "system-ui" }}>
      <section style={{ padding: 28, border: "1px solid #dbe3ee", borderRadius: 18, background: "#fff" }}>
        <p style={{ color: "#17603d", fontWeight: 700 }}>NEXORA × SATYAPROBAHO</p>
        <h1>কেন্দ্রীয় Master Admin</h1>
        <p>Master login: {MASTER_EMAIL}</p>
        <form onSubmit={login}>
          <label>ইমেইল<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{ display:"block",width:"100%",padding:12,margin:"6px 0 14px",boxSizing:"border-box" }} /></label>
          <label>পাসওয়ার্ড<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ display:"block",width:"100%",padding:12,margin:"6px 0 14px",boxSizing:"border-box" }} /></label>
          <button disabled={busy} style={{ padding:"12px 18px",background:"#155eef",color:"#fff",border:0,borderRadius:10,fontWeight:700 }}>{busy ? "যাচাই হচ্ছে…" : "Master Admin Login"}</button>
        </form>
        {message && <p role="alert">{message}</p>}
        <p style={{ fontSize:13,color:"#667085" }}>এই ইমেইলটি NEXORA Firebase Authentication-এ আগে থেকে তৈরি ও verified থাকতে হবে।</p>
      </section>
    </main>;
  }

  return <main style={{ maxWidth: 1080, margin: "40px auto", padding: 24, fontFamily: "system-ui", color: "#142b45" }}>
    <header style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap",marginBottom:24 }}>
      <div><p style={{ color:"#17603d",fontWeight:700,marginBottom:4 }}>NEXORA × SATYAPROBAHO</p><h1 style={{ margin:0 }}>কেন্দ্রীয় Master Admin</h1><p>লগইন: {user.email}</p></div>
      <button onClick={()=>signOut(auth)} style={{ padding:"10px 16px",border:0,borderRadius:10,background:"#eef2f6" }}>লগআউট</button>
    </header>
    <section style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16 }}>
      <Link href="/admin" style={card}><h2>NEXORA Admin</h2><p>গ্রাহক, প্রকল্প, কোটেশন, পেমেন্ট ও অ্যাডমিন কার্যক্রম।</p><b>Admin খুলুন →</b></Link>
      <Link href="/admin/marketing" style={card}><h2>NEXORA Email Marketing</h2><p>NEXORA-র নিজস্ব contacts, segments, campaigns ও reports।</p><b>Marketing খুলুন →</b></Link>
      <a href="https://satyaprobaho.satyaprobaho.workers.dev/admin.html" target="_blank" rel="noopener noreferrer" style={card}><h2>সত্যপ্রবাহ Admin</h2><p>সংবাদ, ভিডিও, প্রকাশনা ও পত্রিকার নিজস্ব নিয়ন্ত্রণ। আলাদা Supabase session লাগতে পারে।</p><b>সত্যপ্রবাহ Admin খুলুন ↗</b></a>
      <a href="https://satyaprobaho.satyaprobaho.workers.dev/" target="_blank" rel="noopener noreferrer" style={card}><h2>সত্যপ্রবাহ ওয়েবসাইট</h2><p>লাইভ সংবাদ ওয়েবসাইট দেখুন।</p><b>ওয়েবসাইট খুলুন ↗</b></a>
    </section>
    <section style={{ marginTop:22,padding:20,border:"1px solid #f2d49a",borderRadius:14,background:"#fffbeb" }}>
      <h2>ইমেইল মার্কেটিংয়ের পৃথক ডেটা</h2>
      <p>NEXORA ও সত্যপ্রবাহের subscriber, consent, unsubscribe list এবং campaign sender আলাদা রাখতে হবে। NEXORA Marketing Center এখন এই প্যানেল থেকে খোলা যাবে। সত্যপ্রবাহের জন্য আলাদা marketing database ও server-side Brevo configuration যুক্ত না হওয়া পর্যন্ত সেখানে campaign পাঠানো চালু হবে না।</p>
    </section>
    <p style={{ color:"#667085",fontSize:13,marginTop:20 }}>নিরাপত্তা: এই কেন্দ্রীয় প্যানেল NEXORA Firebase login দিয়ে সুরক্ষিত। সত্যপ্রবাহের বিদ্যমান Supabase Admin session এখনো আলাদা; cross-site single sign-on চালুর জন্য Cloudflare Worker ও Supabase-এ যাচাইকৃত server-to-server token bridge প্রয়োজন।</p>
  </main>;
}
