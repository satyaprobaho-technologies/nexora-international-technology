"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

const education = ["school","college","university","courses","coaching"];
const food = ["restaurant","grocery"];
const shop = ["shop","fashion","electronics","furniture","pharmacy"];
const stay = ["hotel","resort","travel","tour","booking"];
const care = ["hospital","clinic","dental","diagnostic","beauty","fitness"];
const names:Record<string,string[]> = {
 school:["Playgroup Admission","Primary Admission","Secondary Admission","Campus Tour"],
 college:["HSC Science","HSC Business Studies","HSC Humanities","Campus Visit"],
 university:["BSc Computer Science","BBA","BA English","Masters Programme"],
 courses:["Digital Marketing","Web Development","Graphic Design","Python Programming"],
 coaching:["SSC Science Batch","HSC Admission Batch","IELTS Preparation","Weekly Model Test"],
 restaurant:["Chicken Biryani","Beef Burger","Grilled Chicken","Chocolate Cake"],
 grocery:["Fresh Vegetable Box","Fruit Basket","Daily Grocery Pack","Household Essentials"],
 shop:["Canvas Tote Bag","Ceramic Desk Set","Water Bottle","Cotton Notebook"],
 fashion:["Linen Shirt","Tailored Trousers","Weekend Bag","Everyday Scarf"],
 electronics:["NovaBook Laptop","Wireless Headphones","Smart Display","USB-C Dock"],
 furniture:["Living Room Sofa","Dining Table","Queen Bed","Workspace Desk"],
 pharmacy:["Personal Care Pack","First Aid Kit","Wellness Essentials","Baby Care Pack"],
 hotel:["Deluxe Room","Executive Suite","Family Room","Conference Hall"],
 resort:["Garden Villa","Poolside Suite","Family Cottage","Wellness Package"],
 travel:["Cox's Bazar Tour","Sylhet Tea Garden","Sundarbans Tour","Kathmandu Package"],
 tour:["Old Dhaka Walk","Food Trail","Tea Garden Day Tour","River Cruise"],
 booking:["Consultation Slot","Home Service Visit","Salon Appointment","Business Meeting"],
 hospital:["Medicine Consultation","Cardiology Department","Paediatrics","Diagnostic Services"],
 clinic:["General Consultation","Family Health","Preventive Check-up","Follow-up Visit"],
 dental:["Dental Check-up","Scaling & Polishing","Restorative Consultation","Children's Dental Visit"],
 diagnostic:["Blood Test Package","Ultrasound","X-ray","Health Screening"],
 beauty:["Signature Haircut","Hair Treatment","Makeup Session","Bridal Styling"],
 fitness:["Gym Membership","Personal Training","Group Class","Yoga Session"]
};
const prices:Record<string,number[]> = {
 restaurant:[280,350,520,220],grocery:[650,950,1250,780],shop:[850,1250,650,420],fashion:[2200,2600,2850,950],electronics:[78000,5900,12500,4200],furniture:[68000,42000,35000,18500],pharmacy:[450,650,850,720],hotel:[8500,14000,12000,5000],resort:[12000,16000,21000,4500],travel:[6500,8500,12000,18500],tour:[1200,1800,2500,3200],booking:[500,800,1200,1500],beauty:[1200,2000,2500,4500],fitness:[1800,3500,1200,2500]
};

