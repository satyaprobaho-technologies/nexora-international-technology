import { NextResponse } from "next/server";
import { validateAndRecordSslcommerz } from "@/lib/payments/sslcommerz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = new URLSearchParams(await request.text());
    const result = await validateAndRecordSslcommerz(form);
    return NextResponse.json({ received: true, status: result.status });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
