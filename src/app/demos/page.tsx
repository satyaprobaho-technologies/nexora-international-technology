import Link from "next/link";
import { DEMO_SITES } from "@/lib/demo-sites";

export const metadata = {
  title: "50 Website Demo Templates | NEXORA INTERNATIONAL TECHNOLOGY",
  description: "Explore all 50 NEXORA website design demos and open a complete preview for each business category.",
};

const catalogImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
];

export default function DemosPage() {
  return (
    <main>
      <header className="nav">
        <Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/portal">Client Portal</Link>
          <a href="#all-demos">All 50 demos</a>
        </nav>
      </header>
      <section id="all-demos" className="section templates-section">
        <div className="section-head">
          <div><p className="eyebrow">NEXORA WEBSITE SHOWCASE</p><h2>Explore all 50 website demos.</h2></div>
          <p className="section-intro">Choose a design category, preview its complete multi-section concept, and request a version customised for your organisation.</p>
        </div>
        <div className="demo-catalog-toolbar">
          <div><strong>{DEMO_SITES.length}</strong><span>website demos available to preview</span></div>
          <a href="#demo-card-01">Start from Demo 01 ↓</a>
        </div>
        <div className="demo-catalog-grid">
          {DEMO_SITES.map((demo, i) => (
            <article id={`demo-card-${String(i + 1).padStart(2, "0")}`} className="demo-catalog-card" key={demo.slug}>
              <div className="demo-catalog-preview" style={{ borderTopColor: demo.accent }}>
                <img className="demo-catalog-photo" src={catalogImages[i % catalogImages.length]} alt={demo.name + " website design preview"} loading="lazy"/>
                <div className="demo-catalog-browser"><i></i><i></i><i></i><span>WEBSITE PREVIEW / {String(i + 1).padStart(2, "0")}</span></div>
                <div className="demo-catalog-hero" style={{ background: `linear-gradient(120deg, ${demo.accent}22, #ffffff)` }}>
                  <small>{demo.name.toUpperCase()}</small><b>{demo.title}</b><span>{demo.tagline}</span><em style={{ background: demo.accent }}>EXPLORE ↗</em>
                </div>
                <div className="demo-catalog-bars"><i></i><i></i><i></i></div>
              </div>
              <div className="demo-catalog-info">
                <span className="demo-catalog-number">DEMO {String(i + 1).padStart(2, "0")} / 50</span>
                <h3>{demo.name}</h3><p>{demo.intro}</p>
                <div className="demo-module-tags">{demo.sections.map(section => <span key={section.title}>{section.title}</span>)}</div>
                <Link href={`/demos/${demo.slug}`}>Open full demo & modules ↗</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="hosting-note">
          <div><p className="eyebrow">READY TO BUILD?</p><h2>Make this design yours.</h2><p>Sign in to the customer portal and submit a project request for your selected demo.</p></div>
          <Link className="button" href="/portal">Request a website ↗</Link>
        </div>
      </section>
      <footer><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><p>Your Digital World Starts Here.</p><Link href="/portal">Client Portal</Link><Link href="/">Back to website</Link></footer>
    </main>
  );
}
