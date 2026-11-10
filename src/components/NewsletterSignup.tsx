"use client";

import { FormEvent, useState } from "react";

export default function NewsletterSignup() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage("");
    setSuccess(false);
    try {
      const response = await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          consent: data.get("consent") === "on",
          companyWebsite: String(data.get("companyWebsite") || ""),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "সাবস্ক্রিপশন সম্পন্ন করা যায়নি।");
      setSuccess(true);
      setMessage(result.message || "ধন্যবাদ! আপনার সাবস্ক্রিপশন সংরক্ষিত হয়েছে।");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="newsletter" className="newsletter-section">
      <div className="newsletter-copy">
        <p className="eyebrow">NEXORA UPDATES</p>
        <h2>Get useful digital updates.</h2>
        <p>পণ্য, ওয়েবসাইট, সফটওয়্যার ও ডিজিটাল সেবা সম্পর্কে NEXORA-এর আপডেট পেতে স্বেচ্ছায় সাবস্ক্রাইব করুন।</p>
        <small>শুধু আপনার দেওয়া ঠিকানায় আপডেট পাঠানোর জন্য ব্যবহার করা হবে। যেকোনো সময় ইমেইলে unsubscribe অনুরোধ করতে পারবেন।</small>
      </div>
      <form className="newsletter-form" onSubmit={submit}>
        <label>Your name <span>(optional)</span><input name="name" autoComplete="name" maxLength={100} placeholder="Your name" /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
        <label className="newsletter-consent"><input type="checkbox" name="consent" required /> আমি NEXORA-এর পণ্য ও সেবা সংক্রান্ত ইমেইল আপডেট পেতে সম্মতি দিচ্ছি।</label>
        <div className="newsletter-trap" aria-hidden="true"><label>Leave this field empty<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="button form-submit" type="submit" disabled={busy}>{busy ? "Submitting…" : "Subscribe to updates ↗"}</button>
        {message && <p className={success ? "newsletter-message success" : "newsletter-message"} role="status">{message}</p>}
        <p className="form-note">আপনার সম্মতি ছাড়া কাউকে এই তালিকায় যুক্ত করা হয় না।</p>
      </form>
    </section>
  );
}
