import Link from "next/link";
const services = [
 ["Website Development","Business, education, healthcare, commerce and custom platforms."],
 ["Domain & Hosting","Domain search, shared hosting, cloud, VPS, DNS and SSL."],
 ["Client Management","Customer accounts, orders, invoices and support workflows."],
 ["Cloud & Security","Backups, monitoring, CDN and website protection."],
];
const categories = ["Education","Finance & Corporate","Hotel & Tourism","Healthcare","Business & Ecommerce","Modern Platforms"];
export default function Home() {
 return <main>
  <header className="nav"><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><nav><a href="#services">Services</a><a href="#templates">Templates</a><a href="#contact">Contact</a></nav></header>
  <section className="hero"><p className="eyebrow">DIGITAL SERVICES • GLOBAL AMBITION</p><h1>Your Digital World<br/><span>Starts Here.</span></h1><p>Build your online presence with website development, domains, hosting and dependable digital services.</p><div className="actions"><a className="button" href="#templates">Explore 50 website demos</a><a className="button secondary" href="#contact">Request a project</a></div></section>
  <section id="services"><p className="eyebrow">WHAT WE DO</p><h2>Technology services for growing businesses</h2><div className="cards">{services.map(([name,desc])=><article className="card" key={name}><h3>{name}</h3><p>{desc}</p></article>)}</div></section>
  <section id="templates"><p className="eyebrow">START WITH A TEMPLATE</p><h2>50 website demo categories</h2><p>Explore tailored concepts across six industry groups. Demo concepts are previews, not production client systems.</p><div className="cards">{categories.map((c,i)=><article className="card" key={c}><b>0{i+1}</b><h3>{c}</h3><p>Industry-ready responsive website concepts and feature modules.</p></article>)}</div></section>
  <section id="contact"><p className="eyebrow">LET'S BUILD</p><h2>Tell us what you need</h2><p>Contact: hello@nexora.example (placeholder — replace before launch)</p><p className="notice">Pre-launch preview. No domain purchases, hosting orders or payments are currently processed.</p></section>
  <footer>© {new Date().getFullYear()} NEXORA INTERNATIONAL TECHNOLOGY. All rights reserved.</footer>
 </main>
}
