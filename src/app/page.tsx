import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import FreeStarterForm from "@/components/FreeStarterForm";
import { DEMO_SITES } from "@/lib/demo-sites";

const services = [
  { n: "Website Design & Development", d: "Responsive business websites, landing pages, portfolios, blogs and custom web applications.", tags: ["Next.js", "WordPress", "E-commerce"] },
  { n: "Domain Registration Assistance", d: "Guidance for choosing and registering suitable domain names, including popular extensions and eligible country domains.", tags: [".com", ".net", ".org"] },
  { n: "Web Hosting Solutions", d: "Hosting recommendations for personal sites, business websites, WordPress, stores and growing projects.", tags: ["Shared", "Business", "Cloud / VPS"] },
  { n: "Maintenance & Security", d: "Updates, SSL guidance, backups, malware checks, performance improvements and migration planning.", tags: ["SSL", "Backup", "Migration"] },
  { n: "Business Email & DNS", d: "Professional email setup guidance, DNS configuration and domain connection support.", tags: ["DNS", "Email", "CDN"] },
  { n: "Website Support", d: "A clear point of contact for project enquiries, website updates and ongoing technical assistance.", tags: ["Consultation", "Support", "Updates"] },
];

const templates = [
  "School Website", "College Website", "University Portal", "Online Course Platform", "Coaching Centre",
  "Personal Portfolio", "Creative Agency", "Corporate Business", "Startup Landing Page", "Consulting Firm",
  "Accounting & Tax Service", "Law Firm", "Banking & Finance Concept", "Insurance Agency", "Real Estate Agency",
  "Hotel Website", "Resort & Villa", "Travel Agency", "Tour Operator", "Restaurant & Cafe",
  "Hospital Website", "Clinic Website", "Dental Clinic", "Diagnostic Centre", "Pharmacy Catalogue",
  "NGO & Charity", "Community Organization", "News & Magazine", "Blog & Editorial", "Event & Conference",
  "Online Store", "Fashion Boutique", "Electronics Store", "Grocery Store", "Furniture Store",
  "Beauty & Salon", "Fitness & Gym", "Automotive Service", "Construction Company", "Interior Design",
  "Logistics & Courier", "Cleaning Service", "Repair Service", "Photography Studio", "Wedding Planner",
  "SaaS Product", "Mobile App Landing", "Technology Company", "Membership Platform", "Booking Platform",
];

const email = "24customar.support@gmail.com";
const subject = encodeURIComponent("NEXORA website project enquiry");

