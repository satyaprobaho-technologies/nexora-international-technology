"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const moduleGroups = [
["হোমপেজ","মসজিদের পরিচিতি","নামাজের সময়সূচি","আজানের সময়সূচি","নোটিশ বোর্ড","ফটো গ্যালারি","ভিডিও গ্যালারি","ইমাম ও খতিব","যোগাযোগ ও মানচিত্র","মসজিদ প্রশাসন"],
["মোতাওয়াল্লীর বাণী","শায়লা আকরাম ফাউন্ডেশন","পরিচালনা কমিটি","ফাউন্ডেশন প্রকল্প","আমাদের অর্জন"],
["অনলাইন অনুদান","যাকাত ও সদকা","আয়-ব্যয় হিসাব","ডিজিটাল রসিদ","অনুদান ট্র্যাকিং"],
["ধর্মীয় অনুষ্ঠান","জুমার খুতবা","ইসলামিক শিক্ষা","অনলাইন কোরআন শিক্ষা","কোরআন ও হাদিস"],
["মুসল্লি নিবন্ধন","সদস্য ব্যবস্থাপনা","অভিযোগ ও পরামর্শ","অসহায় সহায়তা","শিক্ষা ও বৃত্তি"],
["চিকিৎসা সহায়তা","রমজান ব্যবস্থাপনা","স্বেচ্ছাসেবক","প্রকল্প অগ্রগতি","বার্ষিক প্রতিবেদন"],
["অনলাইন পেমেন্ট","সদস্য পরিচয়পত্র","অভিযোগ ট্র্যাকিং","এসএমএস ও ইমেইল","উন্নত রিপোর্টিং"],
["অনলাইন সভা ব্যবস্থাপনা","সিদ্ধান্ত ও অনুমোদন","সম্পদ ও সম্পত্তি ব্যবস্থাপনা","কর্মচারী ব্যবস্থাপনা","নির্মাণ ও রক্ষণাবেক্ষণ"],
["বাজেট পরিকল্পনা","ক্রয় ও বিল ব্যবস্থাপনা","দাতা ও সহযোগী ব্যবস্থাপনা","নিরাপত্তা ও কার্যক্রম লগ","ডকুমেন্ট আর্কাইভ"]
];
const modules=moduleGroups.flat();
const packages:Record<string,{price:string;count:number;roles:string[]}>={
"1":{price:"৭০,০০০",count:35,roles:["প্রধান অ্যাডমিন","কনটেন্ট সম্পাদক"]},
"2":{price:"১,২০,০০০",count:40,roles:["প্রধান অ্যাডমিন","মসজিদ সম্পাদক","ফাউন্ডেশন সম্পাদক"]},
"3":{price:"১,৭০,০০০",count:45,roles:["সুপার অ্যাডমিন","মসজিদ অ্যাডমিন","ফাউন্ডেশন অ্যাডমিন","হিসাবরক্ষক","কনটেন্ট সম্পাদক"]},
"4":{price:"২,২০,০০০",count:50,roles:["সুপার অ্যাডমিন","মোতাওয়াল্লী","ফাউন্ডেশন অ্যাডমিন","সভাপতি","সাধারণ সম্পাদক","হিসাবরক্ষক","ইমাম ও খতিব","দান ব্যবস্থাপক","শিক্ষা ব্যবস্থাপক","কনটেন্ট সম্পাদক"]}
};
const descriptions:Record<string,string>={
"নামাজের সময়সূচি":"দৈনিক পাঁচ ওয়াক্ত নামাজের সময়, জামাতের সময় এবং জুমার সময়সূচি প্রকাশের নমুনা।",
"নোটিশ বোর্ড":"মসজিদের ঘোষণা, সভা, ছুটি ও জরুরি বিজ্ঞপ্তি প্রকাশের নমুনা।",
"অনলাইন অনুদান":"অনুদানের খাত, পরিমাণ ও দাতার তথ্য নেওয়ার নমুনা ফরম। এখানে বাস্তব লেনদেন হবে না।",
"আয়-ব্যয় হিসাব":"আয়, ব্যয়, খাত ও মাসভিত্তিক হিসাবের নমুনা প্রতিবেদন।",
"ফাউন্ডেশন প্রকল্প":"শিক্ষা, চিকিৎসা ও মানবকল্যাণ প্রকল্পের বিবরণ এবং অগ্রগতি দেখানোর নমুনা।",
"অভিযোগ ও পরামর্শ":"এলাকাবাসীর মতামত, অভিযোগ ও পরামর্শ গ্রহণের নমুনা ফরম।"
};
function AdminDemo({variant}:{variant:string}) {
 const p=packages[variant], [section,setSection]=useState("সারসংক্ষেপ"), [role,setRole]=useState("মোতাওয়াল্লী"), [notice,setNotice]=useState("আগামী শুক্রবার জুমার নামাজের সময় যথাসময়ে জানানো হবে।"), [saved,setSaved]=useState(false);
 const nav=["সারসংক্ষেপ","মসজিদ ব্যবস্থাপনা","ফাউন্ডেশন","মডিউল নিয়ন্ত্রণ","অনুদান ও হিসাব","ব্যবহারকারী ও দায়িত্ব","নোটিশ প্রকাশ","কার্যক্রমের ইতিহাস"];
 return <div className="mosque-admin-demo"><div className="mosque-admin-top"><div><b>NEXORA · DEMO CONTROL CENTER</b><small>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</small></div><span>শুধু প্রদর্শনীর জন্য · বাস্তব অ্যাডমিন নয়</span></div><div className="mosque-admin-layout"><aside><h2>প্রশাসনিক প্যানেল</h2>{nav.map(x=><button key={x} className={section===x?"selected":""} onClick={()=>{setSection(x);setSaved(false)}}>{x}</button>)}<Link href={"/demos/shayla-akram-"+variant}>ওয়েবসাইটে ফিরে যান ↗</Link></aside><main><div className="mosque-admin-heading"><div><small>ডেমো {variant} · প্যাকেজ ৳{p.price}</small><h1>{section}</h1></div><span>{p.count}টি মডিউল</span></div>
 {section==="সারসংক্ষেপ"?<><div className="mosque-admin-cards"><article><small>মডিউল</small><b>{p.count}</b></article><article><small>প্রতিষ্ঠান</small><b>{variant==="1"?"১":"২"}</b></article><article><small>অনুমোদন অপেক্ষমাণ</small><b>০৩</b></article><article><small>নমুনা অনুদান</small><b>৳২৫,৫০০</b></article></div><div className="mosque-admin-panel"><h3>দ্রুত প্রবেশ</h3><div className="mosque-admin-shortcuts">{["মডিউল নিয়ন্ত্রণ","অনুদান ও হিসাব","ব্যবহারকারী ও দায়িত্ব","নোটিশ প্রকাশ"].map(x=><button key={x} onClick={()=>setSection(x)}>{x} ↗</button>)}</div></div></>:null}
 {section==="মডিউল নিয়ন্ত্রণ"?<div className="mosque-admin-panel"><h3>মডিউল চালু/বন্ধের নমুনা</h3>{modules.slice(0,p.count).map((x,i)=><label className="mosque-admin-check" key={x}><input type="checkbox" defaultChecked/><span>{String(i+1).padStart(2,"0")} · {x}</span></label>)}</div>:null}
 {section==="ব্যবহারকারী ও দায়িত্ব"?<div className="mosque-admin-panel"><h3>দায়িত্বভিত্তিক প্রবেশাধিকার</h3><label>দায়িত্ব নির্বাচন করুন</label><select value={role} onChange={e=>setRole(e.target.value)}>{p.roles.map(x=><option key={x}>{x}</option>)}</select><div className="mosque-role"><b>{role}</b><p>এই দায়িত্বে নির্দিষ্ট মডিউল দেখা, সম্পাদনা অথবা অনুমোদনের অনুমতি নির্ধারণ করা যাবে।</p></div></div>:null}
 {section==="নোটিশ প্রকাশ"?<div className="mosque-admin-panel"><h3>নতুন নোটিশের নমুনা</h3><textarea value={notice} onChange={e=>setNotice(e.target.value)}/><button onClick={()=>setSaved(true)}>নমুনা সংরক্ষণ দেখান</button>{saved&&<p role="status">ডেমোতে নোটিশ সংরক্ষণের ধাপ দেখানো হলো; ডেটাবেসে সংরক্ষিত হয়নি।</p>}</div>:null}
 {section!=="সারসংক্ষেপ"&&section!=="মডিউল নিয়ন্ত্রণ"&&section!=="ব্যবহারকারী ও দায়িত্ব"&&section!=="নোটিশ প্রকাশ"?<div className="mosque-admin-panel"><h3>{section} ব্যবস্থাপনা</h3><p>এই বিভাগে তথ্যের তালিকা, অনুসন্ধান, নতুন এন্ট্রি, সম্পাদনা এবং অনুমোদনের ধাপ দেখানো হবে।</p><div className="mosque-admin-table"><div><b>বিষয়</b><b>অবস্থা</b><b>কার্যক্রম</b></div><div><span>নমুনা রেকর্ড ০১</span><span>পর্যালোচনাধীন</span><button onClick={()=>setSaved(true)}>বিস্তারিত</button></div><div><span>নমুনা রেকর্ড ০২</span><span>অনুমোদিত</span><button onClick={()=>setSaved(true)}>বিস্তারিত</button></div></div>{saved&&<p>নমুনা রেকর্ডের বিস্তারিত দেখানো হচ্ছে।</p>}</div>:null}
 <p className="mosque-admin-disclaimer">সতর্কতা: এটি একটি ইন্টার‌্যাক্টিভ প্রদর্শনী প্যানেল। এখানে বাস্তব ব্যবহারকারী, আর্থিক তথ্য, পেমেন্ট, লগইন বা ডেটাবেস সংযোগ নেই। চূড়ান্ত চুক্তির পর নিরাপদ লগইন ও প্রকৃত অনুমতিসহ বাস্তবায়ন করা হবে।</p></main></div></div>
}
export default function MosqueModuleOrAdmin() {
 const params=useParams<{slug:string;module:string}>(), slug=params.slug, module=params.module;
 const variant=slug?.match(/^shayla-akram-([1-4])$/)?.[1]||"4", pkg=packages[variant];
 const moduleIndex=Number(module?.replace("module-",""))-1;
 const isAdmin=module==="admin", title=modules[moduleIndex], allowed=Number.isInteger(moduleIndex)&&moduleIndex>=0&&moduleIndex<pkg.count;
 if(isAdmin)return <AdminDemo variant={variant}/>;
 if(!allowed)return <main className="mosque-module-page"><h1>এই মডিউলটি এই প্যাকেজে নেই</h1><Link href={"/demos/"+slug}>ডেমোতে ফিরে যান</Link></main>;
 return <main className="mosque-module-page"><div className="mosque-module-head"><Link href={"/demos/"+slug}>← ডেমো হোমে ফিরুন</Link><span>ডেমো {variant} · মডিউল {String(moduleIndex+1).padStart(2,"0")}</span></div><section><small>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</small><h1>{title}</h1><p>{descriptions[title]||title+" সংক্রান্ত তথ্য, ব্যবস্থাপনা ও প্রয়োজনীয় কার্যক্রম এখানে দেখা যাবে।"}</p><div className="mosque-module-workspace"><h2>{title} · নমুনা ব্যবস্থাপনা</h2><p>এই পৃষ্ঠাটি মিটিংয়ে মডিউলটির সম্ভাব্য কাজ দেখানোর জন্য তৈরি।</p><label>নমুনা তথ্য</label><input placeholder={title+" লিখুন"}/><label>বিবরণ</label><textarea placeholder="বিস্তারিত লিখুন"/><button onClick={()=>alert("এটি শুধু ডেমো। কোনো তথ্য সংরক্ষণ করা হয়নি।")}>নমুনা সংরক্ষণ দেখুন</button></div><Link href={"/demos/"+slug+"/admin"} className="mosque-module-admin">অ্যাডমিন প্যানেল দেখুন ↗</Link></section></main>;
}
