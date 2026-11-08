import { NextResponse } from "next/server";
import { validateAndRecordSslcommerz } from "@/lib/payments/sslcommerz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = new URLSearchParams(await request.text());
  try {
    const result = await validateAndRecordSslcommerz(form);
    return NextResponse.redirect(new URL(`/payment/result?status=${result.status}`, process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-international-technology.vercel.app"), 303);
  } catch {
    return NextResponse.redirect(new URL("/payment/result?status=verification_pending", process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-international-technology.vercel.app"), 303);
  }
}
