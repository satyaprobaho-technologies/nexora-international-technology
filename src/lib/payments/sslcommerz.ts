import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-international-technology.vercel.app";

function credentials() {
  if (process.env.PAYMENTS_ENABLED !== "true") throw new Error("Online payments are disabled until merchant onboarding is complete");
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword) throw new Error("SSLCOMMERZ live/sandbox credentials are not configured");
  return { storeId, storePassword, sandbox: process.env.SSLCOMMERZ_MODE !== "live" };
}

export async function initiateSslcommerz(input: {
  projectId: string; uid: string; email: string; name: string; phone: string; address: string;
}) {
  const { storeId, storePassword, sandbox } = credentials();
  const projectRef = adminDb.collection("projects").doc(input.projectId);
  const projectSnap = await projectRef.get();
  if (!projectSnap.exists) throw new Error("Project not found");
  const project = projectSnap.data()!;
  if (project.ownerUid !== input.uid) throw new Error("You do not own this project");
  if (project.paymentStatus !== "awaiting_payment") throw new Error("This project is not approved for payment yet");
  const amount = Number(project.quoteAmount);
  const currency = String(project.quoteCurrency || "USD").toUpperCase();
  if (!Number.isFinite(amount) || amount <= 0 || !/^[A-Z]{3}$/.test(currency)) throw new Error("A valid approved quotation is required");
  // Bangladesh SSLCOMMERZ checkout must use the merchant-approved settlement currency.
  // Until a provider explicitly confirms another currency in writing, only BDT quotations may be charged.
  if (currency !== "BDT") throw new Error("For this gateway, the approved invoice must be issued in BDT. Please ask NEXORA to reissue the quotation in BDT.");

  const approvals = await adminDb.collection("quoteApprovals")
    .where("projectId", "==", input.projectId).where("ownerUid", "==", input.uid)
    .where("status", "==", "customer_accepted").limit(1).get();
  if (approvals.empty) throw new Error("Customer acceptance of the quotation is required");

  const paymentRef = adminDb.collection("payments").doc();
  const tranId = `NX-${paymentRef.id.replace(/-/g, "").slice(0, 24)}`;
  await paymentRef.set({
    projectId: input.projectId, ownerUid: input.uid, customerEmail: input.email,
    provider: "sslcommerz", tranId, amount, currency, status: "initiated",
    createdAt: FieldValue.serverTimestamp()
  });

  const params = new URLSearchParams({
    store_id: storeId, store_passwd: storePassword, total_amount: amount.toFixed(2),
    currency, tran_id: tranId, product_category: "software-services",
    success_url: `${siteUrl}/api/payments/sslcommerz/callback`,
    fail_url: `${siteUrl}/api/payments/sslcommerz/callback`,
    cancel_url: `${siteUrl}/api/payments/sslcommerz/callback`,
    ipn_url: `${siteUrl}/api/payments/sslcommerz/ipn`,
    cus_name: input.name.slice(0, 50), cus_email: input.email.slice(0, 50),
    cus_add1: input.address.slice(0, 50), cus_city: "Dhaka", cus_postcode: "1000",
    cus_country: "Bangladesh", cus_phone: input.phone.slice(0, 20),
    shipping_method: "NO", num_of_item: "1", product_name: "NEXORA approved software project",
    product_profile: "non-physical-goods", value_a: paymentRef.id
  });
  const base = sandbox ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";
  const response = await fetch(`${base}/gwprocess/v4/api.php`, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: params
  });
  const result = await response.json() as { status?: string; GatewayPageURL?: string; redirectGatewayURL?: string; failedreason?: string };
  const gatewayUrl = result.GatewayPageURL || result.redirectGatewayURL;
  if (!response.ok || result.status !== "SUCCESS" || !gatewayUrl || !/^https:\/\//.test(gatewayUrl)) {
    await paymentRef.update({ status: "initiation_failed", providerMessage: result.failedreason || "Gateway session creation failed" });
    throw new Error("Payment session could not be created. Please contact NEXORA support.");
  }
  await paymentRef.update({ status: "pending", gatewaySessionCreatedAt: FieldValue.serverTimestamp() });
  return { paymentUrl: gatewayUrl, paymentId: paymentRef.id };
}

export async function validateAndRecordSslcommerz(form: URLSearchParams) {
  const { storeId, storePassword, sandbox } = credentials();
  const valId = form.get("val_id");
  const tranId = form.get("tran_id");
  const paymentId = form.get("value_a");
  if (!valId || !tranId || !paymentId) throw new Error("Missing gateway transaction reference");
  const paymentRef = adminDb.collection("payments").doc(paymentId);
  const paymentSnap = await paymentRef.get();
  if (!paymentSnap.exists) throw new Error("Payment record not found");
  const payment = paymentSnap.data()!;
  if (payment.provider !== "sslcommerz" || payment.tranId !== tranId) throw new Error("Transaction reference mismatch");
  if (payment.status === "paid") return { status: "paid", projectId: payment.projectId };

  const base = sandbox ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";
  const validationUrl = new URL(`${base}/validator/api/validationserverAPI.php`);
  validationUrl.searchParams.set("val_id", valId);
  validationUrl.searchParams.set("store_id", storeId);
  validationUrl.searchParams.set("store_passwd", storePassword);
  validationUrl.searchParams.set("format", "json");
  const response = await fetch(validationUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not validate transaction with payment provider");
  const verified = await response.json() as { status?: string; tran_id?: string; amount?: string; currency?: string; risk_level?: string };
  const valid = ["VALID", "VALIDATED"].includes(String(verified.status).toUpperCase())
    && verified.tran_id === payment.tranId
    && Number(verified.amount) === Number(payment.amount)
    && String(verified.currency).toUpperCase() === String(payment.currency).toUpperCase();
  if (!valid) {
    await paymentRef.update({ status: "verification_failed", verificationStatus: verified.status || "unknown" });
    throw new Error("Payment verification failed");
  }
  if (String(verified.risk_level) === "1") {
    await paymentRef.update({ status: "risk_review", verifiedAt: FieldValue.serverTimestamp() });
    return { status: "risk_review", projectId: payment.projectId };
  }

  await adminDb.runTransaction(async (tx) => {
    const fresh = await tx.get(paymentRef);
    if (fresh.data()?.status === "paid") return;
    tx.update(paymentRef, { status: "paid", valId, verifiedAt: FieldValue.serverTimestamp() });
    tx.update(adminDb.collection("projects").doc(payment.projectId), {
      paymentStatus: "paid", paidAt: FieldValue.serverTimestamp(), paidVia: "sslcommerz"
    });
  });
  return { status: "paid", projectId: payment.projectId };
}
