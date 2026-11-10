import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";

type LeadInput = { email?: string; name?: string; category?: string; sourceUrl?: string; sourceName?: string; country?: string };

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const snapshot = await adminDb.collection("marketingPublicLeads").orderBy("createdAt", "desc").limit(500).get();
    return Response.json({ leads: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { leads?: LeadInput[] };
    if (!Array.isArray(body.leads) || body.leads.length === 0) return jsonError(new Error("কমপক্ষে একটি প্রকাশ্য ব্যবসায়িক লিড দিন।"));
    if (body.leads.length > 100) return jsonError(new Error("একবারে সর্বোচ্চ ১০০টি লিড যোগ করা যাবে।"));

    const saved: Array<{ email: string; status: string }> = [];
    const skipped: string[] = [];
    for (const item of body.leads) {
      const email = String(item.email || "").trim().toLowerCase();
      const sourceUrl = String(item.sourceUrl || "").trim();
      const sourceName = String(item.sourceName || "").trim().slice(0, 160);
      const country = String(item.country || "Unknown").trim().slice(0, 80) || "Unknown";
      const name = String(item.name || "").trim().slice(0, 120);
      let parsed: URL;
      try { parsed = new URL(sourceUrl); } catch { skipped.push(email); continue; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !["http:", "https:"].includes(parsed.protocol)) { skipped.push(email); continue; }

      const ref = adminDb.collection("marketingPublicLeads").doc(email.replaceAll("/", "_"));
      const existing = await ref.get();
      if (existing.exists) { skipped.push(email); continue; }
      await ref.set({
        email, name, category: String(item.category || "business").slice(0, 30), country,
        sourceUrl: parsed.toString(), sourceName,
        consent: false, consentStatus: "pending",
        marketingEligible: false, createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      saved.push({ email, status: "consent_pending" });
    }
    return Response.json({ saved, skipped, message: "প্রকাশ্য ব্যবসায়িক লিড সম্মতি-অপেক্ষমাণ হিসেবে সংরক্ষিত হয়েছে; Brevo-তে সাবস্ক্রাইব করা হয়নি।" }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
