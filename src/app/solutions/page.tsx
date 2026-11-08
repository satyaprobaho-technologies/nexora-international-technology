import Link from "next/link";

export const metadata = {
  title: "Software & Digital Solutions | NEXORA INTERNATIONAL TECHNOLOGY",
  description: "Explore NEXORA software solutions, custom development, AI automation, cloud, web and mobile services for global businesses.",
};

const groups = [
  { title: "Business Operations", intro: "Tools to organise customers, money, people and day-to-day work.", items: [["Accounting & Finance", "accounting", "Invoices, expenses, bookkeeping and management reporting."], ["CRM & Sales Management", "saas", "Customer records, lead pipeline, follow-ups and sales visibility."], ["HR & Payroll", "saas", "Employee records, attendance, leave and payroll workflow concepts."], ["Inventory & Warehouse", "shop", "Stock control, product movement, suppliers and reorder workflows."], ["Project & Team Management", "saas", "Tasks, assignments, milestones and team progress."]] },
  { title: "Industry Solutions", intro: "Purpose-led digital experiences for specialist sectors.", items: [["Education Management", "school", "Admissions, student portals and academic information."], ["Healthcare & Clinic", "hospital", "Departments, services and appointment enquiry journeys."], ["Retail & E-commerce", "shop", "Product catalogues, cart concepts and store management."], ["Hospitality & Booking", "hotel", "Rooms, guest services and booking enquiries."], ["Travel & Logistics", "travel", "Destinations, itinerary planning and service enquiries."]] },
  { title: "Technology & Digital Services", intro: "Build, connect and improve your digital infrastructure.", items: [["Custom Software & SaaS", "saas", "Tailored web applications and subscription software concepts."], ["AI & Business Automation", "saas", "AI-assisted workflows, knowledge support and process automation."], ["Website & E-commerce Development", "shop", "Responsive websites, business portals and online stores."], ["Mobile App Development", "saas", "Android and iOS product planning and application development."], ["Cloud, Hosting & DevOps", "corporate", "Deployment planning, hosting guidance, monitoring and maintenance."], ["Cybersecurity & Integrations", "corporate", "Security reviews, access design and API integration planning."]] },
];

export default function SolutionsPage() {
  return <main className="commercial-page">
    <header className="nav"><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/software">Software demos</Link><Link href="/pricing">Pricing</Link><Link href="/portal">Client portal</Link></nav></header>
    <section className="commercial-hero"><p className="eyebrow">SOFTWARE • INDUSTRY • DIGITAL SERVICES</p><h1>Technology that<br/><span>moves business forward.</span></h1><p>Explore ready-to-adapt software concepts, industry solutions and custom digital services. Start with a demo, then request a solution shaped around your operations.</p><div className="commercial-actions"><Link className="button" href="/software">Explore demo centre ↗</Link><Link className="button secondary" href="/portal">Request a solution</Link></div></section>
    {groups.map((group,i)=><section className="section commercial-section" key={group.title}><div className="section-head"><div><p className="eyebrow">SOLUTION AREA 0{i+1}</p><h2>{group.title}</h2></div><p className="section-intro">{group.intro}</p></div><div className="commercial-solution-grid">{group.items.map(item=><article key={item[0]}><span>EXPLORE SOLUTION</span><h3>{item[0]}</h3><p>{item[2]}</p><div className="commercial-card-actions"><Link href={"/demos/"+item[1]}>View sample ↗</Link><Link href="/portal">Request quote ↗</Link></div></article>)}</div></section>)}
    <section className="commercial-cta"><p className="eyebrow">NEED SOMETHING CUSTOM?</p><h2>Let's design the right solution.</h2><p>Tell us about your organisation, users, workflow and target launch date.</p><Link className="button" href="/portal">Start a project request ↗</Link></section>
    <footer><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><Link href="/pricing">Pricing</Link><Link href="/software">Software demos</Link><Link href="/portal">Client portal</Link></footer>
  </main>;
}
