"use client";

import { useMemo, useState } from "react";

type Props = { moduleName:string; moduleNumber:number; sourceIndex:number; packageName:string; packagePrice:string; owner:string };
type RecordRow = {id:number; values:string[]; status:string};

const categories:Record<string,{fields:string[];samples:string[][];steps:string[];description:string;action:string}> = {
 schedule:{fields:["ওয়াক্ত","আজানের সময়","জামাতের সময়"],samples:[["ফজর","ভোর ৪:৪৫","ভোর ৫:০০"],["যোহর","দুপুর ১২:১৫","দুপুর ১:১৫"],["আসর","বিকেল ৪:৩০","বিকেল ৪:৪৫"],["মাগরিব","সূর্যাস্ত","সূর্যাস্তের ৫ মিনিট পর"],["এশা","রাত ৭:৪৫","রাত ৮:০০"]],steps:["ওয়াক্ত নির্বাচন","আজান ও জামাতের সময় নির্ধারণ","সময়সূচি প্রকাশ"],description:"প্রতিটি ওয়াক্তের সময় আলাদাভাবে নির্ধারণ, সংশোধন এবং প্রকাশের নমুনা।",action:"সময়সূচি প্রকাশ করুন"},
 notice:{fields:["নোটিশের শিরোনাম","প্রকাশের তারিখ","বিস্তারিত"],samples:[["জুমার নামাজের সময়সূচি","২১-১১-২০২৬","আগামী শুক্রবার নির্ধারিত সময়ে জুমার জামাত অনুষ্ঠিত হবে।"],["পরিচ্ছন্নতা কর্মসূচি","১৯-১১-২০২৬","সকল সদস্যকে অংশগ্রহণের অনুরোধ করা হচ্ছে।"]],steps:["নোটিশ লিখুন","খসড়া যাচাই করুন","প্রকাশ করুন"],description:"নোটিশ তৈরি, খসড়া রাখা এবং প্রকাশিত নোটিশের তালিকা পরিচালনা।",action:"নোটিশ প্রকাশ করুন"},
 event:{fields:["অনুষ্ঠানের নাম","তারিখ ও সময়","স্থান/বিবরণ"],samples:[["সাপ্তাহিক তাফসির মাহফিল","২৮-১১-২০২৬","মসজিদ প্রাঙ্গণ"],["শীতবস্ত্র বিতরণ","০৫-১২-২০২৬","ফাউন্ডেশন কার্যালয়"]],steps:["অনুষ্ঠান তৈরি","তারিখ ও স্থান নির্ধারণ","ক্যালেন্ডারে প্রকাশ"],description:"অনুষ্ঠান তৈরি, সময়-স্থান নির্ধারণ এবং ক্যালেন্ডারে প্রকাশের নমুনা।",action:"অনুষ্ঠান যোগ করুন"},
 people:{fields:["নাম","পদবি/পরিচয়","মোবাইল নম্বর"],samples:[["মোঃ আব্দুল করিম","ইমাম","০১৭০০০০০০০০"],["মোঃ রফিকুল ইসলাম","কমিটির সদস্য","০১৮০০০০০০০০"]],steps:["ব্যক্তির তথ্য নিন","পরিচয় যাচাই করুন","প্রোফাইল সংরক্ষণ করুন"],description:"ব্যক্তি, দায়িত্ব, যোগাযোগ ও প্রোফাইল তথ্য পরিচালনার নমুনা।",action:"প্রোফাইল তৈরি করুন"},
 gallery:{fields:["মিডিয়ার শিরোনাম","তারিখ","ছবি/ভিডিও URL"],samples:[["প্রতিষ্ঠানের কার্যক্রম","২০-১১-২০২৬","https://example.com/demo-media"],["সাপ্তাহিক আয়োজন","১৪-১১-২০২৬","https://example.com/demo-video"]],steps:["মিডিয়া নির্বাচন","শিরোনাম ও বিবরণ দিন","পর্যালোচনা করে প্রকাশ"],description:"ছবি/ভিডিও যোগ, শিরোনাম নির্ধারণ এবং প্রকাশের নমুনা।",action:"মিডিয়া যোগ করুন"},
 article:{fields:["শিরোনাম","লেখক/সূত্র","বিষয়বস্তু"],samples:[["দৈনন্দিন জীবনে কুরআনের শিক্ষা","সম্পাদকীয় বিভাগ","ইসলামিক জ্ঞান ও নৈতিকতা বিষয়ক লেখা।"]],steps:["লেখা তৈরি","সম্পাদনা ও যাচাই","প্রকাশ করুন"],description:"লেখা বা শিক্ষামূলক কনটেন্ট তৈরি, সম্পাদনা এবং প্রকাশের নমুনা।",action:"কনটেন্ট প্রকাশ করুন"},
 registration:{fields:["আবেদনকারীর নাম","মোবাইল নম্বর","ঠিকানা/বিবরণ"],samples:[["মোঃ হাসান","০১৯০০০০০০০০","হাজীগঞ্জ"],["সুমাইয়া আক্তার","০১৬০০০০০০০০","চাঁদপুর"]],steps:["আবেদন জমা","তথ্য যাচাই","অনুমোদন/প্রত্যাখ্যান"],description:"নিবন্ধন বা আবেদন গ্রহণ, যাচাই এবং সিদ্ধান্তের নমুনা।",action:"আবেদন গ্রহণ করুন"},
 complaint:{fields:["নাম (ঐচ্ছিক)","যোগাযোগ","অভিযোগ/পরামর্শ"],samples:[["এলাকাবাসী","০১৭০০০০০০০০","মসজিদের সামনে আলো স্থাপনের অনুরোধ"]],steps:["অভিযোগ গ্রহণ","দায়িত্বপ্রাপ্তকে পাঠান","সমাধান ও জবাব"],description:"অভিযোগ গ্রহণ, দায়িত্ব বণ্টন এবং সমাধানের অবস্থা পর্যবেক্ষণ।",action:"অভিযোগ জমা দিন"},
 support:{fields:["উপকারভোগীর নাম","সহায়তার ধরন","আবেদনের বিবরণ"],samples:[["একটি অসচ্ছল পরিবার","মাসিক খাদ্য সহায়তা","যাচাইাধীন আবেদন"],["একজন প্রবীণ উপকারভোগী","জরুরি সহায়তা","অনুমোদিত নমুনা"]],steps:["আবেদন গ্রহণ","যোগ্যতা যাচাই","সহায়তা অনুমোদন ও বিতরণ"],description:"সহায়তার আবেদন, যোগ্যতা যাচাই এবং বিতরণের ধাপ।",action:"সহায়তার আবেদন নিন"},
 scholarship:{fields:["শিক্ষার্থীর নাম","শ্রেণি ও প্রতিষ্ঠান","আবেদনের বিবরণ"],samples:[["আয়েশা আক্তার","অষ্টম শ্রেণি · স্থানীয় বিদ্যালয়","যাচাইাধীন"],["মোঃ সাকিব","দশম শ্রেণি · স্থানীয় বিদ্যালয়","অনুমোদিত"]],steps:["শিক্ষার্থীর আবেদন","শিক্ষাগত তথ্য যাচাই","বৃত্তি অনুমোদন"],description:"শিক্ষার্থীর আবেদন, শ্রেণি/প্রতিষ্ঠান যাচাই এবং বৃত্তি অনুমোদনের নমুনা।",action:"বৃত্তির আবেদন নিন"},
 medical:{fields:["রোগীর নাম","চিকিৎসার প্রয়োজন","আবেদনের বিবরণ"],samples:[["রহিমা বেগম","চিকিৎসা ব্যয় সহায়তা","যাচাইাধীন"],["মোঃ জসিম","ওষুধ সহায়তা","অনুমোদিত"]],steps:["চিকিৎসা আবেদন","প্রয়োজনীয় কাগজ যাচাই","সহায়তা অনুমোদন"],description:"চিকিৎসা সহায়তার আবেদন, প্রয়োজন যাচাই এবং সহায়তা অনুমোদন।",action:"চিকিৎসা আবেদন নিন"},
 project:{fields:["প্রকল্পের নাম","অনুমোদিত বাজেট (৳)","অগ্রগতি (%)"],samples:[["শিক্ষা সহায়তা প্রকল্প","১৫০০০০","৬৫"],["শীতবস্ত্র বিতরণ","৮০০০০","৩০"]],steps:["প্রকল্প প্রস্তাব","বাজেট ও দায়িত্ব অনুমোদন","অগ্রগতি প্রতিবেদন"],description:"প্রকল্পের বাজেট, দায়িত্ব, অগ্রগতি এবং প্রতিবেদন পরিচালনা।",action:"প্রকল্প তৈরি করুন"},
 volunteer:{fields:["স্বেচ্ছাসেবকের নাম","দক্ষতা/এলাকা","মোবাইল নম্বর"],samples:[["মোঃ সাইফুল ইসলাম","রক্তদান · হাজীগঞ্জ","০১৭০০০০০০০০"],["ফারজানা আক্তার","শিক্ষা সহায়তা · চাঁদপুর","০১৮০০০০০০০০"]],steps:["স্বেচ্ছাসেবক নিবন্ধন","দক্ষতা যাচাই","কাজে দায়িত্ব বণ্টন"],description:"স্বেচ্ছাসেবক নিবন্ধন, দক্ষতা অনুযায়ী তালিকা এবং দায়িত্ব বণ্টন।",action:"স্বেচ্ছাসেবক যোগ করুন"},
 finance:{fields:["আয়/ব্যয়ের খাত","পরিমাণ (৳)","তারিখ"],samples:[["সাধারণ অনুদান","৫০০০","২০-১১-২০২৬"],["বিদ্যুৎ বিল","১৮০০","১৮-১১-২০২৬"]],steps:["লেনদেন লিখুন","ভাউচার যাচাই","হিসাব ও প্রতিবেদন"],description:"আয়-ব্যয়ের রেকর্ড, মোট হিসাব এবং আর্থিক প্রতিবেদন তৈরির নমুনা।",action:"লেনদেন যোগ করুন"},
 admin:{fields:["অ্যাডমিনের নাম","ভূমিকা","অনুমতির বিবরণ"],samples:[["প্রধান অ্যাডমিন","সুপার অ্যাডমিন","সব বিভাগ"],["কনটেন্ট সম্পাদক","সম্পাদক","কনটেন্ট সম্পাদনা"]],steps:["ব্যবহারকারী নির্বাচন","ভূমিকা ও অনুমতি দিন","কার্যক্রমের লগ পর্যালোচনা"],description:"অ্যাডমিনের ভূমিকা, বিভাগভিত্তিক অনুমতি এবং কার্যক্রম পর্যবেক্ষণ।",action:"ভূমিকা নির্ধারণ করুন"},
 profile:{fields:["শিরোনাম/নাম","বিস্তারিত তথ্য","দায়িত্বপ্রাপ্ত ব্যক্তি"],samples:[["প্রতিষ্ঠানের পরিচিতি","প্রতিষ্ঠানের পরিচয় ও কার্যক্রম","প্রশাসন"],["সেবা ও কার্যক্রম","বিস্তারিত তথ্য","প্রকাশিত"]],steps:["তথ্য প্রস্তুত","তথ্য যাচাই","ওয়েবসাইটে প্রকাশ"],description:"মডিউলের তথ্য তৈরি, পর্যালোচনা এবং ওয়েবসাইটে প্রকাশের নমুনা।",action:"তথ্য সংরক্ষণ করুন"}
};

