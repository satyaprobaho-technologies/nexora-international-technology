import Link from "next/link";
import { notFound } from "next/navigation";

const moduleNames = ["হোমপেজ","মসজিদের পরিচিতি","মসজিদের ইতিহাস","নামাজের সময়সূচি","আজানের সময়সূচি","জুমার নামাজের সময়","ইমাম ও খতিব পরিচিতি","পরিচালনা কমিটি","নোটিশ বোর্ড","অনুষ্ঠানসূচি","ফটো গ্যালারি","ভিডিও গ্যালারি","জুমার খুতবা আর্কাইভ","কুরআন ও হাদিস","যোগাযোগ ও মানচিত্র","ইসলামিক প্রবন্ধ ও ব্লগ","ইসলামিক শিক্ষা","অনলাইন অনুষ্ঠান নিবন্ধন","ওয়েবসাইট সার্চ","ইমেইল আপডেট সাবস্ক্রিপশন","অনলাইন সদস্য নিবন্ধন","সদস্য প্রোফাইল","অভিযোগ ও পরামর্শ","ইভেন্ট ক্যালেন্ডার","ভিজিটর পরিসংখ্যান","ফাউন্ডেশন পরিচিতি","লক্ষ্য ও উদ্দেশ্য","দরিদ্র পরিবার সহায়তা","এতিম সহায়তা","শিক্ষাবৃত্তি ব্যবস্থাপনা","চিকিৎসা সহায়তা","দুর্যোগ ও ত্রাণ কার্যক্রম","স্বেচ্ছাসেবক ব্যবস্থাপনা","ফাউন্ডেশন প্রকল্প","সহায়তার আবেদন","উপকারভোগী ব্যবস্থাপনা","অনলাইন অনুদান","যাকাত ব্যবস্থাপনা","সদকা ব্যবস্থাপনা","অনলাইন পেমেন্ট","ডিজিটাল রসিদ","দাতা প্রোফাইল","অনুদান ট্র্যাকিং","আয়-ব্যয় হিসাব","বাজেট পরিকল্পনা","ক্রয় ও বিল ব্যবস্থাপনা","বার্ষিক আর্থিক প্রতিবেদন","স্পনসরশিপ ব্যবস্থাপনা","ইউটিউব সংযোগ","লাইভ সম্প্রচার","ভিডিও আর্কাইভ","YouTube Shorts ব্যবস্থাপনা","ভিডিও প্রকাশনা নিয়ন্ত্রণ","মিডিয়া পরিসংখ্যান","মাল্টি-অ্যাডমিন ড্যাশবোর্ড","ভূমিকা ও অনুমতিভিত্তিক নিয়ন্ত্রণ","কনটেন্ট অনুমোদন ও প্রকাশনা","অ্যাডমিন কার্যক্রমের অডিট লগ","ডেটা ব্যাকআপ ও পুনরুদ্ধার","বহুভাষিক কনটেন্ট ব্যবস্থাপনা"];

const packageModuleIndices: Record<string, number[]> = {
 "1": [...Array(10).keys(), 25, 26, 27, 28, 29],
 "2": [...Array(13).keys(), 25, 26, 27, 28, 29, 30, 31],
 "3": [...Array(16).keys(), 25, 26, 27, 28, 29, 30, 31, 32, 33],
 "4": [...Array(60).keys()]
};

