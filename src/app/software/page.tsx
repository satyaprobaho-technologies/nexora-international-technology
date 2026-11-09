import Link from "next/link";

export const metadata = {
  title: "Software Demo Centre | NEXORA INTERNATIONAL TECHNOLOGY",
  description: "Explore interactive sample software workflows for accounting, education, banking concepts, retail, hospitality, healthcare and business services.",
};

const software = [
  { slug: "accounting", name: "Accounting & Finance", type: "Accounts / bookkeeping demo", detail: "Explore bookkeeping service flows, finance enquiries and a sample management dashboard.", modules: ["Bookkeeping", "Tax service workflow", "Financial reports", "Admin preview"], accent: "#047857" },
  { slug: "school", name: "School Management", type: "Education management demo", detail: "Preview academic programmes, online admission, student portal and administration screens.", modules: ["Admissions", "Student portal", "Academic programmes", "Admin preview"], accent: "#2563eb" },
  { slug: "banking", name: "Banking & Finance", type: "Non-transactional simulation", detail: "Explore sample account information, savings goals and financial education. No real banking actions.", modules: ["Account concepts", "Savings goals", "Business finance", "Help centre"], accent: "#0369a1" },
  { slug: "insurance", name: "Insurance Management", type: "Insurance information demo", detail: "Preview coverage categories, customer guidance and enquiry workflows.", modules: ["Coverage guide", "Policy information", "Claims guidance", "Quote enquiry"], accent: "#0f766e" },
  { slug: "restaurant", name: "Restaurant POS & Orders", type: "Restaurant ordering demo", detail: "Try a sample menu, cart, delivery details and simulated order-management screen.", modules: ["Menu / products", "Food cart", "Checkout preview", "Order admin"], accent: "#a16207" },
  { slug: "shop", name: "E-commerce Management", type: "Online store demo", detail: "Explore a sample product catalogue, shopping cart and simulated checkout journey.", modules: ["Product catalogue", "Shopping cart", "Delivery flow", "Store admin"], accent: "#9d174d" },
  { slug: "hotel", name: "Hotel Booking Management", type: "Hospitality booking demo", detail: "Preview room categories, booking requests, guest account and staff dashboard.", modules: ["Rooms & packages", "Booking request", "Guest account", "Booking admin"], accent: "#a16207" },
  { slug: "hospital", name: "Hospital & Clinic Management", type: "Healthcare workflow demo", detail: "Explore service directories, appointment requests and a sample patient portal.", modules: ["Departments", "Appointments", "Patient portal", "Admin preview"], accent: "#0e7490" },
  { slug: "realestate", name: "Real Estate Management", type: "Property listing demo", detail: "Browse sample property listings and explore viewing enquiry workflows.", modules: ["Property listings", "Property details", "Agent information", "Viewing enquiry"], accent: "#b45309" },
  { slug: "saas", name: "Business Workflow / SaaS", type: "Business software concept", detail: "Preview a software product concept with feature areas, workflow ideas and demo enquiries.", modules: ["Team workflows", "Task organisation", "Progress insights", "Demo request"], accent: "#2563eb" },
  { slug: "booking", name: "Appointment & Booking Platform", type: "Booking workflow demo", detail: "Explore service discovery, booking steps and provider-facing concepts.", modules: ["Service discovery", "Booking flow", "Provider concept", "Help centre"], accent: "#0e7490" },
];


const divisionDemos = [
  { division: "Dhaka", concept: "Global Accounting & Business ERP", slug: "accounting", brand: "LedgerOne International", description: "A polished finance and operations showcase for international SMEs, agencies and cross-border service businesses.", features: ["Multi-currency finance concept", "Invoices & expense workflows", "Management reporting", "Client onboarding"] },
  { division: "Chattogram", concept: "International Logistics & Trade", slug: "logistics", brand: "PortLink Global", description: "A global freight, shipment and trade-services preview inspired by the port and export ecosystem.", features: ["Freight service catalogue", "Shipment journey concept", "Trade enquiry workflow", "Business client support"] },
  { division: "Rajshahi", concept: "Agri Export & Wholesale Marketplace", slug: "grocery", brand: "HarvestBridge Trade", description: "An international produce sourcing and wholesale storefront concept for growers, exporters and buyers.", features: ["Produce catalogue", "Wholesale enquiry", "Supplier showcase", "Export buyer journey"] },
  { division: "Khulna", concept: "Aquaculture & Cold-Chain Business", slug: "shop", brand: "BlueCurrent Global", description: "A seafood and aquaculture business showcase for product discovery, wholesale enquiries and international supply partners.", features: ["Seafood product catalogue", "Wholesale order enquiry", "Quality information", "Partner onboarding"] },
  { division: "Barishal", concept: "River Tourism & Hospitality", slug: "hotel", brand: "DeltaVoyage Retreats", description: "An international-standard hospitality concept for river journeys, stays and curated guest experiences.", features: ["Stay & room showcase", "Experience catalogue", "Booking request flow", "Guest information"] },
  { division: "Sylhet", concept: "International Travel & Tea Tourism", slug: "travel", brand: "Verdant Routes", description: "A premium travel operator preview for international visitors, curated itineraries and destination enquiries.", features: ["Destination discovery", "Tour itineraries", "Custom trip enquiry", "Travel support"] },
  { division: "Rangpur", concept: "Agri Supply & Online Wholesale", slug: "grocery", brand: "NorthHarvest Exchange", description: "A digital wholesale marketplace concept connecting producers, distributors and buyers across markets.", features: ["Category-based catalogue", "Bulk purchase enquiry", "Supplier information", "Delivery workflow"] },
  { division: "Mymensingh", concept: "International Education & Student Portal", slug: "university", brand: "Meridian Global Academy", description: "A modern education portal concept for international programmes, admissions information and student services.", features: ["Programme catalogue", "Admissions journey", "Student services", "International enquiry"] },
];

