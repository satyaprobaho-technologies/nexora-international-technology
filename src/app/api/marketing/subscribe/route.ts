import { createHash, randomBytes } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

type SubscribeInput = {
  name?: string;
  email?: string;
  consent?: boolean;
};

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

async function sendConfirmationEmail(email: string, name: string, confirmUrl: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("Brevo email sending is not configured");

  // This sender is verified and active in the connected NEXORA Brevo account.
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "computer26training@gmail.com";
  const greeting = name ? `Hello ${name.replace(/[<>&"]/g, "")},` : "Hello,";
  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#172033;line-height:1.6">
      <h2>Confirm your NEXORA updates subscription</h2>
      <p>${greeting}</p>
      <p>Someone entered this email address on the NEXORA INTERNATIONAL TECHNOLOGY website and requested product and service updates.</p>
      <p>Please confirm that you own this email address and want to receive these updates:</p>
      <p><a href="${confirmUrl}" style="display:inline-block;background:#087ac1;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Confirm my subscription</a></p>
      <p>If you did not make this request, you can ignore this email. You will not be added to the marketing list.</p>
      <p style="font-size:12px;color:#64748b">NEXORA INTERNATIONAL TECHNOLOGY</p>
    </div>`;
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "NEXORA INTERNATIONAL TECHNOLOGY", email: senderEmail },
      to: [{ email, ...(name ? { name } : {}) }],
      subject: "Confirm your NEXORA updates subscription",
      htmlContent,
      textContent: `Please confirm your NEXORA updates subscription: ${confirmUrl}\n\nIf you did not request this, ignore this email.`,
      replyTo: { email: senderEmail, name: "NEXORA INTERNATIONAL TECHNOLOGY" },
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Brevo confirmation email failed", response.status, detail.slice(0, 500));
    throw new Error("Confirmation email could not be sent");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SubscribeInput;
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim().slice(0, 100);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return jsonError("সঠিক ইমেইল ঠিকানা লিখুন।");
    }
    if (body.consent !== true) return jsonError("সাবস্ক্রাইব করতে সম্মতির ঘরটি নির্বাচন করুন।");

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip") || "unknown";
    const rateKey = createHash("sha256").update(ip).digest("hex");
    const rateRef = adminDb.collection("newsletterRateLimits").doc(rateKey);
    const now = Date.now();
    const allowed = await adminDb.runTransaction(async (tx) => {
      const snapshot = await tx.get(rateRef);
      const previous = snapshot.exists ? snapshot.data() : undefined;
      const windowStart = Number(previous?.windowStart || 0);
      const count = windowStart > now - 60 * 60 * 1000 ? Number(previous?.count || 0) : 0;
      if (count >= 5) return false;
      tx.set(rateRef, { windowStart: count ? windowStart : now, count: count + 1, updatedAt: FieldValue.serverTimestamp() });
      return true;
    });
    if (!allowed) return jsonError("অনেকবার চেষ্টা করা হয়েছে। এক ঘণ্টা পরে আবার চেষ্টা করুন।", 429);

    const contactId = email.replaceAll("/", "_");
    const contactRef = adminDb.collection("marketingContacts").doc(contactId);
    const newsletterRef = adminDb.collection("newsletterSignups").doc(contactId);
    const existing = await contactRef.get();
    if (existing.exists && existing.data()?.consentVersion === "newsletter-v2-double-opt-in" && existing.data()?.consent === true && existing.data()?.status === "active") {
      return Response.json({ message: "এই ইমেইলটি ইতিমধ্যে নিশ্চিত করা আছে।" });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const tokenRef = adminDb.collection("newsletterConfirmations").doc(tokenHash);
    const expiresAt = Timestamp.fromDate(new Date(now + 24 * 60 * 60 * 1000));

    await adminDb.runTransaction(async (tx) => {
      tx.set(contactRef, {
        email,
        name,
        segment: "individual",
        consent: true,
        consentSource: "NEXORA website newsletter signup",
        consentedAt: FieldValue.serverTimestamp(),
        consentVersion: "newsletter-v2-double-opt-in",
        marketingEligible: false,
        status: "pending_confirmation",
        brevoSyncStatus: "pending_confirmation",
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existing.exists ? existing.data()?.createdAt || FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
      }, { merge: true });
      tx.set(newsletterRef, {
        email, name, consent: true,
        consentSource: "NEXORA website newsletter signup",
        consentVersion: "newsletter-v2-double-opt-in",
        status: "pending_confirmation", marketingEligible: false,
        brevoSyncStatus: "pending_confirmation", expiresAt,
        createdAt: existing.exists ? existing.data()?.createdAt || FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      tx.set(tokenRef, { email, expiresAt, createdAt: FieldValue.serverTimestamp() });
    });

    const confirmUrl = new URL(`/api/marketing/confirm?token=${token}`, request.url).toString();
    try {
      await sendConfirmationEmail(email, name, confirmUrl);
    } catch {
      await adminDb.runTransaction(async (tx) => {
        tx.delete(tokenRef);
        tx.set(newsletterRef, {
          status: "confirmation_email_failed",
          marketingEligible: false,
          brevoSyncStatus: "confirmation_email_failed",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        tx.set(contactRef, {
          status: "confirmation_email_failed",
          marketingEligible: false,
          brevoSyncStatus: "confirmation_email_failed",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      });
      return jsonError("নিশ্চিতকরণ ইমেইল পাঠানো যায়নি। পরে আবার চেষ্টা করুন।", 502);
    }

    return Response.json({
      message: "আপনার ইমেইলে একটি নিশ্চিতকরণ লিংক পাঠানো হয়েছে। ২৪ ঘণ্টার মধ্যে লিংকে ক্লিক করলে সাবস্ক্রিপশন সম্পন্ন হবে।",
      status: "pending_confirmation",
    }, { status: 202 });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return jsonError("এই মুহূর্তে সাবস্ক্রিপশন নেওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।", 500);
  }
}
