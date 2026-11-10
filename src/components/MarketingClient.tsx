"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { ADMIN_EMAIL, auth } from "@/lib/firebase";

type Contact = { id: string; email: string; name?: string; segment: string; consent?: boolean; status?: string; brevoSyncStatus?: string };
type Campaign = { id: string; name?: string; subject?: string; audience?: string; status?: string; createdAt?: { seconds?: number } };
type Sender = { id: number; name: string; email: string; active: boolean };
type DraftContact = { email: string; name: string; segment: "business" | "individual"; consent: boolean; consentSource: string };

const panel: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 22, marginBottom: 18 };
const field: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 10, font: "inherit", marginTop: 6, color: "#111827", background: "#fff" };
const button: React.CSSProperties = { border: 0, borderRadius: 10, padding: "11px 16px", background: "#155eef", color: "#fff", fontWeight: 700, cursor: "pointer" };

function parseCsv(text: string, source: string, segment: "business" | "individual", consent: boolean): DraftContact[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
      row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows.slice(1).map((r) => ({ email: r[0] || "", name: r[1] || "", segment, consent, consentSource: source }));
}

export default function MarketingClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [selectedSenderId, setSelectedSenderId] = useState("");
  const [newSenderEmail, setNewSenderEmail] = useState("");
  const [newSenderName, setNewSenderName] = useState("NEXORA INTERNATIONAL TECHNOLOGY");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"contacts" | "campaigns">("contacts");
  const [segment, setSegment] = useState<"business" | "individual">("business");
  const [consent, setConsent] = useState(false);
  const [consentSource, setConsentSource] = useState("");
  const [csvText, setCsvText] = useState("");
  const [campaignName, setCampaignName] = useState("NEXORA Service Introduction");
  const [subject, setSubject] = useState("আপনার ব্যবসার জন্য আধুনিক ওয়েবসাইট ও সফটওয়্যার");
  const [audience, setAudience] = useState("both");
  const [html, setHtml] = useState("<h2>আপনার ব্যবসাকে ডিজিটাল করুন</h2><p>NEXORA INTERNATIONAL TECHNOLOGY নিয়ে এসেছে আধুনিক ওয়েবসাইট, ব্যবসায়িক সফটওয়্যার ও ডিজিটাল সেবা।</p><p>আমাদের সেবা সম্পর্কে জানতে ওয়েবসাইট ভিজিট করুন।</p><p><a href=\"https://nexora-international-technology.vercel.app\">NEXORA ওয়েবসাইট</a></p>");
  const [search, setSearch] = useState("");

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setReady(true); }), []);
  async function api(path: string, init?: RequestInit) {
    if (!user) throw new Error("Admin sign-in required");
    const token = await user.getIdToken();
    const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init?.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.message || "Request failed");
    return data;
  }
  async function load() {
    if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) return;
    try {
      const [c, m] = await Promise.all([api("/api/admin/marketing/contacts"), api("/api/admin/marketing/campaigns")]);
      setContacts(c.contacts || []); setCampaigns(m.campaigns || []);
      try {
        const s = await api("/api/admin/marketing/senders");
        setSenders(s.senders || []);
        const active = (s.senders || []).filter((sender: Sender) => sender.active);
        setSelectedSenderId((current) => current || String(active[0]?.id || ""));
      } catch {
        setSenders([]);
        setMessage("Brevo Sender তালিকা লোড হয়নি। API Key-তে Sender read permission দিন অথবা Brevo-তে Sender verify করুন।");
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : "ডেটা লোড করা যায়নি।"); }
  }
  useEffect(() => { if (user?.email === ADMIN_EMAIL && user.emailVerified) void load(); }, [user]);

  async function importContacts(items: DraftContact[]) {
    if (!consent || !consentSource.trim()) { setMessage("ইমেইলগুলোতে মার্কেটিং পাঠানোর স্পষ্ট সম্মতি এবং সম্মতির উৎস লিখুন।"); return; }
    const valid = items.filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email));
    if (!valid.length) { setMessage("CSV-তে বৈধ ইমেইল পাওয়া যায়নি। প্রথম কলাম Email এবং দ্বিতীয় কলাম Name রাখুন।"); return; }
    setBusy(true); setMessage("");
    try {
      const result = await api("/api/admin/marketing/contacts", { method: "POST", body: JSON.stringify({ contacts: valid.map((item) => ({ ...item, consent: true, consentSource })) }) });
      setMessage(`${result.saved?.length || 0}টি ইমেইল সংরক্ষিত হয়েছে; ${result.skipped || 0}টি বাদ গেছে।`);
      setCsvText(""); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "ইমেইল ইমপোর্ট ব্যর্থ হয়েছে।"); }
    finally { setBusy(false); }
  }
  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) { setMessage("এই সংস্করণে CSV ফাইল ইমপোর্ট করা যাবে। Excel থেকে Save As > CSV করে নিন।"); return; }
    const text = await file.text();
    const items = parseCsv(text, consentSource, segment, consent);
    await importContacts(items);
    e.target.value = "";
  }
  async function addSender() {
    if (!/^[^\s@]+@gmail\.com$/i.test(newSenderEmail.trim())) {
      setMessage("সঠিক @gmail.com ঠিকানা লিখুন।"); return;
    }
    setBusy(true); setMessage("");
    try {
      const result = await api("/api/admin/marketing/senders", {
        method: "POST",
        body: JSON.stringify({ email: newSenderEmail.trim(), name: newSenderName.trim() })
      });
      setMessage(result.message || "Sender যোগ করার অনুরোধ পাঠানো হয়েছে।");
      setNewSenderEmail("");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gmail Sender যোগ করা যায়নি।");
    } finally { setBusy(false); }
  }

  async function sendCampaign() {
    if (!window.confirm("আপনি কি নির্বাচিত সম্মতিপ্রাপ্ত গ্রাহকদের কাছে এই ইমেইল ক্যাম্পেইন পাঠাতে চান? পাঠানোর পর এটি ফিরিয়ে নেওয়া যাবে না।")) return;
    setBusy(true); setMessage("");
    try {
      const result = await api("/api/admin/marketing/campaigns", { method: "POST", body: JSON.stringify({ name: campaignName, subject, htmlContent: html, audience, senderId: Number(selectedSenderId), confirmed: true }) });
      setMessage(`Brevo ক্যাম্পেইন #${result.campaignId} পাঠানোর জন্য গ্রহণ করেছে।`);
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "ক্যাম্পেইন পাঠানো যায়নি।"); }
    finally { setBusy(false); }
  }

  const filtered = useMemo(() => contacts.filter((c) => c.email.toLowerCase().includes(search.toLowerCase()) || (c.name || "").toLowerCase().includes(search.toLowerCase())), [contacts, search]);
  if (!ready) return <main style={{ padding: 40 }}>Loading…</main>;
  if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) return <main style={{ maxWidth: 620, margin: "70px auto", padding: 24 }}><section style={panel}><h1>Marketing Center</h1><p>এই পৃষ্ঠা দেখতে ভেরিফাইড Nexora Admin হিসেবে লগইন করুন।</p><Link href="/admin">Admin login-এ যান</Link></section></main>;

  return <main style={{ minHeight: "100vh", background: "#f5f7fb", padding: "24px clamp(16px,4vw,48px)", color: "#111827" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div><Link href="/admin" style={{ color: "#155eef", textDecoration: "none", fontWeight: 700 }}>← Admin Dashboard</Link><p style={{ color: "#667085", fontSize: 12, letterSpacing: 2, margin: "16px 0 6px" }}>NEXORA CONTROL CENTER</p><h1 style={{ fontSize: 32, margin: 0 }}>Marketing Center</h1><p style={{ color: "#667085" }}>অনুমতিপ্রাপ্ত ব্যবসায়িক ও ব্যক্তিগত গ্রাহকদের ইমেইল মার্কেটিং</p></div>
        <span style={{ background: "#eaf2ff", color: "#155eef", padding: "9px 13px", borderRadius: 999, fontWeight: 700 }}>Brevo integration</span>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
        {[["Contacts", contacts.length],["Business", contacts.filter(c=>c.segment==="business").length],["Individual", contacts.filter(c=>c.segment==="individual").length],["Campaigns", campaigns.length]].map(([label,value])=><div key={String(label)} style={{ ...panel, margin: 0 }}><div style={{ color: "#667085", fontSize: 13 }}>{label}</div><div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div></div>)}
      </div>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button style={{ ...button, background: tab==="contacts" ? "#155eef" : "#e5e7eb", color: tab==="contacts" ? "#fff" : "#344054" }} onClick={()=>setTab("contacts")}>Email Contacts</button>
        <button style={{ ...button, background: tab==="campaigns" ? "#155eef" : "#e5e7eb", color: tab==="campaigns" ? "#fff" : "#344054" }} onClick={()=>setTab("campaigns")}>Campaigns</button>
      </nav>
      {tab==="contacts" ? <>
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Import permission-based contacts</h2>
          <p style={{ color: "#667085" }}>CSV-এর প্রথম কলাম Email, দ্বিতীয় কলাম Name। Excel ফাইল আগে CSV হিসেবে সংরক্ষণ করুন। ব্যক্তিগত বা ব্যবসায়িক তালিকা আলাদা করে ইমপোর্ট করুন।</p>
          <label style={{ display: "block", fontWeight: 700, marginTop: 14 }}>Contact category<select style={field} value={segment} onChange={e=>setSegment(e.target.value as "business"|"individual")}><option value="business">বাংলাদেশের ব্যবসাপ্রতিষ্ঠান</option><option value="individual">ব্যক্তিগত গ্রাহক</option></select></label>
          <label style={{ display: "block", fontWeight: 700, marginTop: 14 }}>Consent source<input style={field} value={consentSource} onChange={e=>setConsentSource(e.target.value)} placeholder="যেমন: Website signup form, 2026-11-10" /></label>
          <label style={{ display: "flex", gap: 10, alignItems: "center", margin: "16px 0" }}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /> আমি নিশ্চিত করছি, এই তালিকার প্রত্যেক ব্যক্তি/প্রতিষ্ঠান মার্কেটিং ইমেইল পেতে সম্মতি দিয়েছে।</label>
          <label style={{ display: "block", fontWeight: 700 }}>Upload CSV<input style={field} type="file" accept=".csv,text/csv" onChange={handleFile} disabled={busy} /></label>
          <div style={{ marginTop: 16, fontWeight: 700 }}>অথবা ইমেইল তালিকা পেস্ট করুন</div>
          <textarea style={{ ...field, minHeight: 110 }} value={csvText} onChange={e=>setCsvText(e.target.value)} placeholder={"email,name\ncustomer@example.com,Customer Name"} />
          <button style={{ ...button, marginTop: 12 }} disabled={busy || !csvText.trim()} onClick={()=>void importContacts(parseCsv(csvText,consentSource,segment,consent))}>{busy ? "Processing…" : "Import contacts"}</button>
        </section>
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Contact database ({filtered.length})</h2><input style={field} value={search} onChange={e=>setSearch(e.target.value)} placeholder="ইমেইল বা নাম দিয়ে খুঁজুন"/>
          <div style={{ overflowX: "auto", marginTop: 12 }}><table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}><thead><tr>{["Email","Name","Category","Consent","Brevo sync"].map(x=><th key={x} style={{ padding: 10, borderBottom: "1px solid #e5e7eb", color: "#667085" }}>{x}</th>)}</tr></thead><tbody>{filtered.map(c=><tr key={c.id}>{[c.email,c.name||"—",c.segment==="business"?"Business":"Individual",c.consent?"Yes":"No",c.brevoSyncStatus||"—"].map((v,i)=><td key={i} style={{ padding: 10, borderBottom: "1px solid #f0f1f3" }}>{v}</td>)}</tr>)}</tbody></table></div>
        </section>
      </> : <>
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Create email campaign</h2>
          <p style={{ color: "#667085" }}>পাঠানোর আগে বিষয়, বার্তা ও প্রাপক যাচাই করুন। Brevo API-এর মাধ্যমে ক্যাম্পেইন পাঠানো হবে।</p>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Campaign name<input style={field} value={campaignName} onChange={e=>setCampaignName(e.target.value)} /></label>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Email subject<input style={field} value={subject} onChange={e=>setSubject(e.target.value)} /></label>
          <section style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 14, marginTop: 14 }}>
            <h3 style={{ margin: "0 0 8px" }}>Add Gmail sender (১০টির বেশি যোগ করা যাবে)</h3>
            <label style={{ display: "block", fontWeight: 700, marginTop: 8 }}>Gmail address<input style={field} type="email" value={newSenderEmail} onChange={e=>setNewSenderEmail(e.target.value)} placeholder="yourname@gmail.com" /></label>
            <label style={{ display: "block", fontWeight: 700, marginTop: 8 }}>Sender name<input style={field} value={newSenderName} onChange={e=>setNewSenderName(e.target.value)} /></label>
            <button type="button" style={{ ...button, marginTop: 10 }} disabled={busy || !newSenderEmail.trim()} onClick={()=>void addSender()}>{busy ? "Please wait…" : "Add & send verification"}</button>
            <p style={{ color: "#667085", fontSize: 12, marginBottom: 0 }}>Brevo প্রতিটি Gmail ঠিকানায় verification email পাঠাবে। Inbox/Spam থেকে verify না হওয়া পর্যন্ত সেটি campaign sender হিসেবে ব্যবহার করা যাবে না।</p>
          </section>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Verified Gmail sender<select style={field} value={selectedSenderId} onChange={e=>setSelectedSenderId(e.target.value)}><option value="">Sender নির্বাচন করুন</option>{senders.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{s.name} — {s.email}</option>)}</select></label>
          <div style={{ color: "#667085", fontSize: 13, marginTop: 8 }}>যাচাইকৃত Sender: {senders.filter(s=>s.active).length}টি · মোট Sender: {senders.length}টি <button type="button" style={{ ...button, marginLeft: 8, padding: "6px 10px" }} disabled={busy} onClick={()=>void load()}>Refresh</button></div>
          {!senders.length && <p style={{ color: "#b54708" }}>Brevo-তে এখনো Sender পাওয়া যায়নি। প্রথমে Gmail যোগ করুন ও verify করুন।</p>}
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Recipients<select style={field} value={audience} onChange={e=>setAudience(e.target.value)}><option value="both">ব্যবসা + ব্যক্তিগত গ্রাহক</option><option value="business">শুধু ব্যবসাপ্রতিষ্ঠান</option><option value="individual">শুধু ব্যক্তিগত গ্রাহক</option></select></label>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Email content (HTML)<textarea style={{ ...field, minHeight: 220, fontFamily: "monospace" }} value={html} onChange={e=>setHtml(e.target.value)} /></label>
          <button style={{ ...button, marginTop: 16 }} disabled={busy || !selectedSenderId || !contacts.some(c=>c.consent && c.status==="active")} onClick={()=>void sendCampaign()}>{busy ? "Please wait…" : "Send campaign now"}</button>
          {!contacts.length && <p style={{ color: "#b54708" }}>প্রথমে সম্মতিপ্রাপ্ত কন্টাক্ট যোগ করুন এবং Brevo list configuration সম্পন্ন করুন।</p>}
        </section>
        <section style={panel}><h2 style={{ marginTop: 0 }}>Recent campaigns</h2>{campaigns.length ? campaigns.map(c=><article key={c.id} style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}><b>{c.name}</b><div style={{ color: "#667085", fontSize: 13 }}>{c.subject} · {c.audience} · {c.status}</div></article>) : <p style={{ color: "#667085" }}>এখনো কোনো ক্যাম্পেইন নেই।</p>}</section>
      </>}
      {message && <div role="status" style={{ ...panel, borderColor: "#b2ddff", color: "#175cd3" }}>{message}</div>}
      <p style={{ color: "#667085", fontSize: 12 }}>Admin: {user.email} · API credentials are kept server-side. Only consented contacts can be imported and targeted.</p>
    </div>
  </main>;
}
