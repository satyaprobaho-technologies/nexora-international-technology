import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

type SubscribeInput = {
  name?: string;
  email?: string;
  consent?: boolean;
  companyWebsite?: string;
};

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SubscribeInput;
    // Quietly accept bot honeypot submissions without storing or sending anything.
    if (String(body.companyWebsite || "").trim()) return Response.json({ message: "ধন্যবাদ! আপনার অনুরোধ গ্রহণ করা হয়েছে।" });
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim().slice(0, 100);
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254) {
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

    const docId = email.replaceAll("/", "_");
    const contactRef = adminDb.collection("marketingContacts").doc(docId);
    const existing = await contactRef.get();
    if (existing.exists && existing.data()?.consent === true && existing.data()?.status === "active") {
      return Response.json({ message: "এই ইমেইলটি ইতিমধ্যে সাবস্ক্রাইব করা আছে।" });
    }

    let brevoSyncStatus = "not_configured";
    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_INDIVIDUAL_LIST_ID);
    if (apiKey && Number.isSafeInteger(listId) && listId > 0) {
      const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          attributes: name ? { FIRSTNAME: name } : {},
          listIds: [listId],
          updateEnabled: true,
        }),
      });
      brevoSyncStatus = brevoResponse.ok ? "synced" : "failed";
    }

    await contactRef.set({
      email,
      name,
      segment: "individual",
      consent: true,
      consentSource: "NEXORA website newsletter signup",
      consentedAt: FieldValue.serverTimestamp(),
      consentVersion: "newsletter-v1",
      marketingEligible: true,
      status: "active",
      brevoSyncStatus,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: existing.exists ? existing.data()?.createdAt || FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
    }, { merge: true });

    return Response.json({
      message: brevoSyncStatus === "synced"
        ? "ধন্যবাদ! আপনার সাবস্ক্রিপশন সংরক্ষিত হয়েছে।"
        : "ধন্যবাদ! আপনার সম্মতি সংরক্ষিত হয়েছে। ইমেইল তালিকার সংযোগ সম্পন্ন হলে সিঙ্ক হবে।",
      brevoSyncStatus,
    }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return jsonError("এই মুহূর্তে সাবস্ক্রিপশন নেওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।", 500);
  }
}
