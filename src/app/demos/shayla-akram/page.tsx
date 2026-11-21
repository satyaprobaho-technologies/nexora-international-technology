import Link from "next/link";

export const metadata = {
  title: "শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ · ওয়েবসাইট প্যাকেজ",
  description: "১৫, ২০, ২৫ ও ৬০ মডিউলের চারটি ওয়েবসাইট প্যাকেজ তুলনা করুন।",
};

const options = [
  { n:"০১", slug:"shayla-akram-1", title:"বেসিক", price:"৳৭০,০০০", modules:15, desc:"মসজিদের পরিচিতি, নামাজের সময়, নোটিশ ও যোগাযোগের জন্য সাধারণ ওয়েবসাইট।", color:"#64748b", points:["মসজিদের পরিচিতি ও ইতিহাস","নামাজ ও জুমার সময়সূচি","নোটিশ, অনুষ্ঠান ও গ্যালারি","সাধারণ অ্যাডমিন প্যানেল"] },
  { n:"০২", slug:"shayla-akram-2", title:"স্ট্যান্ডার্ড", price:"৳১,২০,০০০", modules:20, desc:"আরও কনটেন্ট, ইসলামিক শিক্ষা ও অনুষ্ঠান ব্যবস্থাপনাসহ বর্ধিত ওয়েবসাইট।", color:"#64748b", points:["বেসিকের সব সুবিধা","ইসলামিক প্রবন্ধ ও শিক্ষা","অনুষ্ঠান নিবন্ধন ও সার্চ","ইমেইল আপডেট সাবস্ক্রিপশন"] },
  { n:"০৩", slug:"shayla-akram-3", title:"প্রিমিয়াম", price:"৳১,৭০,০০০", modules:25, desc:"সদস্য, অভিযোগ, ক্যালেন্ডার ও ভিজিটর পরিসংখ্যানসহ উন্নত মসজিদ ওয়েবসাইট।", color:"#64748b", points:["স্ট্যান্ডার্ডের সব সুবিধা","সদস্য নিবন্ধন ও প্রোফাইল","অভিযোগ ও পরামর্শ ব্যবস্থা","ইভেন্ট ক্যালেন্ডার ও পরিসংখ্যান"] },
  { n:"০৪", slug:"shayla-akram-4", title:"এন্টারপ্রাইজ প্রিমিয়াম", price:"৳২,২০,০০০", modules:60, desc:"একটি ওয়েবসাইটে মসজিদ ও ফাউন্ডেশনের পৃথক বিভাগ, পূর্ণাঙ্গ প্রশাসন, আর্থিক ব্যবস্থাপনা ও ডিজিটাল মিডিয়া।", color:"#b88b35", featured:true, points:["৬০টি মডিউল ও দুটি প্রতিষ্ঠানের পৃথক বিভাগ","মসজিদ ও ফাউন্ডেশনের পৃথক অ্যাডমিন নিয়ন্ত্রণ","অনুদান, যাকাত, সদকা ও আর্থিক প্রতিবেদন","ইউটিউব, লাইভ ও মিডিয়া ব্যবস্থাপনা"] },
];

export default function ShaylaAkramDemos() {
 return <main className="shayla-showcase">
  <header className="shayla-showcase-nav"><Link href="/" className="brand">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><nav><Link href="/demos">সব ৫০টি ডেমো</Link><Link href="/">হোম</Link></nav></header>
  <section className="shayla-showcase-hero"><span>বিশেষ প্রকল্প · চারটি প্যাকেজ</span><h1>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</h1><p>প্রয়োজন ও বাজেট অনুযায়ী চারটি ওয়েবসাইট প্যাকেজ। প্রথম তিনটি সাধারণ মসজিদ ওয়েবসাইট; চতুর্থটি মসজিদ ও ফাউন্ডেশনের পূর্ণাঙ্গ সমন্বিত ডিজিটাল প্ল্যাটফর্ম।</p><div className="shayla-showcase-meta"><span>পশ্চিম সাকছিপাড়া, হাজীগঞ্জ, চাঁদপুর</span><span>সম্পূর্ণ বাংলা ডিজাইন</span><span>মোবাইল উপযোগী</span></div></section>
  <section className="shayla-showcase-grid">{options.map(o=><article key={o.slug} className={o.featured?"shayla-option shayla-option-featured":"shayla-option"} style={{borderTopColor:o.color}}>{o.featured&&<strong className="shayla-featured-label">বিশেষ সুপারিশ · সেরা সমন্বিত প্যাকেজ</strong>}<div className="shayla-option-top"><span>প্যাকেজ {o.n}</span><span>{o.modules}টি মডিউল</span></div><h2>{o.title}</h2><div className="shayla-price">{o.price}</div><p>{o.desc}</p><ul>{o.points.map(x=><li key={x}>{x}</li>)}</ul><Link className="shayla-open" style={{background:o.featured?"#176447":"#526477"}} href={"/demos/"+o.slug}>সম্পূর্ণ ডেমো দেখুন ↗</Link></article>)}</section>
  <section className="shayla-showcase-note"><h2>প্যাকেজের গুরুত্বপূর্ণ পার্থক্য</h2><p>১–৩ নম্বর প্যাকেজে কেবল মসজিদের সাধারণ ওয়েবসাইটের সুবিধা থাকবে। এগুলোতে হিসাব, অ্যাকাউন্ট, অনুদান, যাকাত, সদকা বা ফাউন্ডেশনের কোনো মডিউল থাকবে না। ৪ নম্বর Enterprise Premium প্যাকেজে একটি ওয়েবসাইটের মধ্যে মসজিদ ও ফাউন্ডেশনের পৃথক বিভাগ, অনুদান ও আর্থিক ব্যবস্থাপনা, পৃথক অ্যাডমিন এবং ডিজিটাল মিডিয়া সুবিধা অন্তর্ভুক্ত।</p><p><b>মোতাওয়াল্লী:</b> জনাব মোঃ মোস্তফা আকরাম · <b>যোগাযোগ:</b> 01723017577</p></section>
  <footer className="shayla-showcase-footer">NEXORA INTERNATIONAL TECHNOLOGY · Your Digital World Starts Here.</footer>
 </main>;
}