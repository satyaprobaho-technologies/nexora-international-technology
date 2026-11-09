"use client";

import { FormEvent } from "react";

const inbox = "24customar.support@gmail.com";

export default function InquiryForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const service = String(form.get("service") || "").trim();
    const message = String(form.get("message") || "").trim();
    const subject = encodeURIComponent(`NEXORA enquiry — ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nService: ${service}\n\nProject details:\n${message}`
    );
    window.location.href = `mailto:${inbox}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="form-row">
        <label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name" /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      </div>
      <div className="form-row">
        <label>Phone / WhatsApp <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="+880..." /></label>
        <label>What do you need?
          <select name="service" required defaultValue="">
            <option value="" disabled>Select a service</option>
            <option>Custom software / SaaS development</option>
            <option>Accounting, CRM, HR or ERP software</option>
            <option>AI & business automation</option>
            <option>Mobile app development</option>
            <option>Website design & development</option>
            <option>Domain registration assistance</option>
            <option>Web hosting</option>
            <option>Business email & DNS</option>
            <option>Cloud, hosting & DevOps</option>
            <option>Cybersecurity & system integration</option>
            <option>Maintenance & support</option>
            <option>Other enquiry</option>
          </select>
        </label>
      </div>
      <label>Project details<textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder="Tell us about your project, required features and timeline." /></label>
      <button className="button form-submit" type="submit">Prepare enquiry email ↗</button>
      <p className="form-note">This opens your email application with the details filled in. Nothing is submitted or stored on this website.</p>
    </form>
  );
}
