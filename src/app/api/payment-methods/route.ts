import { NextResponse } from "next/server";
import { requireCustomer, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireCustomer(request);
    const snapshot = await adminDb.collection("settings").doc("paymentMethods").get();
    if (!snapshot.exists) return NextResponse.json({ enabled: false });
    const data = snapshot.data()!;
    return NextResponse.json({
      enabled: true,
      bkash: data.bkash?.enabled ? { number: data.bkash.number, label: "bKash" } : null,
      nagad: data.nagad?.enabled ? { number: data.nagad.number, label: "Nagad" } : null,
      instructions: data.instructions || ""
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Authentication required" }, { status: 401 });
  }
}