function categoryFor(i:number):string {
 if([3,4,5].includes(i)) return "schedule";
 if(i===8) return "notice";
 if([9,17,23].includes(i)) return "event";
 if([6,7,20,21,32,41].includes(i)) return "people";
 if([10,11,12,49,50,51,52,53].includes(i)) return "gallery";
 if([13,15,16].includes(i)) return "article";
 if([18,19,34].includes(i)) return "registration";
 if(i===22) return "complaint";
 if(i===29) return "scholarship";
 if(i===30) return "medical";
 if([27,28,31,35,36,37,38,39,40,42].includes(i)) return "support";
 if(i===32) return "volunteer";
 if(i===33) return "project";
 if(i>=43&&i<=47) return "finance";
 if(i>=54&&i<=59) return "admin";
 return "profile";
}

const moduleDescriptions:Record<number,string> = {
 0:"ওয়েবসাইটের প্রধান তথ্য, গুরুত্বপূর্ণ ঘোষণা ও বিভাগগুলোর সারাংশ।",
 1:"প্রতিষ্ঠানের পরিচিতি, ঠিকানা, লক্ষ্য এবং পরিচিতিমূলক তথ্য।",
 2:"প্রতিষ্ঠার সময়রেখা, উল্লেখযোগ্য ঘটনা ও ঐতিহাসিক তথ্য।",
 3:"পাঁচ ওয়াক্তের সময় ও জামাতের সময় নির্ধারণ।",
 4:"প্রতিটি ওয়াক্তের আজানের সময় নির্ধারণ ও প্রকাশ।",
 5:"জুমার খুতবা ও জামাতের সময়সূচি প্রকাশ।",
 6:"ইমাম ও খতিবের পরিচিতি, দায়িত্ব ও যোগাযোগ তথ্য।",
 7:"কমিটির সদস্য, পদবি, মেয়াদ ও দায়িত্বের তালিকা।",
 8:"নতুন নোটিশ লেখা, খসড়া রাখা ও প্রকাশ।",
 9:"ধর্মীয় অনুষ্ঠান তৈরি, সময়-স্থান নির্ধারণ ও ক্যালেন্ডার।",
 10:"ছবি আপলোডের বিবরণ, অ্যালবাম ও ক্যাপশন।",
 11:"ভিডিও লিংক, শিরোনাম ও ভিডিও আর্কাইভ।",
 12:"জুমার খুতবার তারিখ, শিরোনাম ও আর্কাইভ।",
 13:"কুরআন ও হাদিসের বিষয়ভিত্তিক পাঠ্য সংগ্রহ।",
 14:"ঠিকানা, ফোন, যোগাযোগ ফরম ও মানচিত্রের তথ্য।",
 15:"ইসলামিক প্রবন্ধ লেখা, সম্পাদনা ও প্রকাশ।",
 16:"শিক্ষা কোর্স, পাঠ্যসূচি ও শিক্ষার্থীর তথ্য।",
 17:"অনুষ্ঠানে অংশগ্রহণের নিবন্ধন গ্রহণ ও যাচাই।",
 18:"ওয়েবসাইটের বিভিন্ন তথ্য খুঁজে বের করা।",
 19:"ইমেইল আপডেটের জন্য সম্মতিসহ সাবস্ক্রিপশন তালিকা।",
 20:"নতুন সদস্যের আবেদন ও যাচাই।",
 21:"সদস্যের পরিচিতি ও যোগাযোগের তথ্য পরিচালনা।",
 22:"অভিযোগ গ্রহণ, দায়িত্ব বণ্টন ও সমাধানের অবস্থা।",
 23:"অনুষ্ঠানগুলোর মাসিক/বার্ষিক ক্যালেন্ডার।",
 24:"ভিজিট, জনপ্রিয় পেজ ও ট্রাফিকের নমুনা পরিসংখ্যান।",
 25:"ফাউন্ডেশনের পরিচিতি, ঠিকানা ও কার্যক্রম।",
 26:"ফাউন্ডেশনের লক্ষ্য, উদ্দেশ্য ও নীতিমালা।",
 27:"দরিদ্র পরিবারের সহায়তার আবেদন ও যাচাই।",
 28:"এতিম শিশুদের তথ্য, প্রয়োজন ও সহায়তা।",
 29:"শিক্ষাবৃত্তির আবেদন, যোগ্যতা যাচাই ও অনুমোদন।",
 30:"চিকিৎসা সহায়তার আবেদন ও অনুমোদন।",
 31:"দুর্যোগে ত্রাণ আবেদন, বিতরণ তালিকা ও প্রতিবেদন।",
 32:"স্বেচ্ছাসেবক নিবন্ধন, দক্ষতা ও দায়িত্ব বণ্টন।",
 33:"ফাউন্ডেশন প্রকল্পের বাজেট, অগ্রগতি ও প্রতিবেদন।",
 34:"সহায়তার আবেদন গ্রহণ, যাচাই ও সিদ্ধান্ত।",
 35:"উপকারভোগীর প্রোফাইল, সহায়তার ইতিহাস ও অবস্থা।",
 36:"অনুদানের অঙ্গীকার, রসিদ ও ট্র্যাকিংয়ের নমুনা।",
 37:"যাকাত সহায়তার আবেদন ও বণ্টন রেকর্ড।",
 38:"সদকা সহায়তা ও বণ্টনের রেকর্ড।",
 39:"অনুমোদিত পেমেন্টের রেফারেন্স ও লেনদেন অবস্থা।",
 40:"প্রাপ্ত অর্থের ডিজিটাল রসিদের নমুনা।",
 41:"দাতার পরিচিতি ও অনুদানের ইতিহাস।",
 42:"প্রকল্প/খাত অনুযায়ী অনুদান ব্যবহারের অগ্রগতি।",
 43:"আয়ের খাত, রসিদ ও মোট আয়।",
 44:"ব্যয়ের খাত, ভাউচার ও মোট ব্যয়।",
 45:"খাতভিত্তিক বাজেট, বরাদ্দ ও অবশিষ্ট।",
 46:"ক্রয় অনুরোধ, সরবরাহকারী ও বিল যাচাই।",
 47:"বার্ষিক আয়-ব্যয় ও আর্থিক প্রতিবেদন।",
 48:"স্পনসর তথ্য, চুক্তি ও স্পনসরশিপ অবস্থা।",
 49:"YouTube চ্যানেল ও ভিডিও সংযোগের তথ্য।",
 50:"লাইভ সম্প্রচারের লিংক, সময় ও অবস্থা।",
 51:"প্রকাশিত ভিডিওর তালিকা ও আর্কাইভ।",
 52:"Shorts ভিডিওর লিংক, ক্যাপশন ও প্রকাশ।",
 53:"ভিডিওর খসড়া, অনুমোদন ও প্রকাশ নিয়ন্ত্রণ।",
 54:"একাধিক অ্যাডমিনের ড্যাশবোর্ড ও সারাংশ।",
 55:"ব্যবহারকারীর ভূমিকা ও অনুমতির তালিকা।",
 56:"কনটেন্ট যাচাই, অনুমোদন ও প্রকাশের ধাপ।",
 57:"অ্যাডমিনের কাজের তারিখ, ব্যবহারকারী ও পরিবর্তনের লগ।",
 58:"ডেটা ব্যাকআপের সময়, অবস্থা ও পুনরুদ্ধার অনুশীলন।",
 59:"বাংলা/ইংরেজি কনটেন্ট ও অনুবাদ প্রকাশের ব্যবস্থাপনা।"
};