export default function SoftwareDemosPage() {
  return (
    <main className="software-demo-page">
      <header className="nav">
        <Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link><Link href="/solutions">Solutions</Link><Link href="/pricing">Pricing</Link><Link href="/demos">50 Website Demos</Link><Link href="/portal">Client Portal</Link>
        </nav>
      </header>
      <section className="software-demo-hero">
        <p className="eyebrow">NEXORA SOFTWARE DEMO CENTRE</p>
        <h1>Explore software workflows before you build.</h1>
        <p>Choose a demo to explore its sample screens, forms and management workflow. Each preview is designed to help you decide what your organisation may need.</p>
        <div className="software-demo-notice"><strong>DEMO ENVIRONMENT ONLY</strong><span>These are illustrative previews. Accounts, records, orders, applications, bookings and payments are not connected to a live business database. Do not enter real passwords, sensitive personal data or payment details.</span></div>
      </section>
      <section className="section software-demo-section">
        <div className="section-head"><div><p className="eyebrow">AVAILABLE PREVIEWS</p><h2>Choose a software demo.</h2></div><p className="section-intro">Open a demo to test its sample workflow and see how it could be customised for your organisation.</p></div>
        <article className="software-demo-card" style={{ marginBottom: 22, border: "2px solid #0b8f83" }}>
          <div className="software-demo-card-top" style={{ borderTopColor: "#0b8f83" }}>
            <span>FEATURED SOFTWARE · MOBILE RESPONSIVE</span><b style={{ color: "#0b8f83" }}>৳ ৫০,০০০ · DEMO PRICE</b>
          </div>
          <div className="software-demo-card-body">
            <p className="software-demo-type">Pharmacy Management Pro · Live interactive demo</p>
            <h3>NEXORA Pharmacy Management System</h3>
            <p>মোবাইল ও কম্পিউটার উপযোগী ফার্মেসি ম্যানেজমেন্ট ডেমো। বিক্রয়/POS, ওষুধের স্টক, ব্যাচ ও মেয়াদ, ক্রয়, কাস্টমার এবং আলাদা Accounts & Finance বিভাগসহ পূর্ণাঙ্গ মডিউল দেখুন।</p>
            <div className="software-demo-tags">{["Dashboard","Sales / POS","Inventory","Purchase","Customers","Separate Accounts","Reports","Expiry Alerts","Staff & Permissions","Multi-branch"].map(module => <span key={module}>{module}</span>)}</div>
            <a className="software-demo-open" href="/pharmacy-demo/">Open Pharmacy Pro live demo ↗</a>
          </div>
        </article>
        <div className="software-demo-grid">
          {software.map((item, index) => (
            <article className="software-demo-card" key={item.slug}>
              <div className="software-demo-card-top" style={{ borderTopColor: item.accent }}>
                <span>SOFTWARE DEMO {String(index + 1).padStart(2, "0")}</span><b style={{ color: item.accent }}>NEXORA / PREVIEW</b>
              </div>
              <div className="software-demo-card-body">
                <p className="software-demo-type">{item.type}</p><h3>{item.name}</h3><p>{item.detail}</p>
                <div className="software-demo-tags">{item.modules.map(module => <span key={module}>{module}</span>)}</div>
                <Link className="software-demo-open" href={`/demos/${item.slug}`}>Open interactive demo ↗</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section division-demo-section" id="division-demos">
        <div className="section-head"><div><p className="eyebrow">8 DIVISIONS · 8 SIGNATURE CONCEPTS</p><h2>Regional ideas. International-quality demos.</h2></div><p className="section-intro">Explore one signature business-software concept inspired by each division of Bangladesh. Every preview is presented for a global audience, with international-ready workflows and customisation possibilities.</p></div>
        <div className="division-demo-grid">
          {divisionDemos.map((item,index)=><article className="division-demo-card" key={item.division}>
            <div className="division-demo-card-top"><span>DIVISION SHOWCASE / 0{index+1}</span><b>{item.division.toUpperCase()}</b></div>
            <div className="division-demo-card-body"><p className="software-demo-type">{item.brand}</p><h3>{item.concept}</h3><p>{item.description}</p>
              <div className="software-demo-tags">{item.features.map(feature=><span key={feature}>{feature}</span>)}</div>
              <div className="division-demo-actions"><Link className="software-demo-open" href={`/demos/${item.slug}`}>View full preview ↗</Link><Link className="division-demo-order" href="/#contact">Request this solution ↗</Link></div>
            </div>
          </article>)}
        </div>
        <p className="division-demo-disclaimer">These are sample concepts, not operating companies or live trade services. You can review the full demo first, then submit a project/order enquiry. NEXORA will confirm scope, pricing, delivery and payment instructions separately; no online payment is taken on demo pages.</p>
      </section>
      <section className="section software-demo-footer">
        <div><p className="eyebrow">NEED A CUSTOM SYSTEM?</p><h2>Turn a demo into your own solution.</h2><p>Tell NEXORA which modules, user roles and workflows your organisation needs. We can scope a custom build separately.</p></div>
        <Link className="button" href="/#contact">Request a custom software project ↗</Link>
      </section>
      <footer><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><p>Your Digital World Starts Here.</p><Link href="/demos">Website demos</Link><Link href="/">Back to home</Link></footer>
    </main>
  );
}
