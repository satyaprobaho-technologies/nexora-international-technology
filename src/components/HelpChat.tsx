"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { from: "bot" | "visitor"; text: string };

const quickQuestions = [
  "Free domain ও hosting কীভাবে পাব?",
  "৫০টি website demo দেখতে চাই",
  "Website তৈরি করতে কত সময় লাগে?",
  "কীভাবে যোগাযোগ করব?",
];

function replyTo(message: string): string {
  const q = message.toLowerCase();
  if (/^(hi|hello|hey|হাই|হ্যালো|আসসালামু|সালাম)/.test(q)) {
    return "স্বাগতম! NEXORA Help-এ আপনাকে স্বাগতম। Website, domain, hosting, demo অথবা project enquiry—কোন বিষয়ে জানতে চান?";
  }
  if (q.includes("free") || q.includes("ফ্রি") || q.includes("বিনামূল্য") || q.includes("domain") || q.includes("ডোমেইন") || q.includes("hosting") || q.includes("হোস্টিং")) {
    return "Free starter-এর জন্য ওয়েবসাইটের “Free Domain & Hosting” অংশে আবেদন ফর্ম পূরণ করুন। যোগ্যতা ও provider-এর নিয়ম অনুযায়ী free subdomain/hosting বিবেচনা করা হবে। Free .com domain দেওয়ার নিশ্চয়তা নেই। আবেদনটি বর্তমানে আপনার email app-এ খসড়া তৈরি করে; সরাসরি অনলাইনে জমা হয় না।";
  }
  if (q.includes("demo") || q.includes("ডেমো") || q.includes("নমুনা")) {
    return "ওয়েবসাইটের “50 Website Demos” মেনু অথবা https://nexora-international-technology.vercel.app/demos লিংক খুলুন। সেখানে ৫০টি আলাদা demo card আছে; প্রতিটি খুললে আলাদা sample page ও feature module দেখতে পাবেন। এগুলো design preview—সবগুলো production-ready customer website নয়।";
  }
  if (q.includes("price") || q.includes("cost") || q.includes("দাম") || q.includes("খরচ") || q.includes("কত টাকা")) {
    return "প্রজেক্টের খরচ নির্ভর করে website type, page সংখ্যা, design ও প্রয়োজনীয় feature-এর ওপর। আপনার প্রয়োজন জানিয়ে নিচের “Start a project” ফর্ম পাঠালে NEXORA আপনার সঙ্গে scope ও quotation নিয়ে আলোচনা করতে পারবে।";
  }
  if (q.includes("payment") || q.includes("পেমেন্ট") || q.includes("টাকা পাঠ") || q.includes("bkash") || q.includes("বিকাশ") || q.includes("nagad") || q.includes("নগদ") || q.includes("rocket")) {
    return "বর্তমানে ওয়েবসাইটে কোনো online payment বা checkout চালু নেই। ভবিষ্যতে bKash, Nagad, Rocket ও bank transfer বিবেচিত হবে। Credit/debit card, Visa, Mastercard ও AMEX গ্রহণ করা হবে না। অফিসিয়াল নির্দেশনা ছাড়া টাকা পাঠাবেন না।";
  }
  if (q.includes("contact") || q.includes("যোগাযোগ") || q.includes("email") || q.includes("ইমেইল") || q.includes("phone") || q.includes("ফোন")) {
    return "NEXORA-তে যোগাযোগ করুন: 24customar.support@gmail.com। মূল পেজের “Have a project in mind?” অংশে project enquiry form-ও রয়েছে।";
  }
  if (q.includes("website") || q.includes("ওয়েবসাইট") || q.includes("site") || q.includes("তৈরি") || q.includes("build")) {
    return "NEXORA business website, portfolio, school, shop, restaurantসহ বিভিন্ন ধরনের website design ও development নিয়ে কাজ করে। আপনার পছন্দের demo খুলে “Request this website” নির্বাচন করুন অথবা project enquiry form ব্যবহার করুন।";
  }
  return "আপনার প্রশ্নটি বুঝতে পারিনি। Free domain/hosting, ৫০টি demo, website development, payment অথবা contact বিষয়ে প্রশ্ন করতে পারেন। প্রয়োজনে 24customar.support@gmail.com-এ লিখুন।";
}

export default function HelpChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "আসসালামু আলাইকুম! আমি NEXORA Help Assistant। সাধারণ প্রশ্নের তাৎক্ষণিক উত্তর দিতে পারি। কীভাবে সাহায্য করতে পারি?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((current) => [...current, { from: "visitor", text: value }, { from: "bot", text: replyTo(value) }]);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  return (
    <div className="help-chat">
      {open && (
        <section className="help-chat-panel" aria-label="NEXORA Help chat">
          <header className="help-chat-header">
            <div><span className="help-chat-status" /><strong>NEXORA Help</strong><small>Automated replies · স্বয়ংক্রিয় সহায়তা</small></div>
            <button type="button" className="help-chat-close" onClick={() => setOpen(false)} aria-label="Close help chat">×</button>
          </header>
          <div className="help-chat-messages" aria-live="polite">
            {messages.map((message, index) => <div className={`help-chat-message ${message.from}`} key={index}><span>{message.text}</span></div>)}
            <div ref={endRef} />
          </div>
          {messages.length === 1 && <div className="help-chat-quick">{quickQuestions.map((question) => <button key={question} type="button" onClick={() => send(question)}>{question}</button>)}</div>}
          <form className="help-chat-compose" onSubmit={handleSubmit}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="আপনার প্রশ্ন লিখুন..." aria-label="Type your question" maxLength={500} />
            <button type="submit" disabled={!draft.trim()} aria-label="Send message">➤</button>
          </form>
          <p className="help-chat-disclaimer">এটি স্বয়ংক্রিয় সহকারী; লাইভ মানব প্রতিনিধি নয়।</p>
        </section>
      )}
      <button type="button" className={`help-chat-launcher ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close NEXORA Help" : "Open NEXORA Help"}>
        {open ? "×" : "?"}<span>{open ? "Close" : "Help"}</span>
      </button>
    </div>
  );
}
