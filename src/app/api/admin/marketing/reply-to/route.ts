import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";
const collection = () => adminDb.collection("marketingReplyToAddresses");

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const snapshot = await collection().orderBy("createdAt", "desc").limit(100).get();
    return Response.json({ addresses: snapshot.docs.map((doc) => ({
      id: doc.id, email: doc.get("email"), label: doc.get("label"), active: doc.get("active") === true
    })) });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { email?: string; label?: string };
    const email = String(body.email || "").trim().toLowerCase();
    const label = String(body.label || "").trim().slice(0, 70);
    if (!/^[^\\s@]+@gmail\\.com$/i.test(email)) return jsonError(new Error("শুধু বৈধ @gmail.com ঠিকানা যোগ করুন।"));
    await collection().doc(email).set({
      email, label: label || email, active: true,
      updatedAt: FieldValue.serverTimestamp(), createdAt: FieldValue.serverTimestamp()
    }, { merge: true });
    return Response.json({ ok: true, message: "Gmail Reply-To ঠিকানা সংরক্ষিত হয়েছে।" }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { email?: string; active?: boolean; label?: string };
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\\s@]+@gmail\\.com$/i.test(email) || typeof body.active !== "boolean") {
      return jsonError(new Error("সঠিক Gmail ঠিকানা এবং active status প্রয়োজন।"));
    }
    const ref = collection().doc(email);
    const snapshot = await ref.get();
    if (!snapshot.exists) return jsonError(new Error("ঠিকানাটি পাওয়া যায়নি।"), 404);
    await ref.update({ active: body.active,
      ...(typeof body.label === "string" ? { label: body.label.trim().slice(0, 70) } : {}),
      updatedAt: FieldValue.serverTimestamp()
    });
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