const roleNames = ["সুপার অ্যাডমিন","মোতাওয়াল্লী","মসজিদ অ্যাডমিন","ফাউন্ডেশন অ্যাডমিন","মিডিয়া অ্যাডমিন","হিসাবরক্ষক","ভিডিও সম্পাদক"];
const packageData: Record<string,{price:string;count:number;name:string}> = {
"1":{price:"৳৭০,০০০",count:15,name:"বেসিক"},
"2":{price:"৳১,২০,০০০",count:20,name:"স্ট্যান্ডার্ড"},
"3":{price:"৳১,৭০,০০০",count:25,name:"প্রিমিয়াম"},
"4":{price:"৳২,২০,০০০",count:60,name:"এন্টারপ্রাইজ প্রিমিয়াম"}
};
export default async function MosqueDemoSubpage({params}:{params:Promise<{slug:string;subpage:string}>}) {
 const {slug,subpage}=await params;
 const match=slug.match(/^shayla-akram-([1-4])$/);
 if(!match) notFound();
 const variant=match[1], pack=packageData[variant], base="/demos/"+slug, enterprise=variant==="4";
 const admin=subpage==="admin", accounts=subpage==="accounts", moduleMatch=subpage.match(/^module-(\d{2})$/);
 if(!admin&&!accounts&&!moduleMatch) notFound();
 if(accounts&&!enterprise) notFound();
 const number=moduleMatch?Number(moduleMatch[1]):0;
 if(moduleMatch&&(number<1||number>pack.count)) notFound();
 const selectedModules=packageModuleIndices[variant].map(index=>moduleNames[index]);
 const moduleName=moduleMatch?selectedModules[number-1]:"";
 return <main className="mosque-subpage">
  <div className="mosque-subnav"><Link href={base}>← মূল ডেমোতে ফিরুন</Link><span>NEXORA · {pack.name} প্যাকেজ</span><span>প্রদর্শনী মোড</span></div>
  {admin?<><section className="mosque-subhero"><span>{enterprise?"ডেমো পেজ ৫৫–৬০ / ৬০ · নিয়ন্ত্রণ কেন্দ্র":`অ্যাডমিন ডেমো · প্যাকেজ ০${variant} · ${pack.count}টি মডিউল`}</span><h1>অ্যাডমিন প্যানেল</h1><p>{enterprise?"মসজিদ ও ফাউন্ডেশনের পৃথক বিভাগ এবং দায়িত্ব অনুযায়ী নিয়ন্ত্রণের নমুনা ব্যবস্থা।":"মসজিদ ও ফাউন্ডেশনের পৃথক বিভাগ এবং নির্ধারিত মডিউল পরিচালনার সাধারণ অ্যাডমিন প্যানেল।"} এখানে কোনো বাস্তব গ্রাহক তথ্য বা আর্থিক লেনদেন নেই।</p><b>{pack.price} · {pack.count}টি মডিউল</b></section>
  <section className="mosque-admin-layout"><aside><h2>প্রশাসনিক ভূমিকা</h2>{(enterprise?roleNames:["প্রধান অ্যাডমিন","কনটেন্ট সম্পাদক"]).map((r,i)=><a key={r} href={"#role-"+i}>{r}</a>)}</aside><div className="mosque-admin-content"><h2>দায়িত্বভিত্তিক ড্যাশবোর্ড</h2><div className="mosque-admin-cards"><article><small>বিভাগ</small><b>"২টি"</b></article><article><small>মডিউল</small><b>{pack.count}টি</b></article><article><small>অনুমোদনের অপেক্ষায়</small><b>০৩</b></article><article><small>নমুনা প্রতিবেদন</small><b>{enterprise?"১২টি":"০১টি"}</b></article></div>{(enterprise?roleNames:["প্রধান অ্যাডমিন","কনটেন্ট সম্পাদক"]).map((r,i)=><section id={"role-"+i} className="mosque-role-panel" key={r}><h3>{r}</h3><p>{enterprise?(i===0?"সব বিভাগ ও ভূমিকার সার্বিক পর্যবেক্ষণ এবং অনুমতি নিয়ন্ত্রণ।":i===1?"মসজিদের পরিচালনা, অনুমোদন, সভা ও গুরুত্বপূর্ণ সিদ্ধান্ত।":i===2?"মসজিদের ওয়েবসাইট ও ধর্মীয় কনটেন্ট পরিচালনা।":i===3?"ফাউন্ডেশনের প্রকল্প, সহায়তা ও প্রতিবেদন পরিচালনা।":"নিজ নিজ দায়িত্বের নির্ধারিত তথ্য দেখা, সম্পাদনা ও পর্যালোচনা।"):"মসজিদের ওয়েবসাইটের নির্ধারিত তথ্য ও কনটেন্ট পরিচালনা।"}</p><span>নমুনা অনুমতি: দেখুন · সম্পাদনা · অনুমোদন (ভূমিকা অনুযায়ী)</span></section>)}</div></section>
  <section className="mosque-module-directory"><h2>মডিউল নিয়ন্ত্রণ</h2><div>{selectedModules.map((n,i)=><Link key={n} href={base+"/module-"+String(i+1).padStart(2,"0")}>{String(i+1).padStart(2,"0")} · {n} ↗</Link>)}</div></section></>:accounts?<><section className="mosque-subhero"><span>ডেমো পেজ ৪৪–৪৮ / ৬০ · ACCOUNTS WORKSPACE</span><h1>স্বতন্ত্র Accounts বিভাগ</h1><p>আয়-ব্যয়, বাজেট, বিল ও আর্থিক প্রতিবেদন পরিচালনার আলাদা কর্মক্ষেত্র। এটি প্রদর্শনী; এখানে বাস্তব লগইন বা সংরক্ষিত আর্থিক তথ্য নেই।</p><b>শুধু Accounts দায়িত্বের জন্য পরিকল্পিত · {pack.price}</b></section><section className="mosque-module-demo"><h2>Accounts-এর ৫টি মডিউল</h2><div className="mosque-module-actions">{moduleNames.slice(43,48).map((n,i)=><article key={n}><b>{String(i+44).padStart(2,"0")} · {n}</b><p>এই মডিউলটি Accounts কর্মক্ষেত্রের অংশ; পাবলিক ওয়েবসাইটের নেভিগেশনে দেখানো হয় না।</p><Link href={base+"/module-"+String(i+44).padStart(2,"0")}>ডেমো মডিউল খুলুন ↗</Link></article>)}</div><p className="mosque-admin-disclaimer">বাস্তব ব্যবহারের আগে Firebase Authentication, server-side role verification এবং Firestore security rules দিয়ে Accounts access আলাদাভাবে সুরক্ষিত করতে হবে।</p></section></>:<><section className="mosque-subhero"><span>ডেমো পেজ {String(number).padStart(2,"0")} / {pack.count} · মডিউল {String(number).padStart(2,"0")}</span><h1>{moduleName}</h1><p>{enterprise?"শায়লা আকরাম মসজিদ ও ফাউন্ডেশনের":"শায়লা আকরাম কেন্দ্রীয় জামে মসজিদের"} {moduleName} বিভাগের প্রদর্শনী পৃষ্ঠা।</p><b>{pack.name} · {pack.price}</b></section><section className="mosque-module-demo"><h2>{moduleName} ব্যবস্থাপনা</h2><p>এই নমুনা পেজে মডিউলটির সম্ভাব্য তথ্য ও কাজের ধাপ দেখানো হচ্ছে। প্রকৃত তথ্য সংরক্ষণ, ব্যবহারকারী অনুমতি এবং ডেটাবেস সংযোগ চূড়ান্ত বাস্তবায়নের অংশ।</p><div className="mosque-module-actions"><article><b>তথ্য তালিকা</b><p>অনুমোদিত তথ্য এখানে তালিকাভুক্ত হবে।</p></article><article><b>নতুন তথ্য যোগ</b><p>নতুন রেকর্ড তৈরির ফরম এখানে থাকবে।</p></article><article><b>পর্যালোচনা ও অনুমোদন</b><p>দায়িত্বপ্রাপ্ত অ্যাডমিন তথ্য যাচাই করবেন।</p></article></div><Link className="mosque-admin-link" href={base+"/admin"}>অ্যাডমিন প্যানেলে যান ↗</Link></section><nav className="mosque-module-nav">{number>1?<Link href={base+"/module-"+String(number-1).padStart(2,"0")}>← আগের মডিউল</Link>:<span/>}<Link href={base}>সব মডিউল</Link>{number<pack.count?<Link href={base+"/module-"+String(number+1).padStart(2,"0")}>পরের মডিউল →</Link>:<span/>}</nav></>}
  <footer className="mosque-subfooter">NEXORA INTERNATIONAL TECHNOLOGY · প্রদর্শনী নমুনা, বাস্তব প্রশাসনিক ব্যবস্থা নয়</footer>
 </main>;
}