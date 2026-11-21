import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { randomBytes } from "node:crypto";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    // Quiet honeypot for basic automated form spam.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true, orderNumber: "NX-REQUEST" }, { status: 201 });
    }
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().replace(/[^0-9+ -]/g, "").slice(0, 20) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1500) : "";
    const packageId = typeof body.packageId === "string" ? body.packageId.trim() : "";
    const packageName = typeof body.packageName === "string" ? body.packageName.trim().slice(0, 100) : "";
    const price = Number(body.price);
    if (name.length < 2 || phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ ok: false, error: "সঠিক নাম ও মোবাইল নম্বর দিন।" }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "সঠিক ইমেইল ঠিকানা দিন।" }, { status: 400 });
    }
    if (!["shayla-akram-1", "shayla-akram-2", "shayla-akram-3", "shayla-akram-4"].includes(packageId) || !packageName || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ ok: false, error: "প্যাকেজের তথ্য সঠিক নয়।" }, { status: 400 });
    }
    const orderNumber = "NX-" + randomBytes(4).toString("hex").toUpperCase();
    const doc = await adminDb.collection("websiteOrderRequests").add({
      orderNumber, requestType: "website_project_order", packageId, packageName, quotedPackagePrice: price,
      customer: { name, phone, email: email || null }, notes,
      status: "new", statusLabel: "নতুন অর্ডার অনুরোধ",
      source: "public_package_demo", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
    });
    return NextResponse.json({ ok: true, orderNumber, requestId: doc.id, message: "অর্ডার অনুরোধ সংরক্ষণ করা হয়েছে।" }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