const moduleLabels:Record<string,string[]> = {
 school:["Academic Overview","Online Admissions","Student & Guardian Portal","School Administration"],
 college:["Departments & Courses","College Admissions","Student Services","College Administration"],
 university:["Degree Catalogue","Application & Enrolment","Research & Student Portal","University Administration"],
 courses:["Course Catalogue","Course Enrolment","Learner Dashboard","Learning Management"],
 coaching:["Batch & Subject Directory","Batch Registration","Student Progress Portal","Coaching Administration"],
 portfolio:["Project Showcase","Project Enquiry","Client Workspace","Portfolio Content Manager"],
 agency:["Creative Services","Project Brief Intake","Client Review Portal","Agency Operations"],
 corporate:["Business Solutions","Corporate Enquiries","Partner Workspace","Corporate Administration"],
 startup:["Product Features","Early Access Registration","Member Workspace","Product Operations"],
 consulting:["Advisory Services","Consultation Booking","Client Engagement Portal","Consulting CRM"],
 accounting:["Accounting Services","Client Onboarding","Secure Client Document Area","Accounts Practice Dashboard"],
 law:["Practice Areas","Consultation Intake","Client Matter Portal","Legal Office Dashboard"],
 banking:["Account Information","Service Enquiry","Customer Finance Portal","Banking Operations Preview"],
 insurance:["Coverage Catalogue","Quote & Claim Enquiry","Policyholder Information","Insurance Operations"],
 realestate:["Property Listings","Viewing Scheduler","Buyer & Seller Workspace","Property CRM"],
 hotel:["Rooms & Suites","Reservation Enquiry","Guest Services Portal","Hotel Front Desk"],
 resort:["Villas & Experiences","Stay Planner","Guest Concierge Portal","Resort Operations"],
 travel:["Destination Catalogue","Trip Planning Request","Traveller Workspace","Travel Agency CRM"],
 tour:["Tour & Itinerary Catalogue","Tour Reservation","Traveller Information","Tour Operations"],
 restaurant:["Menu & Table Services","Food Order & Table Request","Guest Loyalty Area","Restaurant POS & Kitchen"],
 hospital:["Departments & Specialists","Appointment & Referral","Patient Services Portal","Hospital Administration"],
 clinic:["Consultation Services","Appointment Scheduling","Patient Records Preview","Clinic Administration"],
 dental:["Dental Treatments","Dental Appointment","Patient Smile Plan","Dental Clinic Dashboard"],
 diagnostic:["Test Directory","Test Booking","Patient Report Collection","Diagnostic Centre Operations"],
 pharmacy:["Wellness Catalogue","Product Enquiry","Customer Care Area","Pharmacy Store Administration"],
 ngo:["Programmes & Impact","Volunteer Registration","Donor & Volunteer Area","NGO Programme Dashboard"],
 community:["Community Directory","Event Registration","Member Area","Community Administration"],
 news:["Editorial Sections","Newsletter Registration","Reader Account","Editorial CMS"],
 blog:["Article Library","Reader Subscription","Author Workspace","Editorial Dashboard"],
 event:["Agenda & Speakers","Attendee Registration","Attendee Portal","Event Operations"],
 shop:["Product Catalogue","Shopping Cart & Checkout","Customer Order Portal","E-commerce Store Admin"],
 fashion:["Collections & Size Guide","Style Enquiry","Customer Wishlist","Boutique Inventory"],
 electronics:["Device Catalogue","Product Support Request","Warranty & Service Portal","Electronics Store Admin"],
 grocery:["Fresh Produce Catalogue","Grocery Basket & Delivery","Customer Order Portal","Grocery Inventory"],
 furniture:["Room Collections","Showroom Appointment","Customer Project Book","Furniture Catalogue Admin"],
 beauty:["Treatment Menu","Stylist Appointment","Client Beauty Profile","Salon Front Desk"],
 fitness:["Membership Plans","Class & Trainer Booking","Member Fitness Portal","Gym Operations"],
 automotive:["Workshop Services","Vehicle Service Booking","Vehicle Service History","Workshop Management"],
 construction:["Construction Services","Project Consultation","Client Project Tracker","Project Operations"],
 interior:["Interior Design Portfolio","Design Consultation","Client Design Workspace","Studio Project Dashboard"],
 logistics:["Freight & Shipment Services","Shipment Booking","Business Client Portal","Fleet & Dispatch Dashboard"],
 cleaning:["Cleaning Service Catalogue","Service Scheduling","Customer Service History","Cleaning Team Operations"],
 repair:["Repair Service Directory","Repair Ticket Submission","Customer Repair Tracker","Workshop Operations"],
 photo:["Photography Portfolio","Session Booking","Client Gallery","Studio Management"],
 wedding:["Wedding Packages","Event Consultation","Couple Planning Workspace","Wedding Operations"],
 saas:["Product Feature Hub","Workspace Registration","Team Workspace","SaaS Admin Console"],
 app:["App Feature Catalogue","App Access Request","User Account Centre","App Content Dashboard"],
 technology:["Technology Solutions","Technical Consultation","Support Client Portal","IT Service Desk"],
 membership:["Membership Plans","Membership Registration","Member Benefits Portal","Membership Administration"],
 booking:["Service Directory","Appointment Scheduler","Customer Booking Portal","Provider Dashboard"]
};
const moduleGroups:Record<string,string[]> = {
 school:["programs","admission","student","management"],college:["programs","admission","student","management"],university:["programs","admission","student","management"],courses:["programs","admission","student","management"],coaching:["programs","admission","student","management"],
 restaurant:["products","cart","delivery","management"],grocery:["products","cart","delivery","management"],shop:["products","cart","delivery","management"],fashion:["products","cart","delivery","management"],electronics:["products","cart","delivery","management"],furniture:["products","cart","delivery","management"],pharmacy:["products","cart","delivery","management"],
 hotel:["services","booking","account","management"],resort:["services","booking","account","management"],travel:["services","booking","account","management"],tour:["services","booking","account","management"],booking:["services","booking","account","management"],
 hospital:["services","appointment","patient","management"],clinic:["services","appointment","patient","management"],dental:["services","appointment","patient","management"],diagnostic:["services","appointment","patient","management"],beauty:["services","appointment","patient","management"],fitness:["services","appointment","patient","management"]
};

