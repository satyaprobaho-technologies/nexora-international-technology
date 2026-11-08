"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const demos = [
  ["Accounting & Finance","accounting"],["School Management","school"],["Banking & Finance","banking"],
  ["Insurance Management","insurance"],["Restaurant POS & Orders","restaurant"],["E-commerce Store","shop"],
  ["Hotel Booking","hotel"],["Hospital & Clinic","hospital"],["Real Estate","realestate"],
  ["Business Workflow / SaaS","saas"],["Appointment Booking","booking"],
  ["Logistics & Trade","logistics"],["Travel & Tourism","travel"],["Grocery Wholesale","grocery"],["University Portal","university"]
];

export default function DemoSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal") || pathname.startsWith("/payment")) return null;
  return (
    <aside className={`nexora-demo-dock ${open ? "is-open" : ""}`}>
      <button className="nexora-demo-dock-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="nexora-demo-dock-icon">▦</span><span>{open ? "Close demos" : "Explore demos"}</span><span aria-hidden="true">{open ? "×" : "‹"}</span>
      </button>
      {open && <div className="nexora-demo-dock-panel">
        <p className="nexora-demo-dock-kicker">NEXORA SHOWCASE</p>
        <h2>Live demo directory</h2>
        <p className="nexora-demo-dock-note">Interactive previews only. Sample data; no real orders, bookings or payments.</p>
        <Link className="nexora-demo-dock-all" href="/software">Open Software Demo Centre ↗</Link>
        <div className="nexora-demo-dock-links">{demos.map(([label, slug]) => <Link key={slug} href={`/demos/${slug}`} onClick={() => setOpen(false)}><span>{label}</span><span>↗</span></Link>)}</div>
        <Link className="nexora-demo-dock-all secondary" href="/demos">Browse all 50 website demos ↗</Link>
      </div>}
    </aside>
  );
}
