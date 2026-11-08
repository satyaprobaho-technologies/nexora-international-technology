"use client";

import { FormEvent } from "react";

const inbox = "24customar.support@gmail.com";

export default function FreeStarterForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const site = String(data.get("site") || "").trim();
    const type = String(data.get("type") || "").trim();
    const purpose = String(data.get("purpose") || "").trim();
    const subject = encodeURIComponent("Free domain & hosting application — NEXORA");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nPreferred site name: ${site}\nWebsite type: ${type}\nPurpose: ${purpose}\n\nPlease review my request for an eligible free subdomain and hosting option.`
    );
    window.location.href = `mailto:${inbox}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="inquiry-form free-form" onSubmit={submit}>
      <div className="form-row">
        <label>Your name<input name="name" required maxLength={100} autoComplete="name" placeholder="Full name" /></label>
        <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label>
      </div>
      <div className="form-row">
        <label>Phone / WhatsApp <span>(optional)</span><input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+880..." /></label>
        <label>Preferred website name<input name="site" required maxLength={60} placeholder="e.g. mybusiness" /></label>
      </div>
      <div className="form-row">
        <label>Website type
          <select name="type" required defaultValue="">
            <option value="" disabled>Select website type</option>
            <option>Personal portfolio</option><option>Business website</option><option>Education / school</option>
            <option>Blog / news</option><option>Community / NGO</option><option>Other</option>
          </select>
        </label>
        <label>What will the website be used for?<input name="purpose" required maxLength={300} placeholder="Briefly describe your purpose" /></label>
      </div>
      <button className="button form-submit" type="submit">Prepare free application ↗</button>
      <p className="form-note">This prepares an email on your device; it does not submit or store an application online. Free subdomain/hosting is subject to eligibility, provider limits and review. A free subdomain is not a free .com domain.</p>
    </form>
  );
}
