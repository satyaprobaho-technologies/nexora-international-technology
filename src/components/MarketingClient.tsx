"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { ADMIN_EMAIL, auth } from "@/lib/firebase";

type Contact = { id: string; email: string; name?: string; segment: string; consent?: boolean; status?: string; brevoSyncStatus?: string };
type PublicLead = { id: string; email: string; name?: string; sourceName?: string; sourceUrl?: string; country?: string; consentStatus?: string };
type SignupStats = { total: number; confirmed: number; pending: number; today: number; last7Days: Array<{ date: string; count: number }> };
type Campaign = { id: string; name?: string; subject?: string; audience?: string; status?: string; providerStatus?: string | null; analytics?: { sent: number; delivered: number; opens: number; openRate: number; clickers: number; clickRate: number; unsubscriptions: number; bounces: number } | null; createdAt?: { seconds?: number } };
type ReplyAddress = { id: string; email: string; label: string; active: boolean };
type DraftContact = { email: string; name: string; segment: "business" | "individual"; consent: boolean; consentSource: string };
type FoundEmail = { email: string; sourceUrl: string; consent: false; consentStatus: string };
type FinderResult = { website: string; emails: FoundEmail[]; pagesScanned: number; error?: string; excluded?: boolean; exclusionReason?: string };

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
  const [signupStats, setSignupStats] = useState<SignupStats>({ total: 0, confirmed: 0, pending: 0, today: 0, last7Days: [] });
  const [publicLeads, setPublicLeads] = useState<PublicLead[]>([]);
  const [leadsCursor, setLeadsCursor] = useState<string | null>(null);
  const [leadsHasMore, setLeadsHasMore] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [replyAddresses, setReplyAddresses] = useState<ReplyAddress[]>([]);
  const [replyTo, setReplyTo] = useState("");
  const [newReplyEmail, setNewReplyEmail] = useState("");
  const [newReplyLabel, setNewReplyLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"contacts" | "campaigns" | "finder">("contacts");
  const [finderInput, setFinderInput] = useState("");
  const [finderCountry, setFinderCountry] = useState("United States");
  const [finderResults, setFinderResults] = useState<FinderResult[]>([]);
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
  async function loadLeads(cursor?: string, append = false) {
    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const result = await api(`/api/admin/marketing/leads?${params.toString()}`);
    setPublicLeads((current) => append ? [...current, ...(result.leads || [])] : (result.leads || []));
    setLeadsCursor(result.nextCursor || null);
    setLeadsHasMore(Boolean(result.hasMore));
  }
  async function loadMoreLeads() {
    if (!leadsCursor || busy) return;
    setBusy(true);
    try { await loadLeads(leadsCursor, true); }
    catch (error) { setMessage(error instanceof Error ? error.message : "পরের পৃষ্ঠা লোড করা যায়নি।"); }
    finally { setBusy(false); }
  }
  async function load() {
    if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) return;
    try {
      const [c, m, r, s] = await Promise.all([api("/api/admin/marketing/contacts"), api("/api/admin/marketing/campaigns"), api("/api/admin/marketing/reply-to"), api("/api/admin/marketing/signup-stats")]);
      setContacts(c.contacts || []); setCampaigns(m.campaigns || []); setReplyAddresses(r.addresses || []); setSignupStats(s);
      await loadLeads();
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
  async function addReplyAddress() {
    const email = newReplyEmail.trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/i.test(email)) { setMessage("সঠিক @gmail.com ঠিকানা লিখুন।"); return; }
    setBusy(true); setMessage("");
    try {
      await api("/api/admin/marketing/reply-to", { method: "POST", body: JSON.stringify({ email, label: newReplyLabel.trim() }) });
      setNewReplyEmail(""); setNewReplyLabel("");
      setMessage("Gmail Reply-To ঠিকানা সংরক্ষিত হয়েছে।");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "ঠিকানা যোগ করা যায়নি।"); }
    finally { setBusy(false); }
  }

  async function toggleReplyAddress(address: ReplyAddress) {
    setBusy(true);
    try {
      await api("/api/admin/marketing/reply-to", { method: "PATCH", body: JSON.stringify({ email: address.email, active: !address.active }) });
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "পরিবর্তন করা যায়নি।"); }
    finally { setBusy(false); }
  }


  async function findPublicEmails() {
    const websites = [...new Set(finderInput.split(/[\n,;]+/).map((v) => v.trim()).filter(Boolean))];
    if (!websites.length) { setMessage("কমপক্ষে একটি ওয়েবসাইট URL লিখুন।"); return; }
    if (websites.length > 100) { setMessage("একবারে সর্বোচ্চ ১০০টি ওয়েবসাইট দেওয়া যাবে; পরের ব্যাচ আলাদাভাবে চালান।"); return; }
    if (!finderCountry.trim()) { setMessage("Lead সংরক্ষণের আগে দেশ নির্বাচন/লিখুন।"); return; }
    setBusy(true); setMessage(""); setFinderResults([]);
    const allResults: FinderResult[] = [];
    let totalFound = 0, totalSaved = 0, totalSkipped = 0, totalExcluded = 0;
    try {
      // The API accepts five sites per request; process larger user batches sequentially.
      for (let i = 0; i < websites.length; i += 5) {
        const result = await api("/api/admin/marketing/email-finder", {
          method: "POST", body: JSON.stringify({ websites: websites.slice(i, i + 5) })
        });
        const found: FinderResult[] = result.results || [];
        allResults.push(...found);
        totalExcluded += found.filter((r) => r.excluded).length;
        const leads = found.flatMap((r) => r.emails.map((e) => ({
          email: e.email, name: "", category: "business", country: finderCountry.trim(),
          sourceUrl: e.sourceUrl, sourceName: r.website
        })));
        totalFound += leads.length;
        for (let j = 0; j < leads.length; j += 100) {
          const saved = await api("/api/admin/marketing/leads", {
            method: "POST", body: JSON.stringify({ leads: leads.slice(j, j + 100) })
          });
          totalSaved += saved.saved?.length || 0;
          totalSkipped += saved.skipped?.length || 0;
        }
        setFinderResults([...allResults]);
      }
      await load();
      setMessage(`${websites.length}টি ওয়েবসাইট পরীক্ষা; ${totalFound}টি প্রকাশ্য ইমেইল পাওয়া; ${totalSaved}টি নতুন Consent Pending Lead সংরক্ষিত; ${totalSkipped}টি ডুপ্লিকেট/অবৈধ; IT/software হিসেবে ${totalExcluded}টি ওয়েবসাইট বাদ। Lead-গুলো Brevo-তে পাঠানো হয়নি।`);
    } catch (error) {
      setFinderResults([...allResults]);
      setMessage((error instanceof Error ? error.message : "Email Finder বা সংরক্ষণ ব্যর্থ হয়েছে।") +
        ` ইতোমধ্যে ${totalSaved}টি Lead সংরক্ষিত হয়েছে; অবশিষ্ট ওয়েবসাইট পরে আবার চালাতে পারবেন।`);
    } finally { setBusy(false); }
  }

  async function saveFinderLeads() {
    const leads = finderResults.flatMap((r) => r.emails.map((e) => ({
      email: e.email, name: "", category: "business", country: finderCountry, sourceUrl: e.sourceUrl, sourceName: r.website
    })));
    if (!leads.length) { setMessage("সংরক্ষণের মতো কোনো প্রকাশ্য ইমেইল নেই।"); return; }
    setBusy(true); setMessage("");
    try {
      let totalSaved = 0, totalSkipped = 0;
      for (let i = 0; i < leads.length; i += 100) {
        const result = await api("/api/admin/marketing/leads", { method: "POST", body: JSON.stringify({ leads: leads.slice(i, i + 100) }) });
        totalSaved += result.saved?.length || 0;
        totalSkipped += result.skipped?.length || 0;
      }
      setMessage(`${totalSaved}টি Consent Pending lead ডেটাবেজে সংরক্ষিত; ${totalSkipped}টি ডুপ্লিকেট/অবৈধ ঠিকানা বাদ। এগুলো Brevo-তে যোগ বা ক্যাম্পেইনে সক্রিয় হয়নি।`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "লিড সংরক্ষণ করা যায়নি।"); }
    finally { setBusy(false); }
  }

  function exportFinderCsv() {
    const rows = [["Email", "Website", "Source URL", "Consent status"], ...finderResults.flatMap((r) => r.emails.map((e) => [e.email, r.website, e.sourceUrl, "Not confirmed"]))];
    const csv = rows.map((row) => row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "nexora-public-emails.csv"; a.click(); URL.revokeObjectURL(url);
  }

  async function sendCampaign() {
    if (!window.confirm("আপনি কি নির্বাচিত সম্মতিপ্রাপ্ত গ্রাহকদের কাছে এই ইমেইল ক্যাম্পেইন পাঠাতে চান? পাঠানোর পর এটি ফিরিয়ে নেওয়া যাবে না।")) return;
    setBusy(true); setMessage("");
    try {
      const result = await api("/api/admin/marketing/campaigns", { method: "POST", body: JSON.stringify({ name: campaignName, subject, htmlContent: html, audience, replyTo, confirmed: true }) });
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
        {[[ "Total signups", signupStats.total ],[ "Confirmed", signupStats.confirmed ],[ "Awaiting confirmation", signupStats.pending ],[ "Today", signupStats.today ],[ "Business (loaded)", contacts.filter(c=>c.segment==="business").length ],[ "Individual (loaded)", contacts.filter(c=>c.segment==="individual").length ],[ "Campaigns", campaigns.length ]].map(([label,value])=><div key={String(label)} style={{ ...panel, margin: 0 }}><div style={{ color: "#667085", fontSize: 13 }}>{label}</div><div style={{ fontSize: 30, fontWeight: 800 }}>{Number(value).toLocaleString("en-US")}</div></div>)}
      </div>
      <section style={panel}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><div><h2 style={{ margin: 0 }}>Newsletter signups — last 7 days</h2><p style={{ color: "#667085", margin: "6px 0 0" }}>Bangladesh time · confirmed and pending signups · daily voluntary target: 100,000</p></div><strong style={{ color: "#155eef" }}>{signupStats.today.toLocaleString("en-US")} / 100,000 today</strong></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 8, marginTop: 16 }}>{signupStats.last7Days.map(day=><div key={day.date} style={{ background: "#f8fafc", borderRadius: 9, padding: 10, textAlign: "center" }}><div style={{ color: "#667085", fontSize: 11 }}>{day.date}</div><strong>{day.count.toLocaleString("en-US")}</strong></div>)}</div>
        <p style={{ color: "#667085", fontSize: 12, marginBottom: 0 }}>Only people who submit the form and confirm their email become marketing-eligible. The daily target is a goal, not a guaranteed acquisition rate.</p>
      </section>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button style={{ ...button, background: tab==="contacts" ? "#155eef" : "#e5e7eb", color: tab==="contacts" ? "#fff" : "#344054" }} onClick={()=>setTab("contacts")}>Email Contacts</button>
        <button style={{ ...button, background: tab==="campaigns" ? "#155eef" : "#e5e7eb", color: tab==="campaigns" ? "#fff" : "#344054" }} onClick={()=>setTab("campaigns")}>Campaigns</button>
        <button style={{ ...button, background: tab==="finder" ? "#155eef" : "#e5e7eb", color: tab==="finder" ? "#fff" : "#344054" }} onClick={()=>setTab("finder")}>Email Finder</button>
      </nav>
      {tab==="contacts" ? <>
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Gmail Reply-To address book</h2>
          <p style={{ color: "#667085" }}>১০টির বেশি Gmail ঠিকানা সংরক্ষণ করুন। ক্যাম্পেইন Brevo-তে যাচাইকৃত NEXORA Sender থেকে যাবে; গ্রাহক Reply করলে নির্বাচিত Gmail-এ উত্তর যাবে। Gmail পাসওয়ার্ড প্রয়োজন নেই।</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 10 }}>
            <input style={field} type="email" value={newReplyEmail} onChange={e=>setNewReplyEmail(e.target.value)} placeholder="yourname@gmail.com" />
            <input style={field} value={newReplyLabel} onChange={e=>setNewReplyLabel(e.target.value)} placeholder="নাম / বিভাগ (ঐচ্ছিক)" />
          </div>
          <button style={{ ...button, marginTop: 10 }} disabled={busy || !newReplyEmail.trim()} onClick={()=>void addReplyAddress()}>Add Gmail address</button>
          <div style={{ marginTop: 14 }}>
            {replyAddresses.length ? replyAddresses.map(address=><div key={address.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #eee" }}><div><b>{address.label}</b><div style={{ color: "#667085", fontSize: 13 }}>{address.email}</div></div><button style={{ ...button, background: address.active ? "#067647" : "#667085", padding: "7px 10px" }} disabled={busy} onClick={()=>void toggleReplyAddress(address)}>{address.active ? "Active" : "Disabled"}</button></div>) : <p style={{ color: "#667085" }}>এখনো কোনো Gmail ঠিকানা যোগ করা হয়নি।</p>}
          </div>
        </section>
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
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Public Business Leads — Consent Pending ({publicLeads.length})</h2>
          <p style={{ color: "#667085" }}>প্রকাশ্য ওয়েবসাইট থেকে পাওয়া যোগাযোগের ঠিকানা। এগুলো মার্কেটিং সম্মতিপ্রাপ্ত নয় এবং Brevo campaign-এ পাঠানো হয় না।</p>
          <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}><thead><tr>{["Email","Country","Source","Consent","Source URL"].map(x=><th key={x} style={{ padding: 10, borderBottom: "1px solid #e5e7eb", color: "#667085" }}>{x}</th>)}</tr></thead><tbody>{publicLeads.map(lead=><tr key={lead.id}><td style={{ padding: 10, borderBottom: "1px solid #f0f1f3" }}>{lead.email}</td><td style={{ padding: 10, borderBottom: "1px solid #f0f1f3" }}>{lead.country || "Unknown"}</td><td style={{ padding: 10, borderBottom: "1px solid #f0f1f3" }}>{lead.sourceName || "—"}</td><td style={{ padding: 10, borderBottom: "1px solid #f0f1f3", color: "#b54708" }}>Pending</td><td style={{ padding: 10, borderBottom: "1px solid #f0f1f3" }}>{lead.sourceUrl ? <a href={lead.sourceUrl} target="_blank" rel="noreferrer">Source</a> : "—"}</td></tr>)}</tbody></table></div>
          <p style={{ color: "#667085", fontSize: 12 }}>এই পৃষ্ঠায় {publicLeads.length}টি লিড দেখানো হচ্ছে।</p>
          {leadsHasMore && <button style={button} disabled={busy} onClick={()=>void loadMoreLeads()}>{busy ? "Loading…" : "আরও ১০০টি লিড দেখুন"}</button>}
        </section>
      </> : tab==="campaigns" ? <>
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Create email campaign</h2>
          <p style={{ color: "#667085" }}>পাঠানোর আগে বিষয়, বার্তা ও প্রাপক যাচাই করুন। Brevo API-এর মাধ্যমে ক্যাম্পেইন পাঠানো হবে।</p>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Campaign name<input style={field} value={campaignName} onChange={e=>setCampaignName(e.target.value)} /></label>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Email subject<input style={field} value={subject} onChange={e=>setSubject(e.target.value)} /></label>
          <p style={{ color: "#667085", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
            প্রেরক হিসেবে Brevo account-এ আগে থেকে যাচাইকৃত NEXORA sender ব্যবহার হবে। নিচে সংরক্ষিত Gmail ঠিকানা থেকে Reply-To নির্বাচন করুন।
          </p>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Reply-to Gmail<select style={field} value={replyTo} onChange={e=>setReplyTo(e.target.value)}><option value="">Default verified NEXORA sender</option>{replyAddresses.filter(a=>a.active).map(a=><option key={a.id} value={a.email}>{a.label} — {a.email}</option>)}</select></label>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Recipients<select style={field} value={audience} onChange={e=>setAudience(e.target.value)}><option value="both">ব্যবসা + ব্যক্তিগত গ্রাহক</option><option value="business">শুধু ব্যবসাপ্রতিষ্ঠান</option><option value="individual">শুধু ব্যক্তিগত গ্রাহক</option></select></label>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Email content (HTML)<textarea style={{ ...field, minHeight: 220, fontFamily: "monospace" }} value={html} onChange={e=>setHtml(e.target.value)} /></label>
          <button style={{ ...button, marginTop: 16 }} disabled={busy || !contacts.some(c=>c.consent && c.status==="active")} onClick={()=>void sendCampaign()}>{busy ? "Please wait…" : "Send campaign now"}</button>
          {!contacts.length && <p style={{ color: "#b54708" }}>প্রথমে সম্মতিপ্রাপ্ত কন্টাক্ট যোগ করুন এবং Brevo list configuration সম্পন্ন করুন।</p>}
        </section>
        <section style={panel}><h2 style={{ marginTop: 0 }}>Recent campaigns</h2><p style={{ color: "#667085", fontSize: 13 }}>Brevo থেকে লাইভ রিপোর্ট: Open Rate, Click Rate, Delivered, Bounce ও Unsubscribe।</p>{campaigns.length ? campaigns.map(c=><article key={c.id} style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}><b>{c.name}</b><div style={{ color: "#667085", fontSize: 13 }}>{c.subject} · {c.audience} · {c.providerStatus || c.status}</div>{c.analytics ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginTop: 12 }}>{[["Open rate",`${c.analytics.openRate.toFixed(2)}%`],["Click rate",`${c.analytics.clickRate.toFixed(2)}%`],["Delivered",c.analytics.delivered],["Opened",c.analytics.opens],["Clickers",c.analytics.clickers],["Bounces",c.analytics.bounces],["Unsubscribed",c.analytics.unsubscriptions]].map(([label,value])=><div key={String(label)} style={{ background: "#f8fafc", borderRadius: 9, padding: 10 }}><div style={{ color: "#667085", fontSize: 11 }}>{label}</div><strong>{value}</strong></div>)}</div> : <div style={{ color: "#667085", fontSize: 12, marginTop: 8 }}>রিপোর্ট এখনো পাওয়া যায়নি; Campaign পাঠানো ও Brevo analytics প্রস্তুত হলে এখানে দেখা যাবে।</div>}</article>) : <p style={{ color: "#667085" }}>এখনো কোনো ক্যাম্পেইন নেই।</p>}</section>

      </> : <>
        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Public Website Email Finder</h2>
          <p style={{ color: "#667085" }}>কোম্পানির নিজস্ব ওয়েবসাইটে প্রকাশ্যে থাকা যোগাযোগের ইমেইল খুঁজুন। প্রতি বার সর্বোচ্চ ৫টি ওয়েবসাইট; Home, Contact, About ও নীতিমালা পৃষ্ঠা দেখা হবে। কোনো পেইড API প্রয়োজন নেই।</p>
          <label style={{ display: "block", fontWeight: 700 }}>Country / দেশ (এই ব্যাচের সব ওয়েবসাইট এই দেশের অধীনে যাবে)<input style={field} value={finderCountry} onChange={e=>setFinderCountry(e.target.value)} placeholder="যেমন: Bangladesh, United States, United Kingdom" /></label>
          <label style={{ display: "block", fontWeight: 700 }}>Website URL / Domain (প্রতি লাইনে একটি)<textarea style={{ ...field, minHeight: 120 }} value={finderInput} onChange={e=>setFinderInput(e.target.value)} placeholder={"https://example.com\nexample.org"} /></label>
          <button style={{ ...button, marginTop: 12 }} disabled={busy || !finderInput.trim()} onClick={()=>void findPublicEmails()}>{busy ? "Searching public pages…" : "Find public emails"}</button>
          <p style={{ color: "#667085", fontSize: 12 }}>শুধু প্রকাশ্য ওয়েবপেজ; লগইন, CAPTCHA, ব্যক্তিগত Gmail, ডেটা ব্রোকার বা SMTP probing নয়। ওয়েবসাইটের robots.txt ও নিরাপত্তা সীমা মানা হয়। ফলাফল deliverability-verified নয়।</p>
        </section>
        {finderResults.length > 0 && <section style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}><h2 style={{ marginTop: 0 }}>Finder results ({finderResults.reduce((n,r)=>n+r.emails.length,0)})</h2><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button style={{ ...button, background: "#067647" }} disabled={busy} onClick={()=>void saveFinderLeads()}>Save as Consent Pending Leads</button><button style={button} onClick={exportFinderCsv}>Export CSV</button></div></div>
          {finderResults.map((r)=><div key={r.website} style={{ padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}><b>{r.website}</b><span style={{ color: "#667085", marginLeft: 8, fontSize: 12 }}>{r.pagesScanned} pages scanned</span>{r.error && <p style={{ color: "#b42318" }}>{r.error}</p>}{r.emails.length ? <div style={{ overflowX: "auto" }}><table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}><thead><tr>{["Email","Source","Consent"].map(x=><th key={x} style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{x}</th>)}</tr></thead><tbody>{r.emails.map(e=><tr key={e.email}><td style={{ padding: 8 }}>{e.email}</td><td style={{ padding: 8 }}><a href={e.sourceUrl} target="_blank" rel="noreferrer">View page</a></td><td style={{ padding: 8, color: "#b54708" }}>Not confirmed</td></tr>)}</tbody></table></div> : !r.error && <p style={{ color: "#667085" }}>কোনো প্রকাশ্য ইমেইল পাওয়া যায়নি।</p>}</div>)}
          <p style={{ color: "#b54708", fontSize: 13, marginBottom: 0 }}>গুরুত্বপূর্ণ: Finder-এ পাওয়া ঠিকানাগুলো স্বয়ংক্রিয়ভাবে Marketing Contacts বা Brevo-তে যোগ হয় না। মালিকের স্পষ্ট সম্মতি ছাড়া প্রচারমূলক ইমেইল পাঠাবেন না।</p>
        </section>}
      </>}
      {message && <div role="status" style={{ ...panel, borderColor: "#b2ddff", color: "#175cd3" }}>{message}</div>}
      <p style={{ color: "#667085", fontSize: 12 }}>Admin: {user.email} · API credentials are kept server-side. Only consented contacts can be imported and targeted.</p>
    </div>
  </main>;
}
