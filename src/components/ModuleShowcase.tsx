"use client";

import { useMemo, useState } from "react";

type Props = { moduleName: string; moduleNumber: number; sourceIndex: number; packageName: string; packagePrice: string; owner: string };

const fieldSets: Record<string, string[]> = {
  profile: ["শিরোনাম", "বিস্তারিত", "দায়িত্বপ্রাপ্ত ব্যক্তি"],
  schedule: ["ওয়াক্ত", "আজানের সময়", "জামাতের সময়"],
  notice: ["নোটিশের শিরোনাম", "প্রকাশের তারিখ", "বিস্তারিত"],
  event: ["অনুষ্ঠানের নাম", "তারিখ", "স্থান"],
  people: ["নাম", "পদবি/পরিচয়", "মোবাইল নম্বর"],
  gallery: ["ছবির/ভিডিওর শিরোনাম", "তারিখ", "মিডিয়া লিংক"],
  article: ["শিরোনাম", "লেখক", "বিষয়বস্তু"],
  registration: ["আবেদনকারীর নাম", "মোবাইল নম্বর", "ঠিকানা"],
  complaint: ["নাম (ঐচ্ছিক)", "যোগাযোগ", "অভিযোগ/পরামর্শ"],
  foundation: ["উপকারভোগীর নাম", "সহায়তার ধরন", "আবেদনের অবস্থা"],
  scholarship: ["শিক্ষার্থীর নাম", "শ্রেণি/প্রতিষ্ঠান", "আবেদনের অবস্থা"],
  medical: ["রোগীর নাম", "সহায়তার প্রয়োজন", "আবেদনের অবস্থা"],
  project: ["প্রকল্পের নাম", "বাজেট (৳)", "অগ্রগতির হার (%)"],
  volunteer: ["স্বেচ্ছাসেবকের নাম", "দক্ষতা/এলাকা", "মোবাইল নম্বর"],
  finance: ["খাত/বিবরণ", "পরিমাণ (৳)", "তারিখ"],
  media: ["কনটেন্টের শিরোনাম", "প্রকাশের তারিখ", "স্ট্যাটাস"],
  admin: ["অ্যাডমিনের নাম", "ভূমিকা", "অনুমতি"],
  general: ["রেকর্ডের শিরোনাম", "বিবরণ", "স্ট্যাটাস"]
};

function groupFor(i: number) {
  if (i === 3 || i === 4 || i === 5) return "schedule";
  if (i === 8) return "notice";
  if (i === 9 || i === 17 || i === 23) return "event";
  if (i === 6 || i === 7 || i === 20 || i === 21 || i === 32 || i === 41) return "people";
  if (i === 10 || i === 11 || i === 12 || i === 49 || i === 50 || i === 51 || i === 52 || i === 53) return "gallery";
  if (i === 13 || i === 15 || i === 16) return "article";
  if (i === 18 || i === 19 || i === 34) return "registration";
  if (i === 22) return "complaint";
  if (i === 29) return "scholarship";
  if (i === 30) return "medical";
  if (i === 27 || i === 28 || i === 31 || i === 35 || i === 36 || i === 37 || i === 38 || i === 39 || i === 40 || i === 41 || i === 42) return "foundation";
  if (i === 32) return "volunteer";
  if (i === 33) return "project";
  if (i >= 43 && i <= 47) return "finance";
  if (i >= 54 && i <= 59) return "admin";
  if (i === 24) return "general";
  return "profile";
}

