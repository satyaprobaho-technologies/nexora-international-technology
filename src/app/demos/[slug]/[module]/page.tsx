"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
const moduleGroups = [
"হোমপেজ",
"মসজিদের পরিচিতি",
"মসজিদের ইতিহাস",
"নামাজের সময়সূচি",
"আজানের সময়সূচি",
"জুমার নামাজের সময়",
"ইমাম ও খতিব পরিচিতি",
"পরিচালনা কমিটি",
"নোটিশ বোর্ড",
"অনুষ্ঠানসূচি",
"ফটো গ্যালারি",
"ভিডিও গ্যালারি",
"জুমার খুতবা আর্কাইভ",
"কুরআন ও হাদিস",
"যোগাযোগ ও মানচিত্র",
"ইসলামিক প্রবন্ধ ও ব্লগ",
"ইসলামিক শিক্ষা",
"অনলাইন অনুষ্ঠান নিবন্ধন",
"ওয়েবসাইট সার্চ",
"ইমেইল আপডেট সাবস্ক্রিপশন",
"অনলাইন সদস্য নিবন্ধন",
"সদস্য প্রোফাইল",
"অভিযোগ ও পরামর্শ",
"ইভেন্ট ক্যালেন্ডার",
"ভিজিটর পরিসংখ্যান",
"ফাউন্ডেশন পরিচিতি",
"লক্ষ্য ও উদ্দেশ্য",
"দরিদ্র পরিবার সহায়তা",
"এতিম সহায়তা",
"শিক্ষাবৃত্তি ব্যবস্থাপনা",
"চিকিৎসা সহায়তা",
"দুর্যোগ ও ত্রাণ কার্যক্রম",
"স্বেচ্ছাসেবক ব্যবস্থাপনা",
"ফাউন্ডেশন প্রকল্প",
"সহায়তার আবেদন",
"উপকারভোগী ব্যবস্থাপনা",
"অনলাইন অনুদান",
"যাকাত ব্যবস্থাপনা",
"সদকা ব্যবস্থাপনা",
"অনলাইন পেমেন্ট",
"ডিজিটাল রসিদ",
"দাতা প্রোফাইল",
"অনুদান ট্র্যাকিং",
"আয়-ব্যয় হিসাব",
"বাজেট পরিকল্পনা",
"ক্রয় ও বিল ব্যবস্থাপনা",
"বার্ষিক আর্থিক প্রতিবেদন",
"স্পনসরশিপ ব্যবস্থাপনা",
"ইউটিউব সংযোগ",
"লাইভ সম্প্রচার",
"ভিডিও আর্কাইভ",
"YouTube Shorts ব্যবস্থাপনা",
"ভিডিও প্রকাশনা নিয়ন্ত্রণ",
"মিডিয়া পরিসংখ্যান",
"মাল্টি-অ্যাডমিন ড্যাশবোর্ড",
"ভূমিকা ও অনুমতিভিত্তিক নিয়ন্ত্রণ",
"কনটেন্ট অনুমোদন ও প্রকাশনা",
"অ্যাডমিন কার্যক্রমের অডিট লগ",
"ডেটা ব্যাকআপ ও পুনরুদ্ধার",
"বহুভাষিক কনটেন্ট ব্যবস্থাপনা"
];
const packages:Record<string,{price:string;count:number;roles:string[]}> = {
"1":{price:"৭০,০০০",count:15,roles:["প্রধান অ্যাডমিন","কনটেন্ট সম্পাদক"]},
"2":{price:"১,২০,০০০",count:20,roles:["প্রধান অ্যাডমিন","মসজিদ সম্পাদক"]},
"3":{price:"১,৭০,০০০",count:25,roles:["সুপার অ্যাডমিন","মসজিদ অ্যাডমিন","কনটেন্ট সম্পাদক"]},
"4":{price:"২,২০,০০০",count:60,roles:["সুপার অ্যাডমিন","মোতাওয়াল্লী","মসজিদ অ্যাডমিন","ফাউন্ডেশন অ্যাডমিন","মিডিয়া অ্যাডমিন","হিসাবরক্ষক","ভিডিও সম্পাদক"]}
};

