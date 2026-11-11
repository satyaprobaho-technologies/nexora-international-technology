import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

type ContactInput = {
  email?: string;
  name?: string;
  segment?: "business" | "individual";
  consent?: boolean;
  consentSource?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { contacts?: ContactInput[] };
    if (!Array.isArray(body.contacts) || body.contacts.length < 1) {
      return jsonError(new Error("কমপক্ষে একটি যোগাযোগ দিন।"));
    }
    if (body.contacts.length > 400) {
      return jsonError(new Error("একটি ব্যাচে সর্বোচ্চ ৪০০টি ইমেইল দিন।"));
    }

    const source = String(body.contacts[0]?.consentSource || "").trim().slice(0, 300);
    if (!source || body.contacts.some((item) => item.consent !== true || String(item.consentSource || "").trim() !== source)) {
      return jsonError(new Error("সব ঠিকানার জন্য স্পষ্ট মার্কেটিং সম্মতি ও সম্মতির উৎস আবশ্যক।"));
    }

    const candidates: Array<{
      id: string;
      email: string;
      name: string;
      segment: "business" | "individual";
      ref: FirebaseFirestore.DocumentReference;
    }> = [];
    const seen = new Set<string>();
    let invalid = 0;
    for (const item of body.contacts) {
      const email = String(item.email || "").trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254 || seen.has(email)) {
        invalid++;
        continue;
      }
      seen.add(email);
      const id = email.replaceAll("/", "_");
      candidates.push({
        id, email,
        name: String(item.name || "").trim().slice(0, 120),
        segment: item.segment === "business" ? "business" : "individual",
        ref: adminDb.collection("marketingContacts").doc(id)
      });
    }

    if (!candidates.length) {
      return Response.json({ saved: 0, skipped: invalid, message: "কোনো বৈধ নতুন ইমেইল পাওয়া যায়নি।" });
    }

    const existing = await adminDb.getAll(...candidates.map((item) => item.ref));
    const existingIds = new Set(existing.filter((item) => item.exists).map((item) => item.id));
    const batch = adminDb.batch();
    let saved = 0;
    for (const item of candidates) {
      if (existingIds.has(item.id)) continue;
      batch.create(item.ref, {
        email: item.email,
        name: item.name,
        segment: item.segment,
        consent: true,
        consentSource: source,
        consentedAt: FieldValue.serverTimestamp(),
        status: "active",
        brevoSyncStatus: "pending",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      saved++;
    }
    if (saved) await batch.commit();

    return Response.json({
      saved,
      skipped: invalid + candidates.length - saved,
      message: "সম্মতিপ্রাপ্ত ইমেইল ডেটাবেজে সংরক্ষিত হয়েছে। Brevo sync আলাদা ধাপে হবে।"
    }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
