import Link from "next/link";
import { notFound } from "next/navigation";

const demos = {
  school: { title: "Bright Future Academy", type: "Education website", color: "#2563eb", tagline: "Learn today. Lead tomorrow.", intro: "A welcoming school website with admissions information, academic programs and parent resources.", cards: [["Admissions", "Explore our admission process, requirements and important dates."], ["Our programs", "Discover learning pathways from early years to senior classes."], ["Campus life", "See how students learn, create and grow together."]] },
  business: { title: "Northstar Business", type: "Corporate website", color: "#0f766e", tagline: "Ideas into impact.", intro: "A polished business website concept for a company that wants to communicate clearly and earn trust.", cards: [["Our services", "Strategy, technology and practical support for growing teams."], ["Why choose us", "A focused team, transparent process and measurable outcomes."], ["Contact our team", "Start a conversation about your next business challenge."]] },
  shop: { title: "FORMA Store", type: "Online store concept", color: "#9d174d", tagline: "Everyday essentials, thoughtfully chosen.", intro: "A sample storefront layout with featured collections, product highlights and a clear shopping journey.", cards: [["New arrivals", "Browse the latest additions to our curated collection."], ["Popular picks", "Discover customer favourites and everyday essentials."], ["Shipping & support", "Find information about delivery, returns and customer care."]] },
  restaurant: { title: "The Olive Table", type: "Restaurant website", color: "#a16207", tagline: "Good food. Great company.", intro: "A restaurant website concept with menu highlights, venue information and reservation enquiry details.", cards: [["Our menu", "Seasonal dishes made with fresh, carefully selected ingredients."], ["Our story", "A neighbourhood dining experience built around hospitality."], ["Visit us", "Check location details and get in touch before your visit."]] },
  portfolio: { title: "Alex Morgan", type: "Personal portfolio", color: "#7c3aed", tagline: "Designing digital experiences.", intro: "A clean portfolio concept to present selected work, professional strengths and contact information.", cards: [["Selected work", "A collection of projects, experiments and case studies."], ["What I do", "Product design, visual systems and thoughtful web experiences."], ["Let's collaborate", "Have a project in mind? Start a conversation."]] },
  clinic: { title: "Carewell Clinic", type: "Healthcare website concept", color: "#0e7490", tagline: "Care that puts people first.", intro: "A clinic information website concept with service information, patient guidance and contact details.", cards: [["Our services", "Explore general consultation and available care services."], ["Patient information", "Helpful guidance to prepare for your visit."], ["Appointments", "Contact the clinic team to ask about appointment availability."]] }
} as const;

type DemoSlug = keyof typeof demos;

export function generateStaticParams() {
  return Object.keys(demos).map((slug) => ({ slug }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in demos)) notFound();
  const demo = demos[slug as DemoSlug];
  return (
    <main className="demo-page" style={{ "--demo-accent": demo.color } as React.CSSProperties}>
      <header className="demo-nav"><Link href="/" className="demo-brand">NEXORA <span>DEMO PREVIEW</span></Link><Link href="/#demos" className="demo-back">← All demos</Link></header>
      <section className="demo-hero"><p className="demo-kicker">{demo.type} · SAMPLE DESIGN</p><h1>{demo.title}</h1><h2>{demo.tagline}</h2><p>{demo.intro}</p><Link className="demo-cta" href="/#contact">Request a website like this ↗</Link></section>
      <section className="demo-features"><p className="demo-kicker">EXPLORE THE LAYOUT</p><h2>Designed around your audience.</h2><div className="demo-feature-grid">{demo.cards.map(([title, description]) => <article key={title}><span>✦</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <footer className="demo-footer"><span>Concept preview by NEXORA INTERNATIONAL TECHNOLOGY</span><Link href="/#contact">Discuss your project ↗</Link></footer>
    </main>
  );
}