const isEdu=(s:string)=>education.includes(s);
const isFood=(s:string)=>food.includes(s);
const isShop=(s:string)=>shop.includes(s);
const isStay=(s:string)=>stay.includes(s);
const isCare=(s:string)=>care.includes(s);
const money=(n:number)=>"৳"+n.toLocaleString("en-BD");

export default function DemoBusinessModules({slug}:{slug:string}) {
 const [cart,setCart]=useState<number[]>([]);
 const [logged,setLogged]=useState(false);
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [notice,setNotice]=useState("");
 const [reviewed,setReviewed]=useState<string[]>([]);
 const [studentName,setStudentName]=useState("");
 const [phone,setPhone]=useState("");
 const [choice,setChoice]=useState("");
 const [date,setDate]=useState("");
 const [address,setAddress]=useState("");
 const [tab,setTab]=useState("overview");
 const items=names[slug]??(moduleLabels[slug]??["Service Information","Featured Package","Customer Support","Request Consultation"]).slice(0,4);
 const unitPrices=prices[slug]??[0,0,0,0];
 const total=cart.reduce((sum,i)=>sum+(unitPrices[i]||0),0);
 const modules=useMemo(()=>{
  const ids=moduleGroups[slug]??["services","request","account","management"];
  const labels=moduleLabels[slug]??["Business Services","Online Enquiry","Customer Account","Business Administration"];
  return ids.map((id,index)=>({id,label:labels[index]}));
 },[slug]);
 const jump=(id:string)=>{setTab(id);document.getElementById("biz-"+id)?.scrollIntoView({behavior:"smooth",block:"start"})};
 const submit=(e:FormEvent<HTMLFormElement>,message:string)=>{e.preventDefault();setNotice(message)};
 const accountBox=<section className="biz-panel" id="biz-account"><div className="biz-panel-head"><span>ACCOUNT CENTER</span><h3>{logged?"Your demo account":"Sign in / Create an account"}</h3><p>Customer access area preview. Authentication is simulated; no real account is created.</p></div>{logged?<div className="biz-confirm"><b>Welcome to your demo dashboard</b><p>{email}</p><div className="biz-mini-grid"><span>Profile <b>Complete your details</b></span><span>Orders / Requests <b>View sample history</b></span><span>Notifications <b>No new messages</b></span></div><button onClick={()=>{setLogged(false);setNotice("You have signed out of the demo account.")}}>Sign out</button></div>:<form className="biz-form" onSubmit={e=>{e.preventDefault();setLogged(true);setNotice("Demo sign-in successful. This is not a real account.")}}><label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input required type="password" minLength={4} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter any demo password"/></label><div className="biz-form-actions"><button type="submit">Sign in</button><button type="button" className="biz-secondary" onClick={()=>{setLogged(true);setNotice("Demo account created locally for this preview.")}}>Create demo account</button></div></form>}</section>;
 const requestForm=(title:string,button:string)=><section className="biz-panel" id="biz-request"><div className="biz-panel-head"><span>ONLINE REQUEST CENTER</span><h3>{title}</h3><p>Complete the sample form to see the customer journey. Nothing is sent to a real organisation.</p></div><form className="biz-form" onSubmit={e=>submit(e,"Your sample request has been completed. No data was sent or saved.")}><label>Full name<input required value={studentName} onChange={e=>setStudentName(e.target.value)} placeholder="Your full name"/></label><label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></label><label>Phone number<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+880 1XXXXXXXXX"/></label><label>Choose an option<select required value={choice} onChange={e=>setChoice(e.target.value)}><option value="">Select one</option>{items.map(x=><option key={x}>{x}</option>)}</select></label><label>Additional details<textarea placeholder="Write your requirements..."/></label><button type="submit">{button}</button></form></section>;
 return <section className="biz-suite" id="business-modules">
  <div className="biz-suite-top"><div><span className="biz-eyebrow">INTERACTIVE WEBSITE MODULES</span><h2>Explore how the actual website works</h2><p>Use the navigation below to test the key pages, customer actions and management flow.</p></div><button className="biz-account-trigger" onClick={()=>jump("account")}>♙ {logged?"My account":"Customer login"}</button></div>
  <div className="biz-module-nav" aria-label="Website module navigation">{modules.map(m=><button key={m.id} className={tab===m.id?"active":""} onClick={()=>jump(m.id)}>{m.label}</button>)}{!isEdu(slug)&&!isFood(slug)&&!isShop(slug)&&!isStay(slug)&&!isCare(slug)&&<button onClick={()=>jump("account")}>Customer Account</button>}</div>
  {(isFood(slug)||isShop(slug))&&<><section className="biz-panel" id="biz-products"><div className="biz-panel-head"><span>{isFood(slug)?"ORDER ONLINE":"SHOP ONLINE"}</span><h3>{isFood(slug)?"Browse the menu and add items to your cart":"Browse products and add to your shopping bag"}</h3><p>Product/menu → cart → customer details → delivery option → order confirmation.</p></div><div className="biz-product-grid">{items.map((item,i)=><article key={item}><div className="biz-product-visual"><span>{isFood(slug)?"MENU ITEM":"PRODUCT"}</span><b>0{i+1}</b></div><div className="biz-product-info"><h4>{item}</h4><p>{isFood(slug)?"Freshly prepared sample menu item. Customise this description, ingredients and options.":"Sample product description with configurable size, colour and stock details."}</p><div><strong>{money(unitPrices[i]||500)}</strong><button onClick={()=>setCart(old=>[...old,i])}>＋ Add to cart</button></div></div></article>)}</div></section><section className="biz-panel" id="biz-cart"><div className="biz-panel-head"><span>{isFood(slug)?"FOOD ORDER":"SHOPPING BAG"}</span><h3>Your cart <small>({cart.length} items)</small></h3></div>{cart.length===0?<p className="biz-empty">Your cart is empty. Add products from the menu above.</p>:<><div className="biz-cart-list">{cart.map((idx,n)=><div key={n}><span>{items[idx]}</span><b>{money(unitPrices[idx]||500)}</b><button onClick={()=>setCart(old=>old.filter((_,i)=>i!==n))}>Remove</button></div>)}</div><div className="biz-cart-total"><span>Subtotal</span><b>{money(total)}</b></div><button onClick={()=>jump("delivery")}>Continue to checkout →</button></>}</section><section className="biz-panel" id="biz-delivery"><div className="biz-panel-head"><span>DELIVERY & CHECKOUT</span><h3>{isFood(slug)?"Where should we deliver your food?":"Delivery details & checkout"}</h3><p>Choose pickup or delivery, provide a delivery address and select a sample payment method.</p></div><form className="biz-form" onSubmit={e=>submit(e,"Demo order placed successfully. No restaurant/store received this order and no payment was taken.")}><label>Customer name<input required value={studentName} onChange={e=>setStudentName(e.target.value)}/></label><label>Phone<input required value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Delivery address<textarea required value={address} onChange={e=>setAddress(e.target.value)} placeholder="House, road, area, city"/></label><label>Fulfilment<select><option>Home delivery</option><option>Pickup from store</option></select></label><label>Payment option<select><option>Cash on delivery (demo)</option><option>bKash (demo only)</option><option>Nagad (demo only)</option></select></label><div className="biz-cart-total"><span>Demo total</span><b>{money(total)}</b></div><button type="submit" disabled={!cart.length}>Place sample order</button></form></section></>}
  {isEdu(slug)&&<><section className="biz-panel" id="biz-programs"><div className="biz-panel-head"><span>ACADEMIC CATALOGUE</span><h3>Choose your class, programme or course</h3><p>Programme details → eligibility → online application → student account → admission status.</p></div><div className="biz-program-grid">{items.map((x,i)=><article key={x}><span>PROGRAMME 0{i+1}</span><h4>{x}</h4><p>{["Eligibility and required documents","Class routine and academic calendar","Qualified teachers and support","Assessment, results and progress"][i]}</p><button onClick={()=>{setChoice(x);jump("admission")}}>Apply for this programme ↗</button></article>)}</div></section><section className="biz-panel" id="biz-admission"><div className="biz-panel-head"><span>ONLINE ADMISSION</span><h3>Student admission application</h3><p>Student information → guardian details → programme selection → document checklist → application receipt.</p></div><form className="biz-form" onSubmit={e=>submit(e,"Application submitted in preview. No admission record was created.")}><label>Student full name<input required value={studentName} onChange={e=>setStudentName(e.target.value)} placeholder="Student name"/></label><label>Parent / guardian name<input required placeholder="Guardian name"/></label><label>Student email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Contact number<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+880"/></label><label>Class / course<select required value={choice} onChange={e=>setChoice(e.target.value)}><option value="">Select programme</option>{items.map(x=><option key={x}>{x}</option>)}</select></label><label>Previous institution<input placeholder="Previous school / institution"/></label><label>Address<textarea required value={address} onChange={e=>setAddress(e.target.value)}/></label><div className="biz-checklist"><b>Required documents checklist</b><span>□ Birth certificate / ID</span><span>□ Previous academic transcript</span><span>□ Student photograph</span><span>□ Guardian contact information</span></div><button type="submit">Submit admission application ↗</button></form></section><section className="biz-panel" id="biz-student"><div className="biz-panel-head"><span>STUDENT & PARENT PORTAL</span><h3>Student account access</h3><p>Sign in to view sample attendance, fees, notices, class routine and results.</p></div>{accountBox}</section></>}
  {isStay(slug)&&<><section className="biz-panel" id="biz-services"><div className="biz-panel-head"><span>ROOMS, TOURS & PACKAGES</span><h3>Choose an experience</h3><p>Explore packages, select a date and send a booking enquiry.</p></div><div className="biz-program-grid">{items.map((x,i)=><article key={x}><span>OPTION 0{i+1}</span><h4>{x}</h4><p>Package details, inclusions, availability and cancellation information.</p><button onClick={()=>{setChoice(x);jump("booking")}}>Select this option</button></article>)}</div></section><section className="biz-panel" id="biz-booking"><div className="biz-panel-head"><span>BOOKING REQUEST</span><h3>Plan your visit or journey</h3><p>Choose a package, date, guests and contact details. This is a demo request only.</p></div><form className="biz-form" onSubmit={e=>submit(e,"Your demo booking enquiry is complete. No reservation was made.")}><label>Full name<input required value={studentName} onChange={e=>setStudentName(e.target.value)}/></label><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Phone<input required value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Package / service<select required value={choice} onChange={e=>setChoice(e.target.value)}><option value="">Choose option</option>{items.map(x=><option key={x}>{x}</option>)}</select></label><label>Preferred date<input required type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label>Guests / travellers<input type="number" min="1" defaultValue="2"/></label><label>Special requests<textarea placeholder="Tell us your preferences..."/></label><button type="submit">Send booking enquiry ↗</button></form></section>{accountBox}</>}
  {isCare(slug)&&<><section className="biz-panel" id="biz-services"><div className="biz-panel-head"><span>SERVICE DIRECTORY</span><h3>Explore services and specialists</h3><p>Service details → specialist selection → appointment request → patient account.</p></div><div className="biz-program-grid">{items.map((x,i)=><article key={x}><span>SERVICE 0{i+1}</span><h4>{x}</h4><p>Service overview, preparation notes, estimated duration and support information.</p><button onClick={()=>{setChoice(x);jump("appointment")}}>Request appointment</button></article>)}</div></section><section className="biz-panel" id="biz-appointment"><div className="biz-panel-head"><span>APPOINTMENT REQUEST</span><h3>Request a visit</h3><p>This sample form does not diagnose, prescribe or confirm a real appointment.</p></div><form className="biz-form" onSubmit={e=>submit(e,"Appointment request completed in preview only. No clinic received it.")}><label>Patient name<input required value={studentName} onChange={e=>setStudentName(e.target.value)}/></label><label>Phone<input required value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Service<select required value={choice} onChange={e=>setChoice(e.target.value)}><option value="">Choose service</option>{items.map(x=><option key={x}>{x}</option>)}</select></label><label>Preferred date<input type="date" required value={date} onChange={e=>setDate(e.target.value)}/></label><label>Additional notes<textarea placeholder="Optional notes for the clinic..."/></label><button type="submit">Send appointment request ↗</button></form></section><section className="biz-panel" id="biz-patient"><div className="biz-panel-head"><span>PATIENT PORTAL</span><h3>Patient account</h3><p>Access appointment requests, reports and patient information in the finished system.</p></div>{accountBox}</section></>}
  {!isEdu(slug)&&!isFood(slug)&&!isShop(slug)&&!isStay(slug)&&!isCare(slug)&&<><section className="biz-panel" id="biz-services"><div className="biz-panel-head"><span>BUSINESS SERVICES & MODULES</span><h3>Choose what you need</h3><p>Each card represents a page or module that can be customised for this organisation.</p></div><div className="biz-program-grid">{items.map((x,i)=><article key={x}><span>MODULE 0{i+1}</span><h4>{x}</h4><p>Details, service information, eligibility or product information with a clear next step.</p><button onClick={()=>{setChoice(x);jump("request")}}>Explore / request ↗</button></article>)}</div></section>{requestForm("Send a service or project request","Submit sample request")}{accountBox}</>}
  {notice&&<div className="biz-notice" role="status"><b>✓ {notice}</b><button onClick={()=>setNotice("")}>Dismiss</button></div>}
  <section className="biz-panel" id="biz-management"><div className="biz-panel-head"><span>ORGANISATION ADMINISTRATION</span><h3>{isEdu(slug)?"Admission & student management":isFood(slug)?"Order & delivery management":isShop(slug)?"Product & order management":isStay(slug)?"Booking & guest management":isCare(slug)?"Appointment & patient management":"Website admin dashboard"}</h3><p>Preview the private staff area: review incoming requests, update their status and monitor the organisation's activity.</p></div><div className="biz-admin-metrics"><article><b>12</b><span>New requests</span></article><article><b>08</b><span>In progress</span></article><article><b>24</b><span>Completed</span></article><article><b>96%</b><span>Response tracking</span></article></div><div className="biz-admin-toolbar"><b>{isEdu(slug)?"Recent admission applications":isFood(slug)?"Recent food orders":isShop(slug)?"Recent customer orders":isStay(slug)?"Recent booking requests":isCare(slug)?"Recent appointment requests":"Recent customer enquiries"}</b><span>STAFF PREVIEW · SAMPLE RECORDS</span></div><div className="biz-admin-table"><div className="biz-admin-row biz-admin-header"><span>REFERENCE</span><span>CUSTOMER / STUDENT</span><span>REQUEST</span><span>STATUS</span><span>ACTION</span></div>{["NX-2048","NX-2047","NX-2046"].map((ref,i)=><div className="biz-admin-row" key={ref}><span>{ref}</span><span>{["Ayesha Rahman","Tanvir Hasan","Nusrat Jahan"][i]}</span><span>{isEdu(slug)?["Primary Admission","Class 8 Admission","Science Batch"][i]:isFood(slug)?["Food delivery order","Family meal order","Pickup order"][i]:isStay(slug)?["Room / tour booking","Family reservation","Date enquiry"][i]:isCare(slug)?["Consultation request","Follow-up visit","Service enquiry"][i]:["Website enquiry","Service request","Product enquiry"][i]}</span><span><i className={reviewed.includes(ref)?"done":""}>{reviewed.includes(ref)?"Reviewed":i===0?"New":i===1?"In progress":"Pending"}</i></span><span><button onClick={()=>setReviewed(old=>old.includes(ref)?old.filter(x=>x!==ref):[...old,ref])}>{reviewed.includes(ref)?"Undo":"Review"}</button></span></div>)}</div><p className="biz-admin-footnote">The completed website can connect this dashboard to a secure database, staff permissions, email/SMS notifications and real customer records.</p></section>
  <p className="biz-disclaimer">DEMO MODE ONLY · Forms, accounts, orders, applications and bookings are simulated in this preview. No personal data is transmitted or stored.</p>
 </section>;
}
