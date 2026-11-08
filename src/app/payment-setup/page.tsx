import Link from "next/link";

const providers = [
  { name: "aamarPay", role: "Recommended first application", detail: "Its published materials list domestic and international cards, major wallets including bKash and Nagad, supported foreign-currency display/conversion and BDT settlement. Confirm eligibility, exact supported currencies, international-card acceptance, fees and settlement terms in writing before signing.", register: "https://registration.aamarpay.com/", info: "https://www.aamarpay.com/index.php/payment-solutions/payment-gateway", docs: "https://aamarpay.com/faq" },
  { name: "SSLCOMMERZ", role: "Alternative / existing code adapter", detail: "Its official site advertises international payments. NEXORA has a server-side SSLCOMMERZ checkout adapter in the codebase, but it is disabled until approved merchant credentials and a successful sandbox test are configured.", register: "https://sslcommerz.com/", info: "https://sslcommerz.com/payment-gateway/", docs: "https://merchant.sslcommerz.com/" },
];

export default function PaymentSetupPage() {
  return <main className="portal-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><div><Link href="/">Home</Link> · <Link href="/pricing">Pricing</Link> · <Link href="/portal">Client Portal</Link></div></div>
    <section className="portal-panel">
      <p className="portal-kicker">MERCHANT ONBOARDING</p>
      <h1>Payment gateway setup checklist</h1>
      <p className="portal-muted">NEXORA intends to accept international Visa/Mastercard and local mobile-wallet payments. Payment collection remains disabled until the business identity, bank settlement account and provider approval are complete.</p>
      <h2>1. Complete the business foundation first</h2>
      <ol className="payment-setup-list">
        <li><b>Choose the legal business structure.</b> Confirm whether NEXORA will operate as a sole proprietorship, partnership or private limited company. Use the exact registered legal name in every application.</li>
        <li><b>Obtain the trade licence.</b> Apply through the relevant City Corporation, municipality or Union Parishad for the business address. The activity description should accurately cover IT/digital services.</li>
        <li><b>Obtain the owner's / entity's e-TIN.</b> Keep the certificate and identity details consistent with the trade licence and bank documents.</li>
        <li><b>Open a business bank account.</b> Ask the bank for an account in the same legal business name and a bank statement or cheque leaf for merchant verification and settlement.</li>
        <li><b>Prepare the public website.</b> Publish accurate Contact, About, Terms, Privacy, Refund/Cancellation, Service Delivery and pricing/quotation information. Do not advertise payment methods as active before approval.</li>
      </ol>
      <h2>2. Documents to prepare</h2>
      <ul className="payment-setup-list">
        <li>Trade licence (current and valid)</li><li>e-TIN certificate</li><li>Owner / authorised signatory NID and photograph</li><li>Business bank account proof, cheque leaf or statement</li><li>Certificate of incorporation and Memorandum/Articles, if a company</li><li>Partnership deed, if a partnership</li><li>Website URL, business email, phone, office address and hosting/server information</li><li>Provider application form and any additional bank/KYC documents they request</li>
      </ul>
      <p className="portal-muted">The provider's exact document list depends on the legal structure and underwriting review. Do not upload a document that does not apply to your entity; ask the provider what substitutes are accepted.</p>
      <h2>3. Apply to payment providers</h2>
      <div className="payment-setup-provider-grid">{providers.map(p=><article className="payment-card" key={p.name}><span className="payment-state">{p.role}</span><h3>{p.name}</h3><p>{p.detail}</p><p><a href={p.register} target="_blank" rel="noreferrer">Open application / provider website ↗</a></p><p><a href={p.info} target="_blank" rel="noreferrer">Payment features ↗</a> · <a href={p.docs} target="_blank" rel="noreferrer">Requirements / help ↗</a></p></article>)}</div>
      <h2>4. Ask these questions before accepting a merchant offer</h2>
      <ul className="payment-setup-list"><li>Are international-issued Visa and Mastercard enabled for a Bangladesh-registered IT services business?</li><li>Which customer billing currencies are supported, and in which currency will settlement reach the business bank account?</li><li>What are the setup fee, transaction fee, refund fee, chargeback fee, reserve/hold policy and settlement cycle?</li><li>Are bKash, Nagad and Rocket included in the same merchant account, or do they require separate approval?</li><li>Can the provider supply sandbox Store ID/API credentials and current integration documentation?</li></ul>
      <h2>5. NEXORA integration status</h2>
      <ul className="payment-setup-list"><li>SSLCOMMERZ server-side hosted-checkout adapter: code exists, but payment initiation is disabled by default.</li><li>Live merchant credentials: not available yet.</li><li>aamarPay adapter: waiting for merchant approval, API credentials and the provider's current technical documentation.</li><li>bKash / Nagad direct APIs: not being activated without separate merchant approval and official credentials.</li><li>Live card collection: not enabled. Never enter card details into NEXORA forms or send credentials in chat/GitHub.</li></ul>
      <div className="free-starter-info"><span>SECURITY RULE</span><p>After approval, add credentials only as encrypted Vercel Environment Variables. Keep secrets out of source code, screenshots, email forwards and public GitHub commits. First run sandbox transactions, refund/failed-payment tests and provider-side validation; switch to live only after verification.</p></div>
      <p className="payment-disclaimer">Important: a gateway accepting international cards does not automatically mean every foreign currency, card type, service category or country is enabled. Obtain written confirmation from the provider.</p>
      <p><Link className="portal-button" href="/portal">Open NEXORA Customer Portal</Link></p>
    </section>
    <p className="portal-foot">NEXORA INTERNATIONAL TECHNOLOGY · Merchant onboarding guide</p>
  </main>;
}
