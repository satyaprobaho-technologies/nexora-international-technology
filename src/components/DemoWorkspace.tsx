"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import DemoBusinessModules from "@/components/DemoBusinessModules";

type Props = { slug:string; name:string; title:string; tagline:string; intro:string; number:number; accent:string };

const navConfig:Record<string,{labels:string[];ids:string[];kind:string}> = {
 school:{labels:["Academic Overview","Admissions","Student Portal","Administration"],ids:["biz-programs","biz-admission","biz-student","biz-management"],kind:"Education"},
 college:{labels:["Departments","Admissions","Student Services","Administration"],ids:["biz-programs","biz-admission","biz-student","biz-management"],kind:"Education"},
 university:{labels:["Programmes","Applications","Research & Students","Administration"],ids:["biz-programs","biz-admission","biz-student","biz-management"],kind:"Education"},
 courses:{labels:["Course Catalogue","Enrolment","Learner Portal","Learning Admin"],ids:["biz-programs","biz-admission","biz-student","biz-management"],kind:"Education"},
 coaching:{labels:["Batches & Subjects","Registration","Student Progress","Administration"],ids:["biz-programs","biz-admission","biz-student","biz-management"],kind:"Education"},
 restaurant:{labels:["Menu & Products","Cart / Orders","Delivery","Restaurant Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"Food & Dining"},
 grocery:{labels:["Grocery Catalogue","Basket / Orders","Delivery","Store Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"Retail"},
 shop:{labels:["Product Catalogue","Shopping Cart","Checkout & Delivery","Store Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"E-commerce"},
 fashion:{labels:["Collections","Shopping Bag","Checkout","Boutique Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"Retail"},
 electronics:{labels:["Devices","Shopping Cart","Checkout & Delivery","Store Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"Retail"},
 furniture:{labels:["Furniture Catalogue","Shopping Cart","Delivery","Showroom Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"Retail"},
 pharmacy:{labels:["Wellness Catalogue","Shopping Cart","Checkout","Pharmacy Admin"],ids:["biz-products","biz-cart","biz-delivery","biz-management"],kind:"Healthcare Retail"},
 hotel:{labels:["Rooms & Services","Reservations","Guest Account","Hotel Admin"],ids:["biz-services","biz-booking","biz-account","biz-management"],kind:"Hospitality"},
 resort:{labels:["Villas & Packages","Stay Booking","Guest Account","Resort Admin"],ids:["biz-services","biz-booking","biz-account","biz-management"],kind:"Hospitality"},
 travel:{labels:["Destinations","Trip Booking","Traveller Account","Agency Admin"],ids:["biz-services","biz-booking","biz-account","biz-management"],kind:"Travel"},
 tour:{labels:["Tours & Itineraries","Tour Booking","Traveller Account","Tour Admin"],ids:["biz-services","biz-booking","biz-account","biz-management"],kind:"Travel"},
 booking:{labels:["Services","Appointment Booking","Customer Account","Provider Admin"],ids:["biz-services","biz-booking","biz-account","biz-management"],kind:"Booking"},
 hospital:{labels:["Departments","Appointments","Patient Portal","Hospital Admin"],ids:["biz-services","biz-appointment","biz-patient","biz-management"],kind:"Healthcare"},
 clinic:{labels:["Clinic Services","Appointments","Patient Portal","Clinic Admin"],ids:["biz-services","biz-appointment","biz-patient","biz-management"],kind:"Healthcare"},
 dental:{labels:["Treatments","Appointments","Patient Portal","Dental Admin"],ids:["biz-services","biz-appointment","biz-patient","biz-management"],kind:"Healthcare"},
 diagnostic:{labels:["Test Directory","Test Booking","Patient Reports","Centre Admin"],ids:["biz-services","biz-appointment","biz-patient","biz-management"],kind:"Healthcare"},
 beauty:{labels:["Treatments","Appointments","Client Profile","Salon Admin"],ids:["biz-services","biz-appointment","biz-patient","biz-management"],kind:"Personal Services"},
 fitness:{labels:["Membership & Classes","Class Booking","Member Portal","Gym Admin"],ids:["biz-services","biz-appointment","biz-patient","biz-management"],kind:"Fitness"},
 portfolio:{labels:["Project Portfolio","Project Enquiries","Client Workspace","Portfolio CMS"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Creative Studio"},
 agency:{labels:["Agency Services","Creative Briefs","Client Review Portal","Agency Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Creative Agency"},
 corporate:{labels:["Business Solutions","Corporate Enquiries","Partner Workspace","Corporate Admin"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Corporate"},
 startup:{labels:["Product Overview","Early Access","Member Workspace","Product Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Startup"},
 consulting:{labels:["Advisory Services","Consultation Request","Client Engagement","Consulting CRM"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Consulting"},
 accounting:{labels:["Accounting Services","Client Onboarding","Secure Documents","Accounts Dashboard"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Accounting"},
 law:{labels:["Legal Practice Areas","Consultation Intake","Client Matter Portal","Legal Office Admin"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Legal Services"},
 banking:{labels:["Banking Services","Service Enquiry","Customer Finance Portal","Banking Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Financial Services"},
 insurance:{labels:["Coverage Catalogue","Quote & Claim Enquiry","Policyholder Portal","Insurance Admin"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Insurance"},
 realestate:{labels:["Property Listings","Viewing Scheduler","Buyer & Seller Portal","Property CRM"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Real Estate"},
 ngo:{labels:["Programmes & Impact","Volunteer Registration","Donor Portal","NGO Dashboard"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Non-profit"},
 community:{labels:["Community Directory","Event Registration","Member Area","Community Admin"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Community"},
 news:{labels:["Editorial Sections","Newsletter Signup","Reader Account","Editorial CMS"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"News & Media"},
 blog:{labels:["Article Library","Reader Subscription","Author Workspace","Editorial Dashboard"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Publishing"},
 event:{labels:["Agenda & Speakers","Attendee Registration","Attendee Portal","Event Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Events"},
 automotive:{labels:["Workshop Services","Vehicle Service Booking","Service History","Workshop Management"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Automotive"},
 construction:{labels:["Construction Services","Project Consultation","Client Project Tracker","Project Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Construction"},
 interior:{labels:["Interior Portfolio","Design Consultation","Client Design Workspace","Studio Dashboard"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Interior Design"},
 logistics:{labels:["Freight & Shipment","Shipment Booking","Business Client Portal","Fleet & Dispatch"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Logistics"},
 cleaning:{labels:["Cleaning Services","Service Scheduling","Customer Service History","Team Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Cleaning Services"},
 repair:{labels:["Repair Services","Repair Ticket","Customer Repair Tracker","Workshop Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Repair Services"},
 photo:{labels:["Photography Portfolio","Session Booking","Client Gallery","Studio Management"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Photography"},
 wedding:{labels:["Wedding Packages","Event Consultation","Couple Planning Portal","Wedding Operations"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Wedding"},
 saas:{labels:["Product Features","Workspace Registration","Team Workspace","SaaS Admin"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"SaaS"},
 app:{labels:["App Features","App Access Request","User Account Centre","App Content Dashboard"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Mobile App"},
 technology:{labels:["Technology Solutions","Technical Consultation","Support Client Portal","IT Service Desk"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Technology"},
 membership:{labels:["Membership Plans","Membership Registration","Member Benefits Portal","Membership Admin"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Membership"},
};
const generic = {labels:["Services & Catalogue","Online Request","Customer Account","Management Dashboard"],ids:["biz-services","biz-request","biz-account","biz-management"],kind:"Business Website"};
const icons = ["▦","✦","▣","⚙"];

export default function DemoWorkspace({slug,name,title,tagline,intro,number,accent}:Props) {
 const config=navConfig[slug]??generic;
 const jump=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
 return <main className="demo-workspace" style={{"--workspace-accent":accent} as CSSProperties}>
  <aside className="dw-sidebar">
   <Link href="/demos" className="dw-brand"><span className="dw-brand-mark">N</span><span>NEXORA<small>LIVE WEBSITE DEMO</small></span></Link>
   <div className="dw-side-caption">WORKSPACE</div>
   <button className="dw-side-link active" onClick={()=>jump("dw-overview")}><b>⌂</b> Dashboard</button>
   <div className="dw-side-caption">WEBSITE MODULES</div>
   {config.labels.map((label,i)=><button className="dw-side-link" key={label} onClick={()=>jump(config.ids[i])}><b>{icons[i]}</b><span>{label}</span></button>)}
   <div className="dw-sidebar-bottom"><span className="dw-live-dot"></span> Interactive preview<br/><small>Sample data · No live transactions</small></div>
  </aside>
  <section className="dw-main">
   <header className="dw-topbar"><div><span className="dw-breadcrumb">WEBSITE DEMO / {name.toUpperCase()}</span><h1>{title}</h1></div><div className="dw-top-actions"><span className="dw-demo-pill">● LIVE DEMO</span><Link href="/demos">All demos ↗</Link></div></header>
   <section className="dw-overview" id="dw-overview">
    <div className="dw-welcome"><div><span className="dw-eyebrow">{config.kind.toUpperCase()} · CONCEPT {String(number).padStart(2,"0")}/50</span><h2>{tagline}</h2><p>{intro}</p><button onClick={()=>jump(config.ids[0])}>Explore {config.labels[0]} ↗</button></div><div className="dw-welcome-art"><span>{name.slice(0,1).toUpperCase()}</span><small>YOUR BUSINESS<br/>AT A GLANCE</small></div></div>
    <div className="dw-metrics"><article><span>Website status</span><b><i></i> Active preview</b><small>Responsive demo environment</small></article><article><span>Modules available</span><b>04</b><small>Explore the business workflows</small></article><article><span>Experience</span><b>Interactive</b><small>Forms and actions are simulated</small></article><article><span>Device support</span><b>Mobile + Desktop</b><small>Adaptive layout</small></article></div>
    <div className="dw-quick-head"><div><span className="dw-eyebrow">QUICK ACCESS</span><h3>Open a module</h3></div><span>Choose a module to see its full preview</span></div>
    <div className="dw-quick-grid">{config.labels.map((label,i)=><button key={label} onClick={()=>jump(config.ids[i])}><span>{icons[i]}</span><b>{label}</b><small>Open module →</small></button>)}</div>
   </section>
   <div className="dw-module-wrap"><DemoBusinessModules slug={slug}/></div>
   <footer className="dw-footer"><span>© NEXORA INTERNATIONAL TECHNOLOGY · CONCEPT {String(number).padStart(2,"0")}/50</span><span>Demo environment only · <Link href="/portal">Request a custom website ↗</Link></span></footer>
  </section>
 </main>;
}