function examples(i: number, name: string): string[][] {
  const sets: Record<string, string[][]> = {
    schedule: [["ফজর", "ভোর ৪:৪৫", "ভোর ৫:০০"], ["যোহর", "দুপুর ১২:১৫", "দুপুর ১:১৫"], ["আসর", "বিকেল ৪:৩০", "বিকেল ৪:৪৫"], ["মাগরিব", "সূর্যাস্ত", "সূর্যাস্তের ৫ মিনিট পর"], ["এশা", "রাত ৭:৪৫", "রাত ৮:০০"]],
    notice: [["জুমার নামাজের সময়সূচি", "২১-১১-২০২৬", "আগামী শুক্রবার নির্ধারিত সময়ে জুমার জামাত অনুষ্ঠিত হবে।"], ["পরিচ্ছন্নতা কর্মসূচি", "১৯-১১-২০২৬", "সকল সদস্যকে অংশগ্রহণের অনুরোধ করা হচ্ছে।"]],
    event: [["সাপ্তাহিক তাফসির মাহফিল", "২৮-১১-২০২৬", "মসজিদ প্রাঙ্গণ"], ["শীতবস্ত্র বিতরণ", "০৫-১২-২০২৬", "ফাউন্ডেশন কার্যালয়"]],
    people: [["মোঃ আব্দুল করিম", "ইমাম", "০১৭০০০০০০০০"], ["মোঃ রফিকুল ইসলাম", "কমিটির সদস্য", "০১৮০০০০০০০০"]],
    scholarship: [["আয়েশা আক্তার", "অষ্টম শ্রেণি · স্থানীয় বিদ্যালয়", "যাচাইাধীন"], ["মোঃ সাকিব", "দশম শ্রেণি · স্থানীয় বিদ্যালয়", "অনুমোদিত"]],
    medical: [["রহিমা বেগম", "চিকিৎসা ব্যয় সহায়তা", "যাচাইাধীন"], ["মোঃ জসিম", "ওষুধ সহায়তা", "অনুমোদিত"]],
    project: [["শিক্ষা সহায়তা প্রকল্প", "১৫০০০০", "৬৫"], ["শীতবস্ত্র বিতরণ", "৮০০০০", "৩০"]],
    finance: [["সাধারণ অনুদান", "৫০০০", "২০-১১-২০২৬"], ["বিদ্যুৎ বিল", "১৮০০", "১৮-১১-২০২৬"]],
    admin: [["প্রধান অ্যাডমিন", "সুপার অ্যাডমিন", "সব বিভাগ"], ["কনটেন্ট সম্পাদক", "সম্পাদক", "কনটেন্ট সম্পাদনা"]],
    registration: [["মোঃ হাসান", "০১৯০০০০০০০০", "হাজীগঞ্জ"], ["সুমাইয়া আক্তার", "০১৬০০০০০০০০", "চাঁদপুর"]],
    complaint: [["এলাকাবাসী", "০১৭০০০০০০০০", "মসজিদের সামনে আলো স্থাপনের অনুরোধ"]],
    gallery: [["প্রতিষ্ঠানের কার্যক্রম", "২০-১১-২০২৬", "ডেমো মিডিয়া"], ["সাপ্তাহিক আয়োজন", "১৪-১১-২০২৬", "ডেমো মিডিয়া"]],
    article: [["দৈনন্দিন জীবনে কুরআনের শিক্ষা", "সম্পাদকীয় বিভাগ", "ইসলামিক জ্ঞান ও নৈতিকতা বিষয়ক লেখা"]],
    foundation: [["একটি অসচ্ছল পরিবার", "মাসিক খাদ্য সহায়তা", "যাচাইাধীন"], ["একজন প্রবীণ উপকারভোগী", "জরুরি সহায়তা", "অনুমোদিত"]],
    profile: [[name, "প্রতিষ্ঠানের পরিচিতি", "প্রশাসন"], ["সেবা ও কার্যক্রম", "বিস্তারিত তথ্য", "প্রকাশিত"]]
  };
  const g = groupFor(i);
  return sets[g] || sets.profile;
}

