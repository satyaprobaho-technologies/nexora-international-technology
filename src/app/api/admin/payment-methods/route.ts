import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
const ADMIN_EMAIL = "computer26training@gmail.com";
const SETTINGS = adminDb.collection("settings").doc("paymentMethods");

async function verifyAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("Authentication required");
  const user = await adminAuth.verifyIdToken(token);
  if (user.email !== ADMIN_EMAIL || user.email_verified !== true) throw new Error("Admin access denied");
  return user;
}

export async function GET(request: Request) {
  try {
    await verifyAdmin(request);
    const snapshot = await SETTINGS.get();
    if (!snapshot.exists) {
      const initial = {
        bkash: { number: process.env.NEXORA_BKASH_NUMBER || "", enabled: Boolean(process.env.NEXORA_BKASH_NUMBER), label: "bKash" },
        nagad: { number: process.env.NEXORA_NAGAD_NUMBER || "", enabled: Boolean(process.env.NEXORA_NAGAD_NUMBER), label: "Nagad" },
        instructions: "ইনভয়েসের নির্ধারিত টাকা পাঠানোর আগে NEXORA-র সঙ্গে পরিমাণ নিশ্চিত করুন। টাকা পাঠানোর পর Sender Number ও Transaction ID জমা দিন। অ্যাডমিন টাকা গ্রহণ যাচাই না করা পর্যন্ত পেমেন্ট Paid হবে না।",
        updatedAt: new Date().toISOString()
      };
      await SETTINGS.set(initial);
      return NextResponse.json(initial);
    }
    return NextResponse.json(snapshot.data());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load payment settings" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await verifyAdmin(request);
    const body = await request.json();
    const clean = {
      bkash: { number: String(body.bkash?.number || "").replace(/[^0-9]/g, "").slice(0, 14), enabled: body.bkash?.enabled === true, label: "bKash" },
      nagad: { number: String(body.nagad?.number || "").replace(/[^0-9]/g, "").slice(0, 14), enabled: body.nagad?.enabled === true, label: "Nagad" },
      instructions: String(body.instructions || "").slice(0, 1000),
      updatedAt: new Date().toISOString()
    };
    if ((clean.bkash.enabled && !/^01[3-9][0-9]{8}$/.test(clean.bkash.number)) || (clean.nagad.enabled && !/^01[3-9][0-9]{8}$/.test(clean.nagad.number))) {
      return NextResponse.json({ error: "চালু করতে হলে বৈধ ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।" }, { status: 400 });
    }
    await SETTINGS.set(clean);
    return NextResponse.json({ ok: true, settings: clean });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save settings" }, { status: 401 });
  }
}
