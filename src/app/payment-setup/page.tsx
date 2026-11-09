import Link from "next/link";

export default function PaymentSetupPage() {
  return <main className="portal-shell">
    <div className="portal-top"><Link className="portal-brand" href="/">NEXORA <small>INTERNATIONAL TECHNOLOGY</small></Link><div><Link href="/">Home</Link> · <Link href="/pricing">Pricing</Link> · <Link href="/portal">Client Portal</Link></div></div>
    <section className="portal-panel">
      <p className="portal-kicker">LOCAL MERCHANT ONBOARDING</p>
      <h1>Payment setup checklist</h1>
      <p className="portal-muted">NEXORA does not accept Visa, Mastercard, credit cards or debit cards. Local bKash, Nagad, Rocket and bank-transfer collection are not active yet. They may be enabled only after business/merchant verification and secure transaction checks.</p>
      <h2>1. Prepare the business documents</h2>
      <ul className="payment-setup-list">
        <li>Valid trade licence for the actual business entity</li>
        <li>e-TIN and owner/authorised signatory identity documents</li>
        <li>Business bank account proof in the matching legal name</li>
        <li>Business address, phone number and support email</li>
        <li>Accurate website pricing, terms, privacy and refund/cancellation policy</li>
      </ul>
      <h2>2. Apply for approved local collection facilities</h2>
      <ul className="payment-setup-list">
        <li><b>bKash:</b> apply for a merchant facility or an eligible Personal Retail Account (PRA). An ordinary personal account must not be used for business collections.</li>
        <li><b>Nagad:</b> request an approved merchant/business collection account and confirm its requirements directly with Nagad.</li>
        <li><b>Rocket:</b> request an approved business collection arrangement through Dutch-Bangla Bank or its authorised channel.</li>
        <li><b>Bank transfer:</b> use only a verified business bank account and issue an official invoice with a unique reference.</li>
      </ul>
      <h2>3. NEXORA payment status</h2>
      <ul className="payment-setup-list">
        <li>Visa, Mastercard and all credit/debit card payments: <b>disabled and not accepted.</b></li>
        <li>SSLCOMMERZ hosted checkout: <b>blocked</b>; card-capable gateway checkout cannot be initiated from the site.</li>
        <li>bKash, Nagad and Rocket: pending merchant approval; no business number is configured.</li>
        <li>Bank transfer: pending verified business bank details.</li>
        <li>Live online collection: <b>not active.</b> No payment should be sent until an official invoice and approved payment instructions are issued.</li>
      </ul>
      <div className="free-starter-info"><span>SECURITY NOTICE</span><p>Never send card numbers, CVV, wallet PIN, OTP, passwords or gateway secrets through NEXORA forms, email or chat. NEXORA staff will never ask customers for these details. Payment status must be marked paid only after the transaction is independently verified with the provider or bank.</p></div>
      <p><Link className="portal-button" href="/portal">Open NEXORA Customer Portal</Link></p>
    </section>
    <p className="portal-foot">NEXORA INTERNATIONAL TECHNOLOGY · Local payment onboarding</p>
  </main>;
}
