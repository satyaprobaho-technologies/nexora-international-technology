import Link from "next/link";
import DemoCatalog from "@/components/DemoCatalog";

export const metadata = {
  title: "50 Website Demo Templates | NEXORA INTERNATIONAL TECHNOLOGY",
  description: "Explore all 50 NEXORA website design demos and open a complete preview for each business category.",
};

const catalogImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
];

export default function DemosPage() {
  return (
    <main>
      <header className="nav">
        <Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/portal">Client Portal</Link>
          <a href="#all-demos">All 50 demos</a>
        </nav>
      </header>
      <section className="section" style={{background:"#103c2d",color:"#fff"}}><div className="section-head"><div><p className="eyebrow">SPECIAL MOSQUE PROJECT</p><h2>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</h2></div><p className="section-intro">চারটি প্যাকেজের আলাদা বাংলা লাইভ ডেমো দেখুন—৳৭০,০০০ থেকে ৳২,২০,০০০ পর্যন্ত।</p></div><Link className="button" href="/demos/shayla-akram">চারটি মসজিদ ডেমো দেখুন ↗</Link></section>\n      <section className="section mosque-featured-section">
        <div className="mosque-featured-card">
          <div className="mosque-featured-image">
            <img src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=85" alt="শায়লা আকরাম কেন্দ্রীয় জামে মসজিদের স্থাপত্যধর্মী ডেমো ছবি" />
            <span>FEATURED SOFTWARE · MOBILE RESPONSIVE</span>
            <strong>৳ ২,২০,০০০ · PACKAGE 04</strong>
          </div>
          <div className="mosque-featured-content">
            <div className="mosque-featured-kicker">NEXORA · ISLAMIC INSTITUTION MANAGEMENT</div>
            <h2>শায়লা আকরাম কেন্দ্রীয় জামে মসজিদ</h2>
            <h3>মসজিদ, ফাউন্ডেশন ও প্রশাসনিক ব্যবস্থাপনার সমন্বিত লাইভ ডেমো</h3>
            <p>মোবাইল ও কম্পিউটার উপযোগী পূর্ণাঙ্গ মসজিদ ওয়েবসাইট ডেমো। মসজিদের ওয়েবসাইট ও ধর্মীয় কার্যক্রম, ফাউন্ডেশনের মানবসেবা, আলাদা Accounts বিভাগ এবং দায়িত্বভিত্তিক Admin Control Center—মোট ৬০টি মডিউলের নমুনা দেখুন।</p>
            <div className="mosque-featured-tags">
              <span>মসজিদ · ৩১ মডিউল</span><span>ফাউন্ডেশন · ১৮</span><span>Accounts · ৫</span><span>Admin · ৬</span><span>বাংলা ও English</span><span>Mobile Responsive</span>
            </div>
            <div className="mosque-featured-actions">
              <Link className="button" href="/demos/shayla-akram-4">Open Mosque live demo ↗</Link>
              <Link href="/demos/shayla-akram-4/accounts">Accounts demo ↗</Link>
              <Link href="/demos/shayla-akram-4/admin">Admin demo ↗</Link>
              <Link href="/portal?demo=shayla-akram-4">Buy Now ↗</Link>
            </div>
          </div>
        </div>
      </section>
      <section id="all-demos" className="section templates-section">
        <DemoCatalog showHeading />
        <div className="hosting-note">
          <div><p className="eyebrow">READY TO BUILD?</p><h2>Make this design yours.</h2><p>Sign in to the customer portal and submit a project request for your selected demo.</p></div>
          <Link className="button" href="/portal">Request a website ↗</Link>
        </div>
      </section>
      <footer><Link className="brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><p>Your Digital World Starts Here.</p><Link href="/portal">Client Portal</Link><Link href="/">Back to website</Link></footer>
    </main>
  );
}