function statusFor(i:number,idx:number):string {
 if(i===8||i===15||i===16||i===49||i===50||i===51||i===52||i===53) return idx===0?"প্রকাশিত":"খসড়া";
 if([18,19,20,22,27,28,29,30,31,34,35,36,37,38].includes(i)) return idx===0?"যাচাইাধীন":"অনুমোদিত";
 if(i>=43&&i<=47) return idx===0?"আয়":"ব্যয়";
 if(i===33||i===42) return idx===0?"চলমান":"পরিকল্পিত";
 return idx===0?"সক্রিয়":"নমুনা";
}

export default function ModuleShowcase({moduleName,moduleNumber,sourceIndex,packageName,packagePrice,owner}:Props) {
 const category=categoryFor(sourceIndex), config=categories[category]||categories.profile;
 const description=moduleDescriptions[sourceIndex]||config.description;
 const [rows,setRows]=useState<RecordRow[]>(()=>config.samples.map((values,idx)=>({id:idx+1,values,status:statusFor(sourceIndex,idx)})));
 const [values,setValues]=useState<string[]>(config.fields.map(()=> ""));
 const [query,setQuery]=useState("");
 const [notice,setNotice]=useState("");
 const [filter,setFilter]=useState("সব");
 const [selected,setSelected]=useState<number|null>(null);
 const [published,setPublished]=useState(false);
 const filtered=useMemo(()=>rows.filter(row=>(row.values.join(" ")+" "+row.status).toLowerCase().includes(query.toLowerCase())&&(filter==="সব"||row.status===filter)),[rows,query,filter]);
 const income=rows.filter(r=>r.status==="আয়").reduce((s,r)=>s+(Number(r.values[1])||0),0);
 const expense=rows.filter(r=>r.status==="ব্যয়").reduce((s,r)=>s+(Number(r.values[1])||0),0);
 const save=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(values.some(v=>!v.trim())){setNotice("সবগুলো প্রয়োজনীয় ঘর পূরণ করুন।");return;}
  const status=sourceIndex>=43&&sourceIndex<=47?(sourceIndex===43?"আয়":"ব্যয়"):([8,15,16,49,50,51,52,53].includes(sourceIndex)?"খসড়া":"যাচাইাধীন");
  setRows(old=>[{id:Date.now(),values:values.map(v=>v.trim()),status},...old]);
  setValues(config.fields.map(()=> ""));
  setNotice("নতুন নমুনা রেকর্ড তৈরি হয়েছে। এটি শুধু এই ডেমো সেশনে থাকবে।");
 };
 const updateStatus=(id:number,status:string)=>{setRows(old=>old.map(row=>row.id===id?{...row,status}:row));setNotice("নমুনা রেকর্ডের অবস্থা পরিবর্তন হয়েছে: "+status);};
 return <section className="module-workspace">
  <div className="module-workspace-head"><div><span className="module-kicker">PACKAGE {packageName.toUpperCase()} · DEMO PAGE {String(moduleNumber).padStart(2,"0")}</span><h2>{moduleName} — বাস্তব কাজের নমুনা</h2><p>{description} {owner} এই মডিউলে কাজ করবেন।</p></div><div className="module-package-pill">{packageName}<b>{packagePrice}</b></div></div>
  <div className="module-metrics">
   <article><small>মোট রেকর্ড</small><b>{rows.length}</b><span>ডেমো তথ্য</span></article>
   <article><small>তালিকায় ফলাফল</small><b>{filtered.length}</b><span>ফিল্টার অনুযায়ী</span></article>
   <article><small>{sourceIndex>=43&&sourceIndex<=47?"নিট নমুনা":"পেজ নম্বর"}</small><b>{sourceIndex>=43&&sourceIndex<=47?"৳"+(income-expense).toLocaleString("en-BD"):String(moduleNumber).padStart(2,"0")}</b><span>{sourceIndex>=43&&sourceIndex<=47?"আয় − ব্যয়":"মোট "+(packageName==="এন্টারপ্রাইজ প্রিমিয়াম"?"৬০":"প্যাকেজের")+" মডিউলের মধ্যে"}</span></article>
  </div>
  {sourceIndex>=43&&sourceIndex<=47&&<div className="module-finance-summary"><div><small>মোট আয়</small><b>৳{income.toLocaleString("en-BD")}</b></div><div><small>মোট ব্যয়</small><b>৳{expense.toLocaleString("en-BD")}</b></div><div><small>অবশিষ্ট</small><b>৳{(income-expense).toLocaleString("en-BD")}</b></div></div>}
  {sourceIndex===3||sourceIndex===4||sourceIndex===5?<div className="module-schedule-note"><b>সময় নির্ধারণের নিয়ম</b><p>সময় লিখে নতুন রেকর্ড যোগ করুন। প্রকাশের বোতাম চাপলে এই ডেমো সেশনে সময়সূচির অবস্থা প্রকাশিত হবে। প্রকৃত নামাজের সময় স্থানীয় কর্তৃপক্ষ যাচাই করে দিতে হবে।</p><button type="button" onClick={()=>{setPublished(true);setNotice("সময়সূচি ডেমোতে প্রকাশিত হয়েছে।")}}>সময়সূচি প্রকাশ করুন</button>{published&&<strong>প্রকাশিত · ডেমো</strong>}</div>:null}
  <div className="module-workspace-grid">
   <form className="module-entry-card" onSubmit={save}><div className="module-card-heading"><div><span>MODULE WORKFLOW</span><h3>{config.action}</h3></div><b>＋</b></div>
    {config.fields.map((field,i)=><label key={field}>{field}{field.includes("বিস্তারিত")||field.includes("বিবরণ")||field.includes("বিষয়বস্তু")||field.includes("আবেদনের")||field.includes("অভিযোগ")?<textarea required value={values[i]} onChange={e=>setValues(old=>old.map((v,j)=>j===i?e.target.value:v))} placeholder={field+" লিখুন"}/>:<input required value={values[i]} onChange={e=>setValues(old=>old.map((v,j)=>j===i?e.target.value:v))} placeholder={field+" লিখুন"}/>}</label>)}
    <button type="submit">{config.action} ↗</button>{notice&&<p className="module-feedback" role="status">{notice}</p>}<small>নমুনা ডেটা: যোগ/পরিবর্তন শুধু এই পেজের অস্থায়ী ডেমো সেশনে থাকে; Firebase-এ সংরক্ষিত নয়।</small>
   </form>
   <div className="module-record-card"><div className="module-card-heading"><div><span>RECORD MANAGEMENT</span><h3>রেকর্ড ও কার্যক্রম</h3></div><b>▤</b></div>
    <div className="module-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="নাম, তারিখ বা অবস্থা খুঁজুন..."/><span>⌕</span></div>
    <div className="module-filter-row">{["সব",...Array.from(new Set(rows.map(r=>r.status)))].map(s=><button type="button" className={filter===s?"active":""} key={s} onClick={()=>setFilter(s)}>{s}</button>)}</div>
    <div className="module-record-list">{filtered.map((row,index)=><article key={row.id}><div className="module-record-number">{String(index+1).padStart(2,"0")}</div><div className="module-record-content"><b>{row.values[0]}</b><p>{row.values.slice(1).join(" · ")}</p><span>{row.status}</span></div><div className="module-row-actions"><button type="button" onClick={()=>{setSelected(row.id);setNotice("বিস্তারিত: "+row.values.join(" | ")+" · অবস্থা: "+row.status);}}>বিস্তারিত</button>{["যাচাইাধীন","খসড়া","পরিকল্পিত"].includes(row.status)&&<button type="button" onClick={()=>updateStatus(row.id,"অনুমোদিত")}>অনুমোদন</button>}{row.status==="খসড়া"&&<button type="button" onClick={()=>updateStatus(row.id,"প্রকাশিত")}>প্রকাশ</button>}</div></article>)}
    {!filtered.length&&<p className="module-empty">এই অনুসন্ধানে কোনো রেকর্ড পাওয়া যায়নি।</p>}</div>
    <div className="module-record-footer">দেখানো হয়েছে {filtered.length}টি রেকর্ড <span>ডেমো পরিবেশ</span></div>
   </div>
  </div>
  {selected!==null&&<div className="module-selected-detail"><b>নির্বাচিত রেকর্ডের বিস্তারিত</b><p>{rows.find(r=>r.id===selected)?.values.join(" · ")}</p><button type="button" onClick={()=>setSelected(null)}>বন্ধ করুন</button></div>}
  <div className="module-workflow"><b>{moduleName} — কাজের ধাপ</b><div>{config.steps.map((step,i)=><span key={step}>{String(i+1).padStart(2,"0")} · {step}</span>)}</div></div>
 </section>;
}
