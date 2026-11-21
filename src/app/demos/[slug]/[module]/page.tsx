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
function AdminDemo({variant}:{variant:string}) {
 const p=packages[variant], enterprise=variant==="4", [section,setSection]=useState("সারসংক্ষেপ"), [role,setRole]=useState(enterprise?"মোতাওয়াল্লী":"প্রধান অ্যাডমিন"), [notice,setNotice]=useState("আগামী শুক্রবার জুমার নামাজের সময় যথাসময়ে জানানো হবে।"), [saved,setSaved]=useState(false);
 const nav=["সারসংক্ষেপ","মডিউল নিয়ন্ত্রণ","ব্যবহারকারী ও দায়িত্ব","নোটিশ প্রকাশ",...(enterprise?["মসজিদ ও ফাউন্ডেশন","অনুদান ও হিসাব","মিডিয়া ব্যবস্থাপনা","কার্যক্রমের ইতিহাস"]:[])];
 return <div className="mosque-admin-demo"><div className="mosque-admin-top"><div><b>NEXORA · DEMO CONTROL CENTER</b><small>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</small></div><span>শুধু প্রদর্শনীর জন্য · বাস্তব অ্যাডমিন নয়</span></div><div className="mosque-admin-layout"><aside><h2>প্রশাসনিক প্যানেল</h2>{nav.map(x=><button key={x} className={section===x?"selected":""} onClick={()=>{setSection(x);setSaved(false)}}>{x}</button>)}<Link href={"/demos/shayla-akram-"+variant}>ওয়েবসাইটে ফিরে যান ↗</Link></aside><main><div className="mosque-admin-heading"><div><small>প্যাকেজ {variant} · ৳{p.price}</small><h1>{section}</h1></div><span>{p.count}টি মডিউল</span></div>
 {section==="সারসংক্ষেপ"?<><div className="mosque-admin-cards"><article><small>মডিউল</small><b>{p.count}</b></article><article><small>বিভাগ</small><b>{enterprise?"২":"১"}</b></article><article><small>অনুমোদন অপেক্ষমাণ</small><b>০৩</b></article><article><small>নমুনা প্রতিবেদন</small><b>{enterprise?"১২":"০১"}</b></article></div><div className="mosque-admin-panel"><h3>দ্রুত প্রবেশ</h3><div className="mosque-admin-shortcuts">{nav.slice(1).map(x=><button key={x} onClick={()=>setSection(x)}>{x} ↗</button>)}</div></div></>:null}
 {section==="মডিউল নিয়ন্ত্রণ"?<div className="mosque-admin-panel"><h3>মডিউল চালু/বন্ধের নমুনা</h3>{moduleGroups.slice(0,p.count).map((x,i)=><label className="mosque-admin-check" key={x}><input type="checkbox" defaultChecked/><span>{String(i+1).padStart(2,"0")} · {x}</span></label>)}</div>:null}
 {section==="ব্যবহারকারী ও দায়িত্ব"?<div className="mosque-admin-panel"><h3>দায়িত্বভিত্তিক প্রবেশাধিকার</h3><label>দায়িত্ব নির্বাচন করুন</label><select value={role} onChange={e=>setRole(e.target.value)}>{p.roles.map(x=><option key={x}>{x}</option>)}</select><div className="mosque-role"><b>{role}</b><p>এই দায়িত্বে নির্দিষ্ট মডিউল দেখা, সম্পাদনা অথবা অনুমোদনের অনুমতি নির্ধারণ করা যাবে।</p></div></div>:null}
 {section==="নোটিশ প্রকাশ"?<div className="mosque-admin-panel"><h3>নতুন নোটিশের নমুনা</h3><textarea value={notice} onChange={e=>setNotice(e.target.value)}/><button onClick={()=>setSaved(true)}>নমুনা সংরক্ষণ দেখান</button>{saved&&<p role="status">ডেমোতে নোটিশ সংরক্ষণের ধাপ দেখানো হলো; ডেটাবেসে সংরক্ষিত হয়নি।</p>}</div>:null}
 {section!=="সারসংক্ষেপ"&&section!=="মডিউল নিয়ন্ত্রণ"&&section!=="ব্যবহারকারী ও দায়িত্ব"&&section!=="নোটিশ প্রকাশ"?<div className="mosque-admin-panel"><h3>{section} ব্যবস্থাপনা</h3><p>এই বিভাগে তথ্যের তালিকা, অনুসন্ধান, নতুন এন্ট্রি, সম্পাদনা এবং অনুমোদনের ধাপ দেখানো হবে।</p></div>:null}
 <p className="mosque-admin-disclaimer">এটি ইন্টার‌্যাক্টিভ প্রদর্শনী প্যানেল। বাস্তব ব্যবহারকারী, আর্থিক তথ্য, পেমেন্ট বা ডেটাবেস সংযোগ নেই। চূড়ান্ত চুক্তির পর নিরাপদ লগইন ও প্রকৃত অনুমতিসহ বাস্তবায়ন করা হবে।</p></main></div></div>
}
export default function MosqueModuleOrAdmin() {
 const params=useParams<{slug:string;module:string}>(), slug=params.slug, module=params.module;
 const variant=slug?.match(/^shayla-akram-([1-4])$/)?.[1]||"4", pkg=packages[variant];
 const moduleIndex=Number(module?.replace("module-",""))-1, isAdmin=module==="admin", title=moduleGroups[moduleIndex], allowed=Number.isInteger(moduleIndex)&&moduleIndex>=0&&moduleIndex<pkg.count;
 if(isAdmin)return <AdminDemo variant={variant}/>;
 if(!allowed)return <main className="mosque-module-page"><h1>এই মডিউলটি এই প্যাকেজে নেই</h1><Link href={"/demos/"+slug}>ডেমোতে ফিরে যান</Link></main>;
 return <main className="mosque-module-page"><div className="mosque-module-head"><Link href={"/demos/"+slug}>← ডেমো হোমে ফিরুন</Link><span>প্যাকেজ {variant} · মডিউল {String(moduleIndex+1).padStart(2,"0")}</span></div><section><small>শায়লা আকরাম {variant==="4"?"মসজিদ ও ফাউন্ডেশন":"কেন্দ্রীয় জামে মসজিদ"}</small><h1>{title}</h1><p>{title} সংক্রান্ত তথ্য, ব্যবস্থাপনা ও প্রয়োজনীয় কার্যক্রম এখানে দেখা যাবে।</p><div className="mosque-module-workspace"><h2>{title} · নমুনা ব্যবস্থাপনা</h2><p>এই পৃষ্ঠাটি মিটিংয়ে মডিউলটির সম্ভাব্য কাজ দেখানোর জন্য তৈরি।</p><label>নমুনা তথ্য</label><input placeholder={title+" লিখুন"}/><label>বিবরণ</label><textarea placeholder="বিস্তারিত লিখুন"/><button onClick={()=>alert("এটি শুধু ডেমো। কোনো তথ্য সংরক্ষণ করা হয়নি।")}>নমুনা সংরক্ষণ দেখুন</button></div><Link href={"/demos/"+slug+"/admin"} className="mosque-module-admin">অ্যাডমিন প্যানেল দেখুন ↗</Link></section></main>;
}