import Link from "next/link";
import { notFound } from "next/navigation";

const moduleNames = [
"হোমপেজ","মসজিদের পরিচিতি","নামাজের সময়সূচি","আজানের সময়সূচি","নোটিশ বোর্ড","ফটো গ্যালারি","ভিডিও গ্যালারি","ইমাম ও খতিব","যোগাযোগ ও মানচিত্র","মসজিদ প্রশাসন",
"মোতাওয়াল্লীর বাণী","শায়লা আকরাম ফাউন্ডেশন","পরিচালনা কমিটি","ফাউন্ডেশন প্রকল্প","আমাদের অর্জন",
"অনলাইন অনুদান","যাকাত ও সদকা","আয়-ব্যয় হিসাব","ডিজিটাল রসিদ","অনুদান ট্র্যাকিং",
"ধর্মীয় অনুষ্ঠান","জুমার খুতবা","ইসলামিক শিক্ষা","অনলাইন কোরআন শিক্ষা","কোরআন ও হাদিস",
"মুসল্লি নিবন্ধন","সদস্য ব্যবস্থাপনা","অভিযোগ ও পরামর্শ","অসহায় সহায়তা","শিক্ষা ও বৃত্তি",
"চিকিৎসা সহায়তা","রমজান ব্যবস্থাপনা","স্বেচ্ছাসেবক","প্রকল্প অগ্রগতি","বার্ষিক প্রতিবেদন",
"অনলাইন পেমেন্ট","সদস্য পরিচয়পত্র","অভিযোগ ট্র্যাকিং","এসএমএস ও ইমেইল","উন্নত রিপোর্টিং",
"অনলাইন সভা ব্যবস্থাপনা","সিদ্ধান্ত ও অনুমোদন","সম্পদ ও সম্পত্তি ব্যবস্থাপনা","কর্মচারী ব্যবস্থাপনা","নির্মাণ ও রক্ষণাবেক্ষণ",
"বাজেট পরিকল্পনা","ক্রয় ও বিল ব্যবস্থাপনা","দাতা ও সহযোগী ব্যবস্থাপনা","নিরাপত্তা ও কার্যক্রম লগ","ডকুমেন্ট আর্কাইভ"
];
const roleNames = ["সুপার অ্যাডমিন","মোতাওয়াল্লী","ফাউন্ডেশন অ্যাডমিন","সভাপতি","সাধারণ সম্পাদক","হিসাবরক্ষক","ইমাম ও খতিব","দান ব্যবস্থাপক","শিক্ষা ব্যবস্থাপক","কনটেন্ট সম্পাদক"];
const packageData: Record<string,{price:string;count:number;name:string}> = {
"1":{price:"৳৭০,০০০",count:35,name:"ক্লাসিক"},
"2":{price:"৳১,২০,০০০",count:40,name:"স্ট্যান্ডার্ড"},
"3":{price:"৳১,৭০,০০০",count:45,name:"প্রিমিয়াম"},
"4":{price:"৳২,২০,০০০",count:50,name:"এন্টারপ্রাইজ"}
};
export default async function MosqueDemoSubpage({params}:{params:Promise<{slug:string;subpage:string}>}) {
 const {slug,subpage}=await params;
 const match=slug.match(/^shayla-akram-([1-4])$/);
 if(!match) notFound();
 const variant=match[1], pack=packageData[variant];
 const base="/demos/"+slug;
 const admin=subpage==="admin";
 const moduleMatch=subpage.match(/^module-(\d{2})$/);
 if(!admin&&!moduleMatch) notFound();
 const number=moduleMatch?Number(moduleMatch[1]):0;
 if(moduleMatch&&(number<1||number>pack.count)) notFound();
 const moduleName=moduleMatch?moduleNames[number-1]:"";
 return <main className="mosque-subpage">
  <div className="mosque-subnav"><Link href={base}>← মূল ডেমোতে ফিরুন</Link><span>NEXORA · {pack.name} প্যাকেজ</span><span>প্রদর্শনী মোড</span></div>
  {admin?<><section className="mosque-subhero"><span>নিয়ন্ত্রণ কেন্দ্র · ডেমো</span><h1>অ্যাডমিন প্যানেল</h1><p>মসজিদ ও ফাউন্ডেশনের কাজ দায়িত্ব অনুযায়ী আলাদা করে দেখার নমুনা নিয়ন্ত্রণ ব্যবস্থা। এখানে কোনো বাস্তব গ্রাহক তথ্য বা আর্থিক লেনদেন নেই।</p><b>{pack.price} · {pack.count}টি মডিউল</b></section>
  <section className="mosque-admin-layout"><aside><h2>প্রশাসনিক ভূমিকা</h2>{roleNames.map(r=><a key={r} href={"#role-"+roleNames.indexOf(r)}>{r}</a>)}</aside><div className="mosque-admin-content"><h2>দায়িত্বভিত্তিক ড্যাশবোর্ড</h2><div className="mosque-admin-cards"><article><small>প্রতিষ্ঠান</small><b>২টি</b></article><article><small>মডিউল</small><b>{pack.count}টি</b></article><article><small>অনুমোদনের অপেক্ষায়</small><b>০৫</b></article><article><small>নমুনা প্রতিবেদন</small><b>১২টি</b></article></div>{roleNames.map((r,i)=><section id={"role-"+i} className="mosque-role-panel" key={r}><h3>{r}</h3><p>{i===0?"সকল বিভাগ ও ভূমিকার সার্বিক পর্যবেক্ষণ এবং অনুমতি নিয়ন্ত্রণের নমুনা।":i===1?"মসজিদের পরিচালনা, অনুমোদন, সভা ও গুরুত্বপূর্ণ সিদ্ধান্তের নমুনা নিয়ন্ত্রণ।":i===2?"ফাউন্ডেশনের প্রকল্প, সহায়তা, স্বেচ্ছাসেবক ও প্রতিবেদন পরিচালনার নমুনা।":"নিজ নিজ দায়িত্বের নির্ধারিত তথ্য দেখা, সম্পাদনা ও পর্যালোচনার নমুনা।"}</p><span>নমুনা অনুমতি: দেখুন · সম্পাদনা · অনুমোদন (ভূমিকা অনুযায়ী)</span></section>)}</div></section>
  <section className="mosque-module-directory"><h2>মডিউল নিয়ন্ত্রণ</h2><div>{moduleNames.slice(0,pack.count).map((n,i)=><Link key={n} href={base+"/module-"+String(i+1).padStart(2,"0")}>{String(i+1).padStart(2,"0")} · {n} ↗</Link>)}</div></section></>:<><section className="mosque-subhero"><span>মডিউল {String(number).padStart(2,"0")} / {pack.count}</span><h1>{moduleName}</h1><p>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ ও শায়লা আকরাম ফাউন্ডেশনের জন্য {moduleName} বিভাগের প্রদর্শনী পৃষ্ঠা।</p><b>{pack.name} · {pack.price}</b></section><section className="mosque-module-demo"><h2>{moduleName} ব্যবস্থাপনা</h2><p>এই নমুনা পেজে মডিউলটির সম্ভাব্য তথ্য ও কাজের ধাপ দেখানো হচ্ছে। প্রকৃত তথ্য সংরক্ষণ, ব্যবহারকারী অনুমতি এবং ডেটাবেস সংযোগ চূড়ান্ত বাস্তবায়নের অংশ।</p><div className="mosque-module-actions"><article><b>তথ্য তালিকা</b><p>অনুমোদিত তথ্য এখানে তালিকাভুক্ত হবে।</p></article><article><b>নতুন তথ্য যোগ</b><p>নতুন রেকর্ড তৈরির ফরম এখানে থাকবে।</p></article><article><b>পর্যালোচনা ও অনুমোদন</b><p>দায়িত্বপ্রাপ্ত অ্যাডমিন তথ্য যাচাই করবেন।</p></article></div><Link className="mosque-admin-link" href={base+"/admin"}>অ্যাডমিন প্যানেলে যান ↗</Link></section><nav className="mosque-module-nav">{number>1?<Link href={base+"/module-"+String(number-1).padStart(2,"0")}>← আগের মডিউল</Link>:<span/>}<Link href={base}>সব মডিউল</Link>{number<pack.count?<Link href={base+"/module-"+String(number+1).padStart(2,"0")}>পরের মডিউল →</Link>:<span/>}</nav></>}
  <footer className="mosque-subfooter">NEXORA INTERNATIONAL TECHNOLOGY · প্রদর্শনী নমুনা, বাস্তব প্রশাসনিক ব্যবস্থা নয়</footer>
 </main>;
}
