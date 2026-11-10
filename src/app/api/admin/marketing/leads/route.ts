import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";

type LeadInput = { email?: string; name?: string; category?: string; sourceUrl?: string; sourceName?: string; country?: string };

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const url = new URL(request.url);
    const requestedLimit = Number(url.searchParams.get("limit") || 100);
    const pageSize = Number.isFinite(requestedLimit) ? Math.min(200, Math.max(1, Math.floor(requestedLimit))) : 100;
    const cursor = url.searchParams.get("cursor");
    const collection = adminDb.collection("marketingPublicLeads");
    let query = collection.orderBy("createdAt", "desc").limit(pageSize + 1);
    if (cursor) {
      const cursorDoc = await collection.doc(cursor).get();
      if (!cursorDoc.exists) return jsonError(new Error("পৃষ্ঠা cursor আর পাওয়া যাচ্ছে না; তালিকা নতুন করে লোড করুন।"), 400);
      query = collection.orderBy("createdAt", "desc").startAfter(cursorDoc).limit(pageSize + 1);
    }
    const snapshot = await query.get();
    const hasMore = snapshot.docs.length > pageSize;
    const docs = snapshot.docs.slice(0, pageSize);
    return Response.json({
      leads: docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      hasMore,
      nextCursor: hasMore && docs.length ? docs[docs.length - 1].id : null,
      pageSize
    });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { leads?: LeadInput[] };
    if (!Array.isArray(body.leads) || body.leads.length === 0) return jsonError(new Error("কমপক্ষে একটি প্রকাশ্য ব্যবসায়িক লিড দিন।"));
    if (body.leads.length > 400) return jsonError(new Error("একবারে সর্বোচ্চ ৪০০টি লিড যোগ করা যাবে।"));

    const saved: Array<{ email: string; status: string }> = [];
    const skipped: string[] = [];
    const candidates: Array<{ ref: FirebaseFirestore.DocumentReference; data: Record<string, unknown>; email: string }> = [];
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
      candidates.push({ ref, email, data: {
        email, name, category: String(item.category || "business").slice(0, 30), country,
        sourceUrl: parsed.toString(), sourceName,
        consent: false, consentStatus: "pending",
        marketingEligible: false, createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      } });
    }
    const existingSnapshots = candidates.length
      ? await adminDb.getAll(...candidates.map((candidate) => candidate.ref))
      : [];
    const existingIds = new Set(existingSnapshots.filter((doc) => doc.exists).map((doc) => doc.id));
    const batch = adminDb.batch();
    for (const candidate of candidates) {
      if (existingIds.has(candidate.ref.id)) { skipped.push(candidate.email); continue; }
      batch.create(candidate.ref, candidate.data);
      saved.push({ email: candidate.email, status: "consent_pending" });
    }
    if (saved.length) await batch.commit();
    return Response.json({ saved, skipped, message: "প্রকাশ্য ব্যবসায়িক লিড সম্মতি-অপেক্ষমাণ হিসেবে সংরক্ষিত হয়েছে; Brevo-তে সাবস্ক্রাইব করা হয়নি।" }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
