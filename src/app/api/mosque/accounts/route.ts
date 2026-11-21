"use server";
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
const SUPER_ADMIN_EMAIL = "computer26training@gmail.com";
const kinds = ["income", "expense", "salary"];
const ledgers = ["mosque", "foundation"];
const methods = ["cash", "bkash", "nagad", "bank", "cheque", "other"];

async function authorize(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("AUTH_REQUIRED");
  const user = await adminAuth.verifyIdToken(token);
  if (!user.email || user.email_verified !== true) throw new Error("VERIFIED_EMAIL_REQUIRED");
  if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL) return user;
  const doc = await adminDb.collection("mosqueAdmins").doc(user.uid).get();
  const admin = doc.data();
  if (!doc.exists || admin?.status !== "active" || !["super_admin", "accounts_admin"].includes(admin?.role)) {
    throw new Error("ACCOUNTS_ACCESS_DENIED");
  }
  return user;
}
function fail(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  const status = ["AUTH_REQUIRED", "VERIFIED_EMAIL_REQUIRED"].includes(message) ? 401 : message === "ACCOUNTS_ACCESS_DENIED" ? 403 : 400;
  return NextResponse.json({ ok: false, error: message }, { status });
}
export async function GET(request: Request) {
  try {
    await authorize(request);
    const url = new URL(request.url);
    const ledger = url.searchParams.get("ledger");
    const kind = url.searchParams.get("kind");
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 250);
    let query: FirebaseFirestore.Query = adminDb.collection("mosqueAccountEntries");
    if (ledger && ledgers.includes(ledger)) query = query.where("ledger", "==", ledger);
    if (kind && kinds.includes(kind)) query = query.where("kind", "==", kind);
    const snap = await query.orderBy("createdAt", "desc").limit(limit).get();
    return NextResponse.json({ ok: true, entries: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (error) { return fail(error); }
}
export async function POST(request: Request) {
  try {
    const user = await authorize(request);
    const body = await request.json();
    const { ledger, kind, person, purpose, amount, method, date, reference, notes } = body ?? {};
    if (!ledgers.includes(ledger) || !kinds.includes(kind)) return NextResponse.json({ ok:false,error:"INVALID_LEDGER_OR_KIND" },{status:400});
    if (typeof person !== "string" || !person.trim() || person.length > 160 || typeof purpose !== "string" || !purpose.trim() || purpose.length > 500) return NextResponse.json({ok:false,error:"PERSON_AND_PURPOSE_REQUIRED"},{status:400});
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || value > 100000000) return NextResponse.json({ok:false,error:"INVALID_AMOUNT"},{status:400});
    if (!methods.includes(method)) return NextResponse.json({ok:false,error:"INVALID_PAYMENT_METHOD"},{status:400});
    if (typeof date !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) return NextResponse.json({ok:false,error:"INVALID_DATE"},{status:400});
    const ref = typeof reference === "string" ? reference.trim().slice(0,120) : "";
    if (ref) {
      const duplicate = await adminDb.collection("mosqueAccountEntries").where("reference","==",ref).limit(1).get();
      if (!duplicate.empty) return NextResponse.json({ok:false,error:"DUPLICATE_REFERENCE"},{status:409});
    }
    const entry = {
      ledger, kind, person:person.trim(), purpose:purpose.trim(), amount:Math.round(value*100)/100,
      method, date, reference:ref || null, notes:typeof notes === "string" ? notes.trim().slice(0,2000) : "",
      status:"recorded", createdBy:user.uid, createdByEmail:user.email,
      createdAt:FieldValue.serverTimestamp(), updatedAt:FieldValue.serverTimestamp()
    };
    const doc = await adminDb.collection("mosqueAccountEntries").add(entry);
    return NextResponse.json({ok:true,id:doc.id},{status:201});
  } catch(error) { return fail(error); }
}
