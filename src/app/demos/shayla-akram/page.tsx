import Link from "next/link";

export const metadata = {
  title: "শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ · চারটি ওয়েবসাইট ডেমো",
  description: "চারটি প্যাকেজের বাংলা ওয়েবসাইট ডেমো তুলনা করে দেখুন।",
};

const options = [
  { n:"০১", slug:"shayla-akram-1", title:"ক্লাসিক", price:"৳৭০,০০০", modules:35, desc:"মসজিদের পরিচিতি, নামাজের সময়, নোটিশ ও যোগাযোগের জন্য সহজ ও মার্জিত ওয়েবসাইট।", color:"#237b58", points:["মসজিদ পরিচিতি","নামাজের সময়সূচি","নোটিশ ও গ্যালারি","মৌলিক অ্যাডমিন"] },
  { n:"০২", slug:"shayla-akram-2", title:"স্ট্যান্ডার্ড", price:"৳১,২০,০০০", modules:40, desc:"মসজিদের পাশাপাশি ফাউন্ডেশন, সদস্য নিবন্ধন ও অনুদানের প্রাথমিক ব্যবস্থাপনা।", color:"#236b83", points:["ক্লাসিকের সব সুবিধা","ফাউন্ডেশন বিভাগ","সদস্য ও অনুদান","প্রাথমিক প্রতিবেদন"] },
  { n:"০৩", slug:"shayla-akram-3", title:"প্রিমিয়াম", price:"৳১,৭০,০০০", modules:45, desc:"প্রকল্প, আর্থিক প্রতিবেদন, ডিজিটাল রসিদ ও একাধিক অ্যাডমিন ভূমিকা।", color:"#9a7130", points:["স্ট্যান্ডার্ডের সব সুবিধা","প্রকল্প অগ্রগতি","ডিজিটাল রসিদ ও রিপোর্ট","দায়িত্বভিত্তিক অ্যাডমিন"] },
  { n:"০৪", slug:"shayla-akram-4", title:"এন্টারপ্রাইজ", price:"৳২,২০,০০০", modules:50, desc:"একটি ওয়েবসাইটে মসজিদ ও ফাউন্ডেশনের পূর্ণাঙ্গ সমন্বিত ডিজিটাল প্ল্যাটফর্ম।", color:"#176447", points:["৫০টি মডিউল","দুটি প্রতিষ্ঠানের পৃথক নিয়ন্ত্রণ","কেন্দ্রীয় ও পৃথক অ্যাডমিন লগইন","উন্নত আর্থিক ও প্রশাসনিক ব্যবস্থা"] },
];

export default function ShaylaAkramDemos() {
 return <main className="shayla-showcase">
  <header className="shayla-showcase-nav"><Link href="/" className="brand">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><nav><Link href="/demos">সব ৫০টি ডেমো</Link><Link href="/">হোম</Link></nav></header>
  <section className="shayla-showcase-hero"><span>বিশেষ প্রকল্প · চারটি বিকল্প</span><h1>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</h1><p>একই প্রতিষ্ঠানের জন্য চারটি আলাদা ডিজাইন ও ফিচার প্যাকেজ। প্রতিটি ডেমো খুলে সরাসরি মডিউল, অ্যাডমিন নিয়ন্ত্রণ ও নমুনা অনুদান প্রক্রিয়া দেখে নিন।</p><div className="shayla-showcase-meta"><span>পশ্চিম সাকছিপাড়া, হাজীগঞ্জ, চাঁদপুর</span><span>সম্পূর্ণ বাংলা ডিজাইন</span><span>মোবাইল উপযোগী</span></div></section>
  <section className="shayla-showcase-grid">{options.map(o=><article key={o.slug} className="shayla-option" style={{borderTopColor:o.color}}><div className="shayla-option-top"><span>ডেমো {o.n}</span><span>{o.modules}টি মডিউল</span></div><h2>{o.title}</h2><div className="shayla-price">{o.price}</div><p>{o.desc}</p><ul>{o.points.map(x=><li key={x}>{x}</li>)}</ul><Link className="shayla-open" style={{background:o.color}} href={"/demos/"+o.slug}>সম্পূর্ণ ডেমো দেখুন ↗</Link></article>)}</section>
  <section className="shayla-showcase-note"><h2>মিটিংয়ে কীভাবে দেখাবেন?</h2><p>প্রতিটি ডেমো খুলে “মডিউল তালিকা”, “অ্যাডমিন প্যানেল” ও “অনুদান” ট্যাব দেখান। অনুদান ও অ্যাডমিন কার্যক্রম এখানে নমুনা; প্রকৃত পেমেন্ট বা তথ্য সংরক্ষণ চালু নয়। চূড়ান্ত প্যাকেজ নির্বাচনের পর অনুমোদিত কাজ অনুযায়ী বাস্তবায়ন হবে।</p><p><b>মোতাওয়াল্লী:</b> মোস্তফা আকরাম · <b>যোগাযোগ:</b> 01723017577</p></section>
  <footer className="shayla-showcase-footer">NEXORA INTERNATIONAL TECHNOLOGY · Your Digital World Starts Here.</footer>
 </main>;
}
