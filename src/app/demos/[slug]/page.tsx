import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_SITES } from "@/lib/demo-sites";
import DemoProtection from "@/components/DemoProtection";

export function generateStaticParams() {
  return DEMO_SITES.map(({ slug }) => ({ slug }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = DEMO_SITES.find((site) => site.slug === slug);
  if (!demo) notFound();

  return (
    <DemoProtection>
      <main className="demo-page" style={{ "--demo-accent": demo.accent } as React.CSSProperties}>
        <header className="demo-nav"><Link href="/" className="demo-brand">NEXORA <span>EXCLUSIVE DEMO PREVIEW</span></Link><Link href="/#templates" className="demo-back">← All 50 demos</Link></header>
        <section className="demo-hero"><p className="demo-kicker">{demo.name} · PRIVATE DESIGN PREVIEW</p><h1>{demo.title}</h1><h2>{demo.tagline}</h2><p>{demo.intro}</p><Link className="demo-cta" href={`/#contact`}>Request this website ↗</Link></section>
        <section className="demo-features"><p className="demo-kicker">EXPLORE THIS DEMO MODULE</p><h2>Built around your audience.</h2><div className="demo-feature-grid">{demo.sections.map((section, index) => <article key={section.title}><span>0{index + 1}</span><h3>{section.title}</h3><p>{section.description}</p></article>)}</div></section>
        <section className="demo-preview-panel"><div><p className="demo-kicker">CUSTOM BUILD AVAILABLE</p><h2>Like this direction?</h2><p>This is a separate NEXORA sample module. We can tailor the pages, content, features and visual identity for your project.</p><Link className="demo-cta" href="/#contact">Discuss your project ↗</Link></div><div className="demo-preview-art" aria-hidden="true"><div className="preview-window"><i/><i/><i/><b>{demo.title}</b><span/><span/><span/></div></div></section>
        <footer className="demo-footer"><span>© NEXORA INTERNATIONAL TECHNOLOGY · Demo #{DEMO_SITES.findIndex((site) => site.slug === slug) + 1}</span><Link href="/#templates">Browse all 50 demos ↗</Link></footer>
      </main>
    </DemoProtection>
  );
}