function AccountsOperationsDemo({section}:{section:string}) {
 const [ledger,setLedger]=useState("মসজিদ"),[kind,setKind]=useState("আয়"),[person,setPerson]=useState(""),[purpose,setPurpose]=useState(""),[amount,setAmount]=useState(""),[method,setMethod]=useState("নগদ"),[date,setDate]=useState("2026-11-21"),[rows,setRows]=useState<Array<{id:number;ledger:string;kind:string;person:string;purpose:string;amount:number;method:string;date:string}>>([]);
 const [smsOn,setSmsOn]=useState(false),[smsDay,setSmsDay]=useState("1"),[members,setMembers]=useState("100"),[smsText,setSmsText]=useState("আসসালামু আলাইকুম। শায়লা আকরাম কেন্দ্রীয় জামে মসজিদের হিসাবে আপনার [মাস] মাসের মাসিক চাঁদা ৳[পরিমাণ] বকেয়া রয়েছে। অনুগ্রহ করে সুবিধামতো পরিশোধের জন্য বিনীত অনুরোধ করছি। ইতোমধ্যে পরিশোধ করে থাকলে বার্তাটি উপেক্ষা করবেন।"),[consent,setConsent]=useState(true),[logs,setLogs]=useState<string[]>([]);
 const [salaryName,setSalaryName]=useState(""),[salaryRole,setSalaryRole]=useState("ইমাম"),[salaryAmount,setSalaryAmount]=useState(""),[salaries,setSalaries]=useState<Array<{name:string;role:string;amount:number}>>([]);
 const money=(n:number)=>"৳"+n.toLocaleString("en-BD"), total=(k:string)=>rows.filter(x=>x.kind===k).reduce((s,x)=>s+x.amount,0);
 const field={width:"100%",padding:10,border:"1px solid #cbd8cd",borderRadius:8,marginTop:5,marginBottom:12} as const;
 if(section==="SMS স্মরণবার্তা") return <div className="mosque-admin-panel"><h3>সাধারণ SMS · মাসিক চাঁদা স্মরণবার্তা</h3><p>প্রতি মাসে একবার শুধু বকেয়া সদস্যদের নম্বরে বার্তা পাঠানোর ডেমো নিয়ন্ত্রণ।</p><div className="mosque-admin-cards"><article><small>পাঠানোর দিন</small><b>{smsDay} তারিখ</b></article><article><small>সদস্য</small><b>{members} জন</b></article><article><small>প্রতি SMS অংশ</small><b>৳০.২৮–৳০.৩৬</b></article><article><small>ফ্রিকোয়েন্সি</small><b>মাসে ১ বার</b></article></div><label className="mosque-admin-check"><input type="checkbox" checked={smsOn} onChange={e=>setSmsOn(e.target.checked)}/> <span>SMS রিমাইন্ডার চালু (ডেমো)</span></label><label>মাসের কোন তারিখে পাঠাবেন?</label><select style={field} value={smsDay} onChange={e=>setSmsDay(e.target.value)}><option value="1">১ তারিখ</option><option value="5">৫ তারিখ</option></select><label>সদস্য সংখ্যা</label><input style={field} type="number" min="0" value={members} onChange={e=>setMembers(e.target.value)}/><label className="mosque-admin-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> <span>শুধু সম্মতিপ্রাপ্ত সদস্যদের বার্তা পাঠাব</span></label><label>SMS টেমপ্লেট</label><textarea style={{...field,minHeight:130}} value={smsText} onChange={e=>setSmsText(e.target.value)}/><p><b>আনুমানিক খরচ:</b> {money(Number(members||0)*0.32)} (এক অংশ/সদস্য, ৳০.৩২ ধরে)। বাংলা SMS ৭০ অক্ষর ছাড়ালে অতিরিক্ত অংশের খরচ হবে।</p><button disabled={!smsOn||!consent||!smsText.trim()} onClick={()=>setLogs([smsDay+" তারিখের SMS ডেমো ক্যাম্পেইন কিউতে রাখা হয়েছে; বাস্তবে পাঠানো হয়নি।",...logs])}>পরবর্তী ক্যাম্পেইন কিউতে রাখুন</button><h3>পাঠানোর ইতিহাস</h3>{logs.length?logs.map((x,i)=><p key={i}>{x}</p>):<p>এখনো কোনো ক্যাম্পেইন নেই।</p>}<p className="mosque-admin-disclaimer">এটি ডেমো। SMS Gateway API, প্রিপেইড ব্যালেন্স, সার্ভার scheduler ও নম্বর/সম্মতি যাচাই যুক্ত না হওয়া পর্যন্ত বাস্তব SMS যাবে না।</p></div>;
 if(section==="বেতন ও কর্মী ব্যবস্থাপনা") return <div className="mosque-admin-panel"><h3>ইমাম, মুয়াজ্জিন ও কর্মীদের মাসিক বেতন প্রদান</h3><label>কর্মীর নাম</label><input style={field} value={salaryName} onChange={e=>setSalaryName(e.target.value)} placeholder="নাম"/><label>দায়িত্ব</label><select style={field} value={salaryRole} onChange={e=>setSalaryRole(e.target.value)}><option>ইমাম</option><option>মুয়াজ্জিন</option><option>খাদেম</option><option>পরিচ্ছন্নতাকর্মী</option><option>অন্যান্য</option></select><label>বেতনের পরিমাণ (৳)</label><input style={field} type="number" min="1" value={salaryAmount} onChange={e=>setSalaryAmount(e.target.value)}/><button disabled={!salaryName.trim()||Number(salaryAmount)<=0} onClick={()=>{setSalaries([...salaries,{name:salaryName,role:salaryRole,amount:Number(salaryAmount)}]);setSalaryName("");setSalaryAmount("")}}>＋ বেতন রেকর্ড যোগ করুন</button>{salaries.map((x,i)=><div className="mosque-admin-table" key={i}><div><span>{x.name} · {x.role}</span><b>{money(x.amount)}</b></div></div>)}<p>মোট নমুনা বেতন: <b>{money(salaries.reduce((s,x)=>s+x.amount,0))}</b></p></div>;
 return <div className="mosque-admin-panel"><h3>{section==="আয়-ব্যয়"?"আয় গ্রহণ ও খরচ প্রদান":"বাজেট, বিল ও আর্থিক নথি"}</h3><p>মসজিদ ও ফাউন্ডেশনের হিসাব আলাদা রাখুন। আয়, ব্যয়, বেতন, পেমেন্ট মাধ্যম ও তারিখসহ রেকর্ড তৈরি করুন।</p><div className="mosque-admin-cards"><article><small>মোট আয়</small><b>{money(total("আয়"))}</b></article><article><small>মোট ব্যয়</small><b>{money(total("ব্যয়")+total("বেতন"))}</b></article><article><small>নমুনা স্থিতি</small><b>{money(total("আয়")-total("ব্যয়")-total("বেতন"))}</b></article><article><small>রেকর্ড</small><b>{rows.length}</b></article></div><label>প্রতিষ্ঠান</label><select style={field} value={ledger} onChange={e=>setLedger(e.target.value)}><option>মসজিদ</option><option>শায়লা আকরাম ফাউন্ডেশন</option></select><label>এন্ট্রির ধরন</label><select style={field} value={kind} onChange={e=>setKind(e.target.value)}><option>আয়</option><option>ব্যয়</option><option>বেতন</option></select><label>{kind==="আয়"?"প্রদানকারীর নাম":"গ্রহণকারী/সরবরাহকারীর নাম"}</label><input style={field} value={person} onChange={e=>setPerson(e.target.value)} placeholder="নাম"/><label>বিবরণ / খরচের কারণ</label><input style={field} value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="মাসিক চাঁদা / বিদ্যুৎ বিল / বেতন"/><label>টাকার পরিমাণ (৳)</label><input style={field} type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)}/><label>পেমেন্ট মাধ্যম</label><select style={field} value={method} onChange={e=>setMethod(e.target.value)}><option>নগদ</option><option>bKash</option><option>Nagad</option><option>ব্যাংক</option><option>চেক</option></select><label>তারিখ</label><input style={field} type="date" value={date} onChange={e=>setDate(e.target.value)}/><button disabled={!person.trim()||!purpose.trim()||Number(amount)<=0} onClick={()=>{setRows([{id:Date.now(),ledger,kind,person,purpose,amount:Number(amount),method,date},...rows]);setPerson("");setPurpose("");setAmount("")}}>＋ হিসাব এন্ট্রি যোগ করুন (ডেমো)</button><h3>সাম্প্রতিক এন্ট্রি</h3>{rows.length?rows.map(x=><div className="mosque-admin-table" key={x.id}><div><span><b>{x.kind} · {x.purpose}</b><br/><small>{x.ledger} · {x.person} · {x.date} · {x.method}</small></span><b>{money(x.amount)}</b></div></div>):<p>এখনো কোনো নমুনা এন্ট্রি নেই।</p>}<p className="mosque-admin-disclaimer">ডেমো ডেটা শুধু এই ব্রাউজার সেশনে থাকে; Firebase-এ সংরক্ষণ, অনুমোদন, ভাউচার/রসিদ, অডিট লগ ও প্রকৃত ব্যালেন্স সমন্বয় এখনো যুক্ত নয়।</p></div>;
}