export default function Home() {
  return (
    <main>
      <header className="nav">
        <Link className="brand" href="/" aria-label="NEXORA home">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link>
        <nav aria-label="Main navigation">
          <a href="#services">Services</a><a href="#templates">50 Website Demos</a><a href="#free-starter">Free starter</a><a href="#process">How it works</a><a href="#payments">Payment</a><a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">DIGITAL SERVICES • BUILT FOR YOUR NEXT STEP</p>
          <h1>Your Digital World<br /><span>Starts Here.</span></h1>
          <p className="lead">From your first domain to a complete business website, NEXORA helps you plan, build and grow your online presence.</p>
          <div className="actions">
            <a className="button" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
            <a className="button secondary" href="#templates">Explore 50 website ideas</a>
          </div>
          <div className="hero-proof"><span>01 / PLAN</span><span>02 / BUILD</span><span>03 / GROW</span></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="globe"><span>N</span></div><div className="float-card">YOUR IDEAS<br /><b>GO GLOBAL</b></div></div>
      </section>

      <section id="templates" className="section templates-section">
        <div className="section-head"><div><p className="eyebrow">WEBSITE STARTER IDEAS</p><h2>50 live website<br />demo previews.</h2></div><p className="section-intro">প্রতিটি কার্ডে ডিজাইনের ঝলক, পেজের ধরন ও মডিউল দেখুন। পছন্দ হলে খুলুন সম্পূর্ণ মাল্টি-সেকশন ডেমো—তারপর আপনার প্রতিষ্ঠানের নামে কাস্টমাইজ করার অনুরোধ দিন।</p></div>
        <div className="demo-catalog-toolbar"><div><strong>{DEMO_SITES.length}</strong><span>টি আলাদা ওয়েবসাইট ডেমো ও মডিউল</span></div><a href="#demo-card-01">ডেমো কার্ডগুলো দেখুন ↓</a></div>
        <div className="demo-catalog-grid">{DEMO_SITES.map((demo, i) => <article id={`demo-card-${String(i + 1).padStart(2, "0")}`} className="demo-catalog-card" key={demo.slug}>
          <div className="demo-catalog-preview" style={{ borderTopColor: demo.accent }}>
            <div className="demo-catalog-browser"><i></i><i></i><i></i><span>WEBSITE PREVIEW / {String(i + 1).padStart(2, "0")}</span></div>
            <div className="demo-catalog-hero" style={{ background: `linear-gradient(120deg, ${demo.accent}22, #ffffff)` }}>
              <small>{demo.name.toUpperCase()}</small><b>{demo.title}</b><span>{demo.tagline}</span><em style={{ background: demo.accent }}>EXPLORE ↗</em>
            </div>
            <div className="demo-catalog-bars"><i></i><i></i><i></i></div>
          </div>
          <div className="demo-catalog-info"><span className="demo-catalog-number">DEMO {String(i + 1).padStart(2, "0")} / 50</span><h3>{demo.name}</h3><p>{demo.intro}</p>
            <div className="demo-module-tags">{demo.sections.map((section) => <span key={section.title}>{section.title}</span>)}</div>
            <Link href={`/demos/${demo.slug}`}>সম্পূর্ণ ডেমো ও মডিউল দেখুন ↗</Link>
          </div>
        </article>)}</div>
      </section>


      <section id="services" className="section">
        <div className="section-head"><div><p className="eyebrow">WHAT WE DO</p><h2>Everything you need<br />to get online.</h2></div><p className="section-intro">Practical digital services for individuals, entrepreneurs and growing organizations.</p></div>
        <div className="service-grid">{services.map((s, i) => <article className="service-card" key={s.n}><span className="number">0{i + 1}</span><h3>{s.n}</h3><p>{s.d}</p><div className="tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div></article>)}</div>
      </section>

      <section id="free-starter" className="section free-starter-section">
        <div className="section-head"><div><p className="eyebrow">START ONLINE AT NO COST</p><h2>Apply for free domain & hosting.</h2></div><p className="section-intro">Request an eligible free subdomain and starter hosting option. Availability depends on provider rules, project suitability and review.</p></div>
        <div className="free-starter-info"><span>FREE STARTER REQUEST</span><p>We will review your details and reply with the available free option. Free hosting may use a provider subdomain such as <strong>yourname.vercel.app</strong>; it does not include a free custom .com domain.</p></div>
        <FreeStarterForm />
      </section>
      <section id="process" className="section process-section">
        <p className="eyebrow">A CLEAR PROCESS</p><h2>From idea to launch.</h2>
        <div className="process-grid">
          <article><b>01</b><h3>Tell us your goal</h3><p>Share your business, audience, features and preferred timeline.</p></article>
          <article><b>02</b><h3>Plan the solution</h3><p>We discuss the scope, design direction, domain and hosting requirements.</p></article>
          <article><b>03</b><h3>Build & review</h3><p>Review the agreed website and request refinements before launch.</p></article>
          <article><b>04</b><h3>Launch & support</h3><p>Go live after approvals, provider setup and any required payments.</p></article>
        </div>
      </section>

      <section className="section hosting-note">
        <div><p className="eyebrow">DOMAIN & HOSTING</p><h2>Choose the right foundation.</h2><p>Need a domain, hosting, business email, SSL or help moving an existing website? Tell us what you need and we can discuss suitable options.</p></div>
        <a className="button secondary" href="#free-starter">Apply for free starter ↗</a>
      </section>

      <section id="payments" className="section payment-section">
        <div className="section-head"><div><p className="eyebrow">PAYMENT POLICY</p><h2>Simple, non-card payment options.</h2></div><p className="section-intro">NEXORA will not accept credit, debit or other bank-card payments. Non-card methods may be offered only after the relevant provider account and secure payment verification are configured.</p></div>
        <div className="payment-grid">
          <article className="payment-card"><span className="payment-state">PLANNED METHODS</span><h3>bKash · Nagad · Rocket</h3><p>Mobile financial services, subject to provider onboarding and integration.</p></article>
          <article className="payment-card"><span className="payment-state">PLANNED METHOD</span><h3>Bank Transfer</h3><p>Manual bank transfer with order reference and payment confirmation.</p></article>
          <article className="payment-card disabled"><span className="payment-state">NOT ACCEPTED</span><h3>All Card Payments</h3><p>Credit cards, debit cards, Visa, Mastercard and American Express are disabled.</p></article>
        </div>
        <p className="payment-disclaimer">No online checkout or payment collection is active on this website yet. Please contact NEXORA for an enquiry; do not send money until an official payment instruction is provided.</p>
      </section>

      <section id="contact" className="contact-section">
        <p className="eyebrow">LET'S MAKE IT HAPPEN</p><h2>Have a project in mind?</h2><p>Tell us a little about it. We’ll be happy to discuss the next step.</p>
        <InquiryForm />
        <a className="contact-email" href={`mailto:${email}?subject=${subject}`}>{email} ↗</a>
      </section>
      <footer><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><p>Your Digital World Starts Here.</p><span>© {new Date().getFullYear()} NEXORA INTERNATIONAL TECHNOLOGY. All rights reserved.</span><Link className="footer-portal-link" href="/portal">Client Portal</Link><Link className="footer-admin-link" href="/admin" aria-label="Staff access">·</Link></footer>
    </main>
  );
}
