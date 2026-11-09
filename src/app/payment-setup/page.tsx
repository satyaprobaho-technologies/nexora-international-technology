import Link from "next/link";

const providers = [
  { name: "aamarPay", role: "Recommended first application", detail: "Ask whether the provider supports merchant-authorised local wallet collections only (bKash/Nagad), without enabling card payments. Confirm eligibility, fees and settlement terms in writing before signing.", register: "https://registration.aamarpay.com/", info: "https://www.aamarpay.com/index.php/payment-solutions/payment-gateway", docs: "https://aamarpay.com/faq" },
  { name: "SSLCOMMERZ", role: "Alternative / existing code adapter", detail: "NEXORA's existing SSLCOMMERZ card-capable checkout endpoint is intentionally blocked. Do not enable or configure it for card collection.", register: "https://sslcommerz.com/", info: "https://sslcommerz.com/payment-gateway/", docs: "https://merchant.sslcommerz.com/" },
];

export default function PaymentSetupPage() {
  return <main className="portal-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><div><Link href="/">Home</Link> · <Link href="/pricing">Pricing</Link> · <Link href="/portal">Client Portal</Link></div></div>
    <section className="portal-panel">
      <p className="portal-kicker">MERCHANT ONBOARDING</p>
      <h1>Payment gateway setup checklist</h1>
      <p className="portal-muted">NEXORA does not accept Visa, Mastercard or any credit/debit card payments. Local bKash, Nagad, Rocket or bank-transfer collection is also disabled until the business identity, merchant approval and settlement verification are complete.</p>
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
      <h2>3. Personal accounts and permitted collection options</h2>
      <p className="portal-muted"><b>Do not publish or use an ordinary personal bKash account for NEXORA business collections.</b> bKash's published app terms say the app is for personal use and business-related financial transactions are prohibited. bKash separately offers a Personal Retail Account (PRA) for eligible small businesses; it is a different account product, cannot be converted from an existing personal bKash account, and requires a mobile number not previously registered with bKash. Confirm current eligibility and required proof of profession directly with bKash before applying. Your existing personal bKash number therefore must not be treated as a ready merchant number.</p>
      <p className="portal-muted">For Nagad and Rocket, use a provider-approved merchant/business collection facility or gateway integration only after the provider confirms the account type and terms. Do not publish personal account numbers as business payment destinations. Manual payment, if later approved, must be matched against the provider's official transaction confirmation and marked paid by an authorised administrator—not merely by a customer screenshot.</p>
      <h2>4. Local payment onboarding only</h2>
      <div className="payment-setup-provider-grid">{providers.map(p=><article className="payment-card" key={p.name}><span className="payment-state">{p.role}</span><h3>{p.name}</h3><p>{p.detail}</p><p><a href={p.register} target="_blank" rel="noreferrer">Open application / provider website ↗</a></p><p><a href={p.info} target="_blank" rel="noreferrer">Payment features ↗</a> · <a href={p.docs} target="_blank" rel="noreferrer">Requirements / help ↗</a></p></article>)}</div>
      <h2>5. Confirm local-only merchant terms</h2>
      <ul className="payment-setup-list"><li>Can this merchant facility be configured for local mobile wallets only, with all card methods disabled?</li><li>Are bKash, Nagad and Rocket supported for the approved business category and which business bank account receives settlement?</li><li>What are the setup fee, transaction fee, refund fee, chargeback fee, reserve/hold policy and settlement cycle?</li><li>What are the transaction fees, refund rules, chargeback rules and settlement cycle for each local wallet?</li><li>Can the provider supply sandbox Store ID/API credentials and current integration documentation?</li></ul>
      <h2>6. NEXORA integration status</h2>
      <ul className="payment-setup-list"><li>SSLCOMMERZ card-capable hosted checkout: intentionally blocked; card payment must remain disabled.</li><li>Live merchant credentials: not available yet.</li><li>aamarPay adapter: waiting for merchant approval, API credentials and the provider's current technical documentation.</li><li>bKash: ordinary personal account is not approved for business collection; eligible Personal Retail Account or merchant/gateway onboarding must be confirmed separately.</li><li>Nagad / Rocket: merchant/business collection approval and official integration details are still required.</li><li>Live local wallet and bank collection: not enabled. No personal wallet number is configured. Card payments are not accepted. Never enter card details, wallet PINs or OTPs into NEXORA forms or send credentials in chat/GitHub.</li></ul>
      <div className="free-starter-info"><span>SECURITY RULE</span><p>After approval, add credentials only as encrypted Vercel Environment Variables. Keep secrets out of source code, screenshots, email forwards and public GitHub commits. First run sandbox transactions, refund/failed-payment tests and provider-side validation; switch to live only after verification.</p></div>
      <p className="payment-disclaimer">Important: a gateway accepting international cards does not automatically mean every foreign currency, card type, service category or country is enabled. Obtain written confirmation from the provider.</p>
      <p><Link className="portal-button" href="/portal">Open NEXORA Customer Portal</Link></p>
    </section>
    <p className="portal-foot">NEXORA INTERNATIONAL TECHNOLOGY · Merchant onboarding guide</p>
  </main>;
}
