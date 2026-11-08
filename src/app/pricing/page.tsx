import Link from "next/link";

export const metadata = {
  title: "Solutions & Pricing | NEXORA INTERNATIONAL TECHNOLOGY",
  description: "Explore NEXORA software, digital services, implementation packages and request a tailored project quotation.",
};

const plans = [
  { name: "Launch", audience: "Startups, professionals and small businesses", description: "A focused digital launch with the essentials to establish a professional online presence.", includes: ["Business website or landing page", "Mobile-responsive design", "Contact and enquiry journey", "Basic SEO and analytics setup", "Launch handover"], action: "Request a Launch quote" },
  { name: "Growth", audience: "Growing businesses and service teams", description: "A connected digital solution for organisations ready to streamline operations and attract more customers.", includes: ["Custom website or business application", "Selected business workflows", "CRM / inventory / booking module options", "Admin and staff experience", "Integration and reporting scope", "Training and launch support"], action: "Request a Growth quote" },
  { name: "Enterprise", audience: "Established organisations and multi-team operations", description: "A discovery-led engagement for complex workflows, integrations and organisation-wide systems.", includes: ["Custom ERP / SaaS architecture", "Role-based access and workflows", "API and third-party integrations", "Data migration planning", "Security and deployment planning", "Ongoing support options"], action: "Discuss an Enterprise project" },
];

const software = [
  ["Accounting & Finance", "accounting", "Invoices, expenses, reporting and finance workflows."],
  ["CRM & Sales Operations", "saas", "Lead tracking, customer records, sales pipeline and follow-up workflows."],
  ["School & Education Management", "school", "Admissions, student services, academic information and administration."],
  ["Retail & Inventory", "shop", "Product catalogue, stock concepts, sales and order workflows."],
  ["Hotel & Booking", "hotel", "Rooms, guest information and booking enquiry workflows."],
  ["Hospital & Clinic", "hospital", "Departments, service information and appointment enquiry workflows."],
  ["Travel & Tour Operations", "travel", "Destinations, itineraries and custom trip enquiries."],
  ["Business Workflow SaaS", "saas", "Team tasks, process management and operational dashboards."],
];

export default function PricingPage() {
  return <main className="commercial-page">
    <header className="nav"><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/solutions">Solutions</Link><Link href="/software">Software demos</Link><Link href="/portal">Client portal</Link></nav></header>
    <section className="commercial-hero"><p className="eyebrow">ENGAGEMENT & PRICING</p><h1>Choose the right way<br/><span>to build and grow.</span></h1><p>Every organisation has a different scope. Explore our engagement levels, then request a tailored quotation based on your features, timeline and support needs.</p><div className="commercial-actions"><Link className="button" href="/portal">Request a project quote ↗</Link><Link className="button secondary" href="/software">Explore software demos</Link></div><small>No hidden checkout: project scope, quotation and payment instructions are confirmed with you before work begins.</small></section>
    <section className="section commercial-section"><div className="section-head"><div><p className="eyebrow">FLEXIBLE ENGAGEMENT</p><h2>Packages built around your goals.</h2></div><p className="section-intro">We do not publish made-up fixed prices. The final quote depends on scope, integrations, hosting, third-party services and delivery requirements.</p></div><div className="commercial-plan-grid">{plans.map((plan,i)=><article className={i===1?"commercial-plan featured":"commercial-plan"} key={plan.name}><span className="commercial-plan-label">{i===1?"POPULAR ENGAGEMENT":i===2?"CUSTOM SCOPE":"STARTING POINT"}</span><h3>{plan.name}</h3><p className="commercial-audience">{plan.audience}</p><p>{plan.description}</p><ul>{plan.includes.map(item=><li key={item}>{item}</li>)}</ul><Link className="button" href="/portal">{plan.action} ↗</Link></article>)}</div></section>
    <section className="section commercial-section software-offers"><div className="section-head"><div><p className="eyebrow">SOFTWARE SOLUTIONS</p><h2>Explore a solution before you buy.</h2></div><p className="section-intro">Open a sample preview, review the workflow and request a version configured for your organisation.</p></div><div className="commercial-solution-grid">{software.map(item=><article key={item[0]}><span>SOFTWARE SOLUTION</span><h3>{item[0]}</h3><p>{item[2]}</p><Link href={"/demos/"+item[1]}>View sample preview ↗</Link></article>)}</div><p className="commercial-note">Demo environments use sample information only. They are not connected to live banking, medical records, inventory, bookings or payment processing.</p></section>
    <section className="section commercial-section"><div className="commercial-steps"><div><p className="eyebrow">HOW A PURCHASE WORKS</p><h2>Clear steps. No surprises.</h2></div><ol><li><b>1. Choose</b><span>Select a demo or describe the business problem you want solved.</span></li><li><b>2. Discover</b><span>We clarify users, features, integrations, delivery and support.</span></li><li><b>3. Approve the quote</b><span>You review the written scope, price, milestones and terms.</span></li><li><b>4. Pay securely</b><span>Use only the official payment instructions confirmed by NEXORA.</span></li><li><b>5. Build and launch</b><span>Track the project through the customer portal and review agreed milestones.</span></li></ol></div></section>
    <section className="commercial-cta"><p className="eyebrow">READY TO START?</p><h2>Tell us what your business needs.</h2><p>Submit a project request in the customer portal. Our team can review the brief and prepare the next steps.</p><Link className="button" href="/portal">Open customer portal ↗</Link><p className="commercial-note">Online checkout is not active. No payment is collected by this page.</p></section>
    <footer><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><Link href="/solutions">Solutions</Link><Link href="/software">Software demos</Link><Link href="/portal">Client portal</Link></footer>
  </main>;
}