function AdminDemo({variant}:{variant:string}) {
 const p=packages[variant], enterprise=variant==="4";
 const [area,setArea]=useState<"home"|"website"|"accounts">("home");
 const [section,setSection]=useState("সারসংক্ষেপ");
 const [role,setRole]=useState("সুপার অ্যাডমিন");
 const [roles,setRoles]=useState(["সুপার অ্যাডমিন","মসজিদ অ্যাডমিন","ফাউন্ডেশন অ্যাডমিন","মিডিয়া অ্যাডমিন","হিসাব অ্যাডমিন"]);
 const [newRole,setNewRole]=useState("");
 const [modules,setModules]=useState(moduleGroups.slice(0,p.count));
 const [newModule,setNewModule]=useState("");
 const [notice,setNotice]=useState("আগামী শুক্রবার জুমার নামাজের সময় যথাসময়ে জানানো হবে।");
 const [items,setItems]=useState(["প্রতিষ্ঠানের পরিচিতি","নোটিশ বোর্ড","ফটো গ্যালারি"]);
 const [newItem,setNewItem]=useState("");
 const [accountAccess,setAccountAccess]=useState<Record<string,boolean>>({"সুপার অ্যাডমিন":true});
 const [permissions,setPermissions]=useState<Record<string,boolean>>({});
 const [saved,setSaved]=useState(false);
 const [adminEmail,setAdminEmail]=useState("");
 const [admins,setAdmins]=useState(["computer26training@gmail.com"]);
 const [entry,setEntry]=useState("");
 const [monthlyDueDay]=useState(5);
 const [redAlertDays]=useState(10);
 const [members,setMembers]=useState([
  {id:1,name:"মোঃ করিম",address:"পশ্চিম সাকছিপাড়া, হাজীগঞ্জ",phone:"01XXXXXXXXX",monthly:500,paidMonths:3,paidThrough:"সেপ্টেম্বর ২০২৬",collector:"আব্দুল্লাহ"},
  {id:2,name:"মোঃ হাবিব",address:"হাজীগঞ্জ, চাঁদপুর",phone:"01XXXXXXXXX",monthly:200,paidMonths:1,paidThrough:"জুলাই ২০২৬",collector:"রহিম"},
  {id:3,name:"মোঃ জামাল",address:"সাকছিপাড়া, হাজীগঞ্জ",phone:"01XXXXXXXXX",monthly:400,paidMonths:0,paidThrough:"—",collector:"আব্দুল্লাহ"}
 ]);
 const [alertMonth,setAlertMonth]=useState("নভেম্বর ২০২৬");
 const [alertFilter,setAlertFilter]=useState("সব");
 const [visitLog,setVisitLog]=useState<Record<number,string>>({});
 const [memberName,setMemberName]=useState("");
 const [memberAddress,setMemberAddress]=useState("");
 const [memberPhone,setMemberPhone]=useState("");
 const [memberMonthly,setMemberMonthly]=useState("");
 const [memberCollector,setMemberCollector]=useState("");
 const isSuper=role==="সুপার অ্যাডমিন";
 const canAccounts=isSuper||!!accountAccess[role];
 const websiteNav=["সারসংক্ষেপ","মডিউল নিয়ন্ত্রণ","পেজ ও কনটেন্ট","নোটিশ প্রকাশ","মসজিদ ও ফাউন্ডেশন","মিডিয়া ব্যবস্থাপনা","ব্যবহারকারী ও দায়িত্ব","দায়িত্ব ও অনুমতি","সাধারণ সেটিংস","কার্যক্রমের ইতিহাস"];
 const accountNav=["হিসাব সারসংক্ষেপ","আয়-ব্যয়","অনুদান ও দান","মাসিক চাঁদা ও Red Alert","বাজেট ও বিল","আর্থিক রিপোর্ট","হিসাব অ্যাডমিন","হিসাব নিরাপত্তা","বেতন ও কর্মী ব্যবস্থাপনা","SMS স্মরণবার্তা"];
 const nav=area==="website"?websiteNav:accountNav;
 const save=()=>setSaved(true);
 if(!enterprise) return <div className="mosque-admin-demo"><div className="mosque-admin-top"><div><b>NEXORA · DEMO CONTROL CENTER</b><small>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</small></div><span>শুধু প্রদর্শনীর জন্য · বাস্তব অ্যাডমিন নয়</span></div><main style={{padding:24}}><h1>প্যাকেজ {variant} অ্যাডমিন ডেমো</h1><p>এই প্যাকেজে সীমিত ওয়েবসাইট পরিচালনা সুবিধা রয়েছে।</p><Link href={"/demos/shayla-akram-"+variant}>ওয়েবসাইটে ফিরে যান ↗</Link></main></div>;
 return <div className="mosque-admin-demo">
  <div className="mosque-admin-top"><div><b>NEXORA · ENTERPRISE ADMIN CENTER</b><small>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ ও শায়লা আকরাম ফাউন্ডেশন</small></div><span>সুপার অ্যাডমিন · পূর্ণ নিয়ন্ত্রণ</span></div>
  {area==="home"?<main style={{maxWidth:1050,margin:"0 auto",padding:"34px 22px"}}>
   <div className="mosque-admin-heading"><div><small>প্যাকেজ ৪ · Enterprise Premium</small><h1>সুপার অ্যাডমিন কন্ট্রোল সেন্টার</h1><p>স্বাগতম, জনাব মোঃ মোস্তফা আকরাম</p></div><span>{modules.length}টি মডিউল</span></div>
   <div className="mosque-admin-cards" style={{margin:"24px 0"}}><article><small>ওয়েবসাইট মডিউল</small><b>{modules.length}</b></article><article><small>অ্যাডমিন দায়িত্ব</small><b>{roles.length}</b></article><article><small>প্রশাসনিক বিভাগ</small><b>২</b></article><article><small>নিয়ন্ত্রণ</small><b>পূর্ণ</b></article></div>
   <div className="mosque-admin-panel"><h2>কোন বিভাগে কাজ করবেন?</h2><div className="mosque-permission-grid">
    <button onClick={()=>{setArea("website");setSection("সারসংক্ষেপ")}}><b>🌐 ওয়েবসাইট অপশন</b><span>ওয়েবসাইটের সকল পেজ, মডিউল, অ্যাডমিন, কনটেন্ট ও সেটিংস পরিচালনা</span></button>
    <button onClick={()=>{setArea("accounts");setSection("হিসাব সারসংক্ষেপ")}}><b>▤ একাউন্টস অপশন</b><span>গোপন আয়-ব্যয়, অনুদান, বাজেট, রিপোর্ট ও হিসাব অ্যাডমিন পরিচালনা</span></button>
   </div></div>
   <p className="mosque-admin-disclaimer">এটি ইন্টার‌্যাক্টিভ ডেমো। এখানে করা পরিবর্তন শুধু এই ব্রাউজার সেশনের নমুনা; বাস্তব ডেটাবেসে সংরক্ষিত নয়।</p>
  </main>:<div className="mosque-admin-layout">
   <aside><h2>{area==="website"?"ওয়েবসাইট অ্যাডমিন":"একাউন্টস অ্যাডমিন"}</h2>
    <button onClick={()=>setArea("home")}>← মূল কন্ট্রোল সেন্টার</button>
    <div style={{padding:"8px 10px",fontSize:12,color:"#718277"}}>বর্তমান দায়িত্ব</div>
    <select value={role} onChange={e=>{setRole(e.target.value);setSaved(false)}} style={{padding:9,border:"1px solid #ccd9ce",borderRadius:7}}>{roles.map(r=><option key={r}>{r}</option>)}</select>
    {nav.map(x=><button key={x} className={section===x?"selected":""} onClick={()=>{setSection(x);setSaved(false)}}>{x}</button>)}
    <Link href={"/demos/shayla-akram-"+variant}>ওয়েবসাইট ডেমো ↗</Link>
   </aside>
   <main><div className="mosque-admin-heading"><div><small>{area==="website"?"Website Management":"Private Accounts Management"}</small><h1>{section}</h1></div><span>{area==="website"?modules.length+"টি মডিউল":"গোপন বিভাগ"}</span></div>
    {area==="website"&&section==="সারসংক্ষেপ"?<><div className="mosque-admin-cards"><article><small>সক্রিয় মডিউল</small><b>{modules.length}</b></article><article><small>অ্যাডমিন দায়িত্ব</small><b>{roles.length}</b></article><article><small>কনটেন্ট আইটেম</small><b>{items.length}</b></article><article><small>সর্বময় ক্ষমতা</small><b>{isSuper?"হ্যাঁ":"না"}</b></article></div><div className="mosque-admin-panel"><h3>ওয়েবসাইট পরিচালনার শর্টকাট</h3><div className="mosque-admin-shortcuts">{websiteNav.slice(1).map(x=><button key={x} onClick={()=>setSection(x)}>{x} ↗</button>)}</div></div></>:null}
    {area==="website"&&section==="মডিউল নিয়ন্ত্রণ"?<div className="mosque-admin-panel"><h3>মডিউল তৈরি, সম্পাদনা ও ডিলেট</h3><p>সুপার অ্যাডমিন নতুন মডিউল যোগ, নাম পরিবর্তন এবং প্রয়োজন হলে মডিউল অপসারণ করতে পারবেন।</p><div className="mosque-admin-add-role"><label>নতুন মডিউলের নাম</label><input value={newModule} onChange={e=>setNewModule(e.target.value)} placeholder="যেমন: অনলাইন কোরআন শিক্ষা"/><button disabled={!isSuper||!newModule.trim()} onClick={()=>{const v=newModule.trim();if(v&&!modules.includes(v)){setModules([...modules,v]);setNewModule("");setSaved(true)}}}>＋ নতুন মডিউল তৈরি করুন</button></div>{modules.map((m,i)=><div className="mosque-admin-table" key={m}><div><span>{String(i+1).padStart(2,"0")} · {m}</span><span>সক্রিয়</span><button disabled={!isSuper} onClick={()=>{if(confirm("“"+m+"” মডিউলটি ডেমো তালিকা থেকে মুছবেন?"))setModules(modules.filter(x=>x!==m))}}>ডিলেট</button></div></div>)}{!isSuper?<p>মডিউল তৈরি/ডিলেট করতে সুপার অ্যাডমিন অনুমতি প্রয়োজন।</p>:null}</div>:null}
    {area==="website"&&section==="পেজ ও কনটেন্ট"?<div className="mosque-admin-panel"><h3>পেজ ও কনটেন্ট ব্যবস্থাপনা</h3><div className="mosque-admin-add-role"><label>নতুন কনটেন্ট/পেজের নাম</label><input value={newItem} onChange={e=>setNewItem(e.target.value)} placeholder="নতুন পেজ বা কনটেন্ট"/><button disabled={!isSuper||!newItem.trim()} onClick={()=>{setItems([...items,newItem.trim()]);setNewItem("");setSaved(true)}}>＋ যোগ করুন</button></div>{items.map(x=><div className="mosque-admin-table" key={x}><div><span>{x}</span><span>প্রকাশিত ডেমো</span><button disabled={!isSuper} onClick={()=>setItems(items.filter(y=>y!==x))}>ডিলেট</button></div></div>)}</div>:null}
    {area==="website"&&section==="ব্যবহারকারী ও দায়িত্ব"?<div className="mosque-admin-panel"><h3>অ্যাডমিন তৈরি ও দায়িত্ব নিয়ন্ত্রণ</h3><label>নতুন অ্যাডমিনের ইমেইল</label><input value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder="admin@example.com"/><button disabled={!isSuper||!adminEmail.includes("@")} onClick={()=>{setAdmins([...admins,adminEmail]);setAdminEmail("");setSaved(true)}}>＋ অ্যাডমিন যোগ করুন</button><h3>অ্যাডমিন তালিকা</h3>{admins.map(a=><div className="mosque-admin-table" key={a}><div><span>{a}</span><span>নিবন্ধিত</span><button disabled={!isSuper||a==="computer26training@gmail.com"} onClick={()=>setAdmins(admins.filter(x=>x!==a))}>ডিলেট</button></div></div>}<div className="mosque-admin-add-role"><label>নতুন দায়িত্বের নাম</label><input value={newRole} onChange={e=>setNewRole(e.target.value)} placeholder="যেমন: শিক্ষা সমন্বয়কারী"/><button disabled={!isSuper||!newRole.trim()} onClick={()=>{setRoles([...roles,newRole.trim()]);setNewRole("");setSaved(true)}}>＋ দায়িত্ব তৈরি করুন</button></div>{roles.map(r=><div className="mosque-admin-table" key={r}><div><span>{r}</span><span>{r==="সুপার অ্যাডমিন"?"পূর্ণ নিয়ন্ত্রণ":"নির্ধারিত অনুমতি"}</span><button disabled={!isSuper||r==="সুপার অ্যাডমিন"} onClick={()=>setRoles(roles.filter(x=>x!==r))}>ডিলেট</button></div></div>)}</div>:null}
    {area==="website"&&section==="দায়িত্ব ও অনুমতি"?<div className="mosque-admin-panel"><h3>দায়িত্বভিত্তিক অনুমতি</h3><p>ওয়েবসাইট ও একাউন্টসের অনুমতি পৃথকভাবে নির্ধারিত হবে। সুপার অ্যাডমিনের পূর্ণ ক্ষমতা অপরিবর্তিত থাকবে।</p>{roles.filter(r=>r!=="সুপার অ্যাডমিন").map(r=><div className="mosque-role" key={r}><b>{r}</b><label className="mosque-admin-check"><input type="checkbox" checked={!!accountAccess[r]} onChange={e=>setAccountAccess({...accountAccess,[r]:e.target.checked})}/><span>একাউন্টস প্যানেলে প্রবেশাধিকার</span></label>{["দেখা","তৈরি","সম্পাদনা","ডিলেট","প্রকাশ/অনুমোদন"].map(x=><label className="mosque-admin-check" key={r+x}><input type="checkbox" checked={!!permissions[r+x]} onChange={e=>setPermissions({...permissions,[r+x]:e.target.checked})}/><span>{x} করার অনুমতি</span></label>)}</div>)}<button disabled={!isSuper} onClick={save}>অনুমতি সংরক্ষণ করুন</button></div>:null}
    {area==="website"&&section==="নোটিশ প্রকাশ"?<div className="mosque-admin-panel"><h3>নোটিশ তৈরি ও প্রকাশ</h3><textarea value={notice} onChange={e=>setNotice(e.target.value)}/><button onClick={save}>নোটিশ সংরক্ষণ / প্রকাশ</button></div>:null}
    {area==="website"&&section!=="সারসংক্ষেপ"&&section!=="মডিউল নিয়ন্ত্রণ"&&section!=="পেজ ও কনটেন্ট"&&section!=="ব্যবহারকারী ও দায়িত্ব"&&section!=="দায়িত্ব ও অনুমতি"&&section!=="নোটিশ প্রকাশ"?<div className="mosque-admin-panel"><h3>{section} পরিচালনা</h3><p>এই বিভাগে নতুন তথ্য তৈরি, বিদ্যমান তথ্য সম্পাদনা/ডিলেট, প্রকাশনা নিয়ন্ত্রণ এবং প্রয়োজনীয় রিপোর্টের ব্যবস্থা থাকবে।</p><button onClick={save}>পরিবর্তন সংরক্ষণের নমুনা</button></div>:null}
    {area==="accounts"&&!canAccounts?<div className="mosque-admin-panel"><h3>প্রবেশাধিকার নেই</h3><p>এই দায়িত্বের জন্য একাউন্টস প্যানেলের অনুমতি দেওয়া হয়নি। সুপার অ্যাডমিনের অনুমোদন প্রয়োজন।</p></div>:null}
    {area==="accounts"&&canAccounts&&section==="হিসাব সারসংক্ষেপ"?<><div className="mosque-admin-cards"><article><small>মোট আয়</small><b>৳০</b></article><article><small>মোট ব্যয়</small><b>৳০</b></article><article><small>অনুদান</small><b>৳০</b></article><article><small>বর্তমান স্থিতি</small><b>৳০</b></article></div><div className="mosque-admin-panel"><h3>ব্যক্তিগত আর্থিক ব্যবস্থাপনা</h3><p>এই প্যানেল সাধারণ ওয়েবসাইট থেকে সম্পূর্ণ আলাদা এবং অনুমতিপ্রাপ্ত অ্যাডমিনদের জন্য।</p></div></>:null}
    {area==="accounts"&&canAccounts&&section==="মাসিক চাঁদা ও Red Alert"?<div className="mosque-admin-panel">
      <h3>মাসিক চাঁদা আদায় ও বকেয়া সতর্কতা</h3>
      <p>প্রতি মাসের ৫ তারিখ চাঁদা জমার শেষ দিন। ১০ দিন আগে, অর্থাৎ আগের মাসের ২৬ তারিখ থেকে আগাম Red Alert শুরু হবে।</p>
      <div className="mosque-admin-cards">
       <article><small>চাঁদা জমার শেষ তারিখ</small><b>প্রতি মাসের ৫</b></article>
       <article><small>আগাম Red Alert</small><b>১০ দিন আগে</b></article>
       <article><small>নমুনা বকেয়া সদস্য</small><b>{members.length} জন</b></article>
       <article><small>মোট নমুনা পাওনা</small><b>৳{members.reduce((s,m)=>s+m.monthly*Math.max(0,1),0).toLocaleString("en-US")}</b></article>
      </div>
      <div className="mosque-admin-add-role">
       <label>হিসাবের মাস</label><select value={alertMonth} onChange={e=>setAlertMonth(e.target.value)}><option>নভেম্বর ২০২৬</option><option>ডিসেম্বর ২০২৬</option><option>জানুয়ারি ২০২৭</option></select>
       <label>তালিকা ফিল্টার</label><select value={alertFilter} onChange={e=>setAlertFilter(e.target.value)}><option>সব</option><option>এই মাসে পাওনা</option><option>আগের মাসসহ বকেয়া</option></select>
      </div>
      <div className="mosque-admin-table"><div><b>Red Alert আদায় তালিকা · {alertMonth}</b><span>আগাম সতর্কতা: আগের মাসের ২৬ তারিখ</span></div></div>
      {members.filter(m=>alertFilter==="সব"||alertFilter==="এই মাসে পাওনা"||m.paidMonths<12).map(m=><div className="mosque-admin-table" key={m.id}><div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center"}}>
       <span><b>{m.name}</b><br/><small>{m.address} · {m.phone}</small><br/><small>মাসিক চাঁদা ৳{m.monthly.toLocaleString("en-US")} · আদায়কারী: {m.collector}</small></span>
       <span style={{color:"#b42318",fontWeight:700}}>৳{m.monthly.toLocaleString("en-US")}+</span>
       <span style={{gridColumn:"1 / -1",fontSize:12,color:"#b42318"}}>বকেয়া · সর্বশেষ পরিশোধ: {m.paidThrough}</span>
       <button style={{gridColumn:"1 / -1"}} onClick={()=>setVisitLog({...visitLog,[m.id]:visitLog[m.id]?"":"সদস্যের সঙ্গে যোগাযোগ/সাক্ষাতের ফলাফল লিখুন"})}>আদায় কার্যক্রম আপডেট</button>
       {visitLog[m.id]!==undefined&&visitLog[m.id]!==""?<input style={{gridColumn:"1 / -1"}} placeholder={visitLog[m.id]} onChange={e=>setVisitLog({...visitLog,[m.id]:e.target.value})}/>:null}
      </div></div>)}
      <h3>নতুন সদস্য নিবন্ধন</h3>
      <div className="mosque-admin-add-role">
       <label>সদস্যের নাম</label><input value={memberName} onChange={e=>setMemberName(e.target.value)} placeholder="পূর্ণ নাম"/>
       <label>ঠিকানা</label><input value={memberAddress} onChange={e=>setMemberAddress(e.target.value)} placeholder="গ্রাম, ওয়ার্ড, উপজেলা, জেলা"/>
       <label>মোবাইল</label><input value={memberPhone} onChange={e=>setMemberPhone(e.target.value)} placeholder="মোবাইল নম্বর"/>
       <label>নির্ধারিত মাসিক চাঁদা (৳)</label><input type="number" min="1" value={memberMonthly} onChange={e=>setMemberMonthly(e.target.value)} placeholder="যেকোনো পরিমাণ"/>
       <label>দায়িত্বপ্রাপ্ত আদায়কারী</label><input value={memberCollector} onChange={e=>setMemberCollector(e.target.value)} placeholder="আদায়কারীর নাম"/>
       <button disabled={!memberName.trim()||!memberAddress.trim()||Number(memberMonthly)<=0} onClick={()=>{setMembers([...members,{id:Date.now(),name:memberName,address:memberAddress,phone:memberPhone,monthly:Number(memberMonthly),paidMonths:0,paidThrough:"—",collector:memberCollector||"নির্ধারিত নয়"}]);setMemberName("");setMemberAddress("");setMemberPhone("");setMemberMonthly("");setMemberCollector("");setSaved(true)}}>＋ সদস্য যোগ করুন</button>
      </div>
      <p>প্রতিটি সদস্যের জন্য মাসভিত্তিক পরিশোধ ইতিহাস, একসঙ্গে একাধিক মাস জমা, আংশিক জমা, রসিদ এবং বকেয়া ব্যালেন্স যুক্ত হবে। কোনো মাসের টাকা জমা হলে সেই মাসের Red Alert বন্ধ হবে।</p>
     </div>:null}
    {area==="accounts"&&canAccounts&&(section==="আয়-ব্যয়"||section==="বাজেট ও বিল"||section==="বেতন ও কর্মী ব্যবস্থাপনা"||section==="SMS স্মরণবার্তা")?<AccountsOperationsDemo section={section}/>:null}
    {area==="accounts"&&canAccounts&&section!=="হিসাব সারসংক্ষেপ"&&section!=="মাসিক চাঁদা ও Red Alert"?<div className="mosque-admin-panel"><h3>{section}</h3><label>নতুন এন্ট্রির বিবরণ</label><input value={entry} onChange={e=>setEntry(e.target.value)} placeholder="বিবরণ লিখুন"/><button disabled={!isSuper&&!canAccounts||!entry.trim()} onClick={()=>{setEntry("");setSaved(true)}}>＋ নতুন এন্ট্রি যোগ করুন</button><p>হিসাব এন্ট্রি সম্পাদনা, ডিলেট, রসিদ, ভাউচার ও রিপোর্টের পূর্ণ নিয়ন্ত্রণ অনুমতি অনুযায়ী থাকবে।</p></div>:null}
    {saved?<p role="status" className="mosque-admin-disclaimer">ডেমোতে পরিবর্তন দেখানো হয়েছে; বাস্তব সার্ভার বা ডেটাবেসে সংরক্ষিত হয়নি।</p>:null}
    <p className="mosque-admin-disclaimer">সুপার অ্যাডমিনের জন্য সবকিছু তৈরি, দেখা, সম্পাদনা, ডিলেট, প্রকাশ/অনুমোদন, অ্যাডমিন ও অনুমতি নিয়ন্ত্রণ এবং নতুন মডিউল তৈরি/ডিলেটের ক্ষমতা নির্ধারিত। বাস্তব সংস্করণে প্রতিটি কাজ সার্ভার-সাইড অনুমতি যাচাই, Firebase Security Rules, অডিট লগ ও ব্যাকআপের মাধ্যমে সুরক্ষিত করতে হবে।</p>
   </main>
  </div>}
 </div>;
}
export default function MosqueModuleOrAdmin() {
 const params=useParams<{slug:string;module:string}>(), slug=params.slug, module=params.module;
 const variant=slug?.match(/^shayla-akram-([1-4])$/)?.[1]||"4", pkg=packages[variant];
 const moduleIndex=Number(module?.replace("module-",""))-1, isAdmin=module==="admin", title=moduleGroups[moduleIndex], allowed=Number.isInteger(moduleIndex)&&moduleIndex>=0&&moduleIndex<pkg.count;
 if(isAdmin)return <AdminDemo variant={variant}/>;
 if(!allowed)return <main className="mosque-module-page"><h1>এই মডিউলটি এই প্যাকেজে নেই</h1><Link href={"/demos/"+slug}>ডেমোতে ফিরে যান</Link></main>;
 return <main className="mosque-module-page"><div className="mosque-module-head"><Link href={"/demos/"+slug}>← ডেমো হোমে ফিরুন</Link><span>প্যাকেজ {variant} · মডিউল {String(moduleIndex+1).padStart(2,"0")}</span></div><section><small>শায়লা আকরাম {variant==="4"?"মসজিদ ও ফাউন্ডেশন":"কেন্দ্রীয় জামে মসজিদ"}</small><h1>{title}</h1><p>{title} সংক্রান্ত তথ্য, ব্যবস্থাপনা ও প্রয়োজনীয় কার্যক্রম এখানে দেখা যাবে।</p><div className="mosque-module-workspace"><h2>{title} · নমুনা ব্যবস্থাপনা</h2><p>এই পৃষ্ঠাটি মিটিংয়ে মডিউলটির সম্ভাব্য কাজ দেখানোর জন্য তৈরি।</p><label>নমুনা তথ্য</label><input placeholder={title+" লিখুন"}/><label>বিবরণ</label><textarea placeholder="বিস্তারিত লিখুন"/><button onClick={()=>alert("এটি শুধু ডেমো। কোনো তথ্য সংরক্ষণ করা হয়নি।")}>নমুনা সংরক্ষণ দেখুন</button></div><Link href={"/demos/"+slug+"/admin"} className="mosque-module-admin">অ্যাডমিন প্যানেল দেখুন ↗</Link></section></main>;
}