export default function ModuleShowcase({moduleName,moduleNumber,sourceIndex,packageName,packagePrice,owner}:Props) {
  const group = groupFor(sourceIndex);
  const fields = fieldSets[group] || fieldSets.general;
  const [rows,setRows] = useState(() => examples(sourceIndex,moduleName).map((v,idx)=>({id:idx+1,values:v})));
  const [values,setValues] = useState<string[]>(fields.map(()=> ""));
  const [query,setQuery] = useState("");
  const [notice,setNotice] = useState("");
  const filtered = useMemo(()=>rows.filter(row=>row.values.join(" ").toLowerCase().includes(query.toLowerCase())),[rows,query]);
  const save = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(values.every(v=>!v.trim())) { setNotice("কমপক্ষে একটি তথ্য লিখুন।"); return; }
    setRows(old=>[{id:Date.now(),values:fields.map((_,i)=>values[i]?.trim() || "—")},...old]);
    setValues(fields.map(()=> ""));
    setNotice("ডেমো রেকর্ড তালিকায় যোগ হয়েছে। পেজ রিফ্রেশ করলে নমুনা ডেটা আগের অবস্থায় ফিরবে।");
  };
  return <section className="module-workspace">
    <div className="module-workspace-head">
      <div><span className="module-kicker">LIVE MODULE PREVIEW · PAGE {String(moduleNumber).padStart(2,"0")}</span><h2>{moduleName} — কার্যকরী নমুনা</h2><p>{owner} এই মডিউলে কীভাবে তথ্য দেখা, যোগ, খোঁজা ও পরিচালনা করা যাবে তার উদাহরণ।</p></div>
      <div className="module-package-pill">{packageName}<b>{packagePrice}</b></div>
    </div>
    <div className="module-metrics">
      <article><small>নমুনা রেকর্ড</small><b>{rows.length}</b><span>ডেমো ডেটা</span></article>
      <article><small>ফলাফল</small><b>{filtered.length}</b><span>অনুসন্ধান অনুযায়ী</span></article>
      <article><small>মডিউল পেজ</small><b>{String(moduleNumber).padStart(2,"0")}</b><span>মোট প্যাকেজ পেজের মধ্যে</span></article>
    </div>
    <div className="module-workspace-grid">
      <form className="module-entry-card" onSubmit={save}>
        <div className="module-card-heading"><div><span>CREATE NEW</span><h3>নতুন তথ্য যোগ করুন</h3></div><b>＋</b></div>
        {fields.map((field,i)=><label key={field}>{field}{field.includes("বিস্তারিত")||field.includes("বিষয়বস্তু")||field.includes("প্রয়োজন")?<textarea value={values[i]} onChange={e=>setValues(old=>old.map((v,j)=>j===i?e.target.value:v))} placeholder={field+" লিখুন"}/>:<input value={values[i]} onChange={e=>setValues(old=>old.map((v,j)=>j===i?e.target.value:v))} placeholder={field+" লিখুন"}/>}</label>)}
        <button type="submit">নমুনা তথ্য যোগ করুন ↗</button>
        {notice&&<p className="module-feedback" role="status">{notice}</p>}
        <small>এটি ব্রাউজারের অস্থায়ী ডেমো। এখানে কোনো বাস্তব তথ্য সার্ভারে সংরক্ষণ হয় না।</small>
      </form>
      <div className="module-record-card">
        <div className="module-card-heading"><div><span>MANAGE RECORDS</span><h3>তথ্য তালিকা</h3></div><b>▤</b></div>
        <div className="module-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="তথ্য খুঁজুন..."/><span>⌕</span></div>
        <div className="module-record-list">
          {filtered.map((row,index)=><article key={row.id}><div className="module-record-number">{String(index+1).padStart(2,"0")}</div><div className="module-record-content"><b>{row.values[0] || "নতুন রেকর্ড"}</b><p>{row.values.slice(1).filter(Boolean).join(" · ")}</p><span>{index===0?"সর্বশেষ নমুনা":"নমুনা রেকর্ড"}</span></div><button type="button" onClick={()=>setNotice("রেকর্ড: "+row.values.join(" | "))}>বিস্তারিত</button></article>)}
          {!filtered.length&&<p className="module-empty">কোনো তথ্য পাওয়া যায়নি।</p>}
        </div>
        <div className="module-record-footer">মোট {filtered.length}টি নমুনা রেকর্ড <span>প্রদর্শনী তথ্য</span></div>
      </div>
    </div>
    <div className="module-workflow"><b>এই মডিউলের সাধারণ কাজের ধাপ</b><div><span>০১ · তথ্য যোগ</span><i>→</i><span>০২ · যাচাই/সম্পাদনা</span><i>→</i><span>০৩ · অনুমোদন/প্রকাশ</span></div></div>
  </section>;
}
