import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";

type ContactInput = {
  email?: string;
  name?: string;
  segment?: "business" | "individual";
  consent?: boolean;
  consentSource?: string;
};

function listIdFor(segment: "business" | "individual") {
  const raw = segment === "business"
    ? process.env.BREVO_BUSINESS_LIST_ID
    : process.env.BREVO_INDIVIDUAL_LIST_ID;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const snapshot = await adminDb.collection("marketingContacts").orderBy("createdAt", "desc").limit(500).get();
    return Response.json({ contacts: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { contacts?: ContactInput[] };
    const contacts = Array.isArray(body.contacts) ? body.contacts.slice(0, 100) : [];
    if (!contacts.length) return jsonError(new Error("কমপক্ষে একটি যোগাযোগ দিন।"));
    if (contacts.length > 100) return jsonError(new Error("একবারে সর্বোচ্চ ১০০টি যোগাযোগ যোগ করা যাবে।"));

    const apiKey = process.env.BREVO_API_KEY;
    const saved: Array<{ email: string; segment: string; sync: string }> = [];
    for (const input of contacts) {
      const email = String(input.email || "").trim().toLowerCase();
      const name = String(input.name || "").trim().slice(0, 120);
      const segment = input.segment === "business" ? "business" : "individual";
      const consentSource = String(input.consentSource || "").trim().slice(0, 300);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
      if (input.consent !== true || !consentSource) continue;

      const docId = email.replaceAll("/", "_");
      let sync = "pending";
      const listId = listIdFor(segment);
      if (apiKey && listId) {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: { "api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            attributes: name ? { FIRSTNAME: name } : {},
            listIds: [listId],
            updateEnabled: true
          })
        });
        if (response.ok) sync = "synced";
        else {
          const detail = await response.text();
          sync = "failed";
          await adminDb.collection("marketingContacts").doc(docId).set({
            email, name, segment, consent: true, consentSource,
            consentedAt: FieldValue.serverTimestamp(),
            status: "active", brevoSyncStatus: sync,
            brevoSyncError: detail.slice(0, 500),
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp()
          }, { merge: true });
          saved.push({ email, segment, sync });
          continue;
        }
      } else if (!apiKey) {
        sync = "not_configured";
      } else {
        sync = "list_not_configured";
      }

      await adminDb.collection("marketingContacts").doc(docId).set({
        email, name, segment, consent: true, consentSource,
        consentedAt: FieldValue.serverTimestamp(),
        status: "active", brevoSyncStatus: sync,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp()
      }, { merge: true });
      saved.push({ email, segment, sync });
    }
    return Response.json({
      saved,
      skipped: contacts.length - saved.length,
      message: "সম্মতিপ্রাপ্ত যোগাযোগ সংরক্ষণ করা হয়েছে।"
    }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
