"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_SITES } from "@/lib/demo-sites";

const photos: Record<string, string> = {
  school:"photo-1503676260728-1c00da094a0b", college:"photo-1523050854058-8df90110c9f1", university:"photo-1562774053-701939374585", courses:"photo-1516321318423-f06f85e504b3", coaching:"photo-1434030216411-0b793f4b4173",
  portfolio:"photo-1499951360447-b19be8fe80f5", agency:"photo-1497366754035-f200968a6e72", corporate:"photo-1497366811353-6870744d04b2", startup:"photo-1556761175-b413da4baf72", consulting:"photo-1454165804606-c3d57bc86b40",
  accounting:"photo-1554224155-6726b3ff858f", law:"photo-1589829545856-d10d557cf95f", banking:"photo-1563013544-824ae1b704d3", insurance:"photo-1450101499163-c8848c66ca85", realestate:"photo-1497366754035-f200968a6e72",
  hotel:"photo-1566073771259-6a8506099945", resort:"photo-1571896349842-33c89424de2d", travel:"photo-1469474968028-56623f02e42e", tour:"photo-1530789253388-582c481c54b0", restaurant:"photo-1414235077428-338989a2e8c0",
  hospital:"photo-1519494026892-80bbd2d6fd0d", clinic:"photo-1576091160399-112ba8d25d1d", dental:"photo-1606811971618-4486d14f3f99", diagnostic:"photo-1579684385127-1ef15d508118", pharmacy:"photo-1576602976047-174e57a47881",
  ngo:"photo-1469571486292-0ba58a3f068b", community:"photo-1511632765486-a01980e01a18", news:"photo-1504711434969-e33886168f5c", blog:"photo-1497366754035-f200968a6e72", event:"photo-1505373877841-8d25f7d46678",
  shop:"photo-1441986300917-64674bd600d8", fashion:"photo-1483985988355-763728e1935b", electronics:"photo-1498049794561-7780e7231661", grocery:"photo-1542838132-92c53300491e", furniture:"photo-1555041469-a586c61ea9bc",
  beauty:"photo-1560750588-73207b1ef5b8", fitness:"photo-1534438327276-14e5300c3a48", automotive:"photo-1486262715619-67b85e0b08d3", construction:"photo-1504307651254-35680f356dfd", interior:"photo-1600210492486-724fe5c67fb0",
  logistics:"photo-1586528116311-ad8dd3c8310d", cleaning:"photo-1581578731548-c64695cc6952", repair:"photo-1581092921461-eab62e97a780", photo:"photo-1452587925148-ce544e77e70d", wedding:"photo-1519741497674-611481863552",
  saas:"photo-1551434678-e076c223a692", app:"photo-1512941937669-90a1b58e7e9", technology:"photo-1518770660439-4636190af475", membership:"photo-1529156069898-49953e39b3ac", booking:"photo-1497366754035-f200968a6e72"
};

export default function DemoCatalog({ showHeading = false }: { showHeading?: boolean }) {
  const [selected, setSelected] = useState<{ slug: string; title: string } | null>(null);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [selected]);

  return <>
    {showHeading && <div className="section-head"><div><p className="eyebrow">NEXORA WEBSITE SHOWCASE</p><h2>Explore all 50 website demos.</h2></div><p className="section-intro">Preview the design inside a customer-facing window, then open the complete interactive demo and request a customised version.</p></div>}
    <div className="demo-catalog-toolbar"><div><strong>{DEMO_SITES.length}</strong><span>website demos available to preview</span></div><a href="#demo-card-01">Start from Demo 01 ↓</a></div>
    <div className="demo-catalog-grid">
      {DEMO_SITES.map((demo, i) => <article id={`demo-card-${String(i + 1).padStart(2, "0")}`} className="demo-catalog-card" key={demo.slug}>
        <div className="demo-catalog-preview" style={{ borderTopColor: demo.accent }}>
          <img className="demo-catalog-photo" src={`https://images.unsplash.com/${photos[demo.slug] ?? photos.technology}?auto=format&fit=crop&w=900&q=80`} alt={demo.name + " website preview"} loading="lazy" />
          <div className="demo-catalog-browser"><i></i><i></i><i></i><span>WEBSITE PREVIEW / {String(i + 1).padStart(2, "0")}</span></div>
          <div className="demo-catalog-hero" style={{ background: `linear-gradient(120deg, ${demo.accent}22, #ffffff)` }}>
            <small>{demo.name.toUpperCase()}</small><b>{demo.title}</b><span>{demo.tagline}</span><em style={{ background: demo.accent }}>EXPLORE ↗</em>
          </div>
          <div className="demo-catalog-bars"><i></i><i></i><i></i></div>
        </div>
        <div className="demo-catalog-info"><span className="demo-catalog-number">DEMO {String(i + 1).padStart(2, "0")} / 50</span><h3>{demo.name}</h3><p>{demo.intro}</p>
          <div className="demo-module-tags">{demo.sections.map(section => <span key={section.title}>{section.title}</span>)}</div>
          <div className="demo-card-actions"><button type="button" onClick={() => setSelected({ slug: demo.slug, title: demo.name })}>Quick live preview ↗</button><Link href={`/demos/${demo.slug}`}>Open full demo & modules ↗</Link></div>
        </div>
      </article>)}
    </div>
    {selected && <div className="demo-preview-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="demo-preview-modal" role="dialog" aria-modal="true" aria-label={selected.title + " live preview"}>
        <header><div><strong>{selected.title}</strong><span>Interactive customer preview · sample content</span></div><div className="demo-preview-modal-actions"><a href={`/demos/${selected.slug}`} target="_blank" rel="noreferrer">Open in new tab ↗</a><button type="button" onClick={() => setSelected(null)} aria-label="Close preview">×</button></div></header>
        <iframe title={selected.title + " full interactive website demo"} src={`/demos/${selected.slug}`} loading="lazy" />
      </section>
    </div>}
  </>;
}
