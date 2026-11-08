import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/firebase-admin";
import { initiateSslcommerz } from "@/lib/payments/sslcommerz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const customer = await requireCustomer(request);
    const body = await request.json() as { projectId?: string; name?: string; phone?: string; address?: string };
    if (!body.projectId || !body.name?.trim() || !body.phone?.trim() || !body.address?.trim()) {
      return NextResponse.json({ error: "Project, name, phone and billing address are required." }, { status: 400 });
    }
    const result = await initiateSslcommerz({
      projectId: body.projectId, uid: customer.uid, email: customer.email!,
      name: body.name.trim(), phone: body.phone.trim(), address: body.address.trim()
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initiation failed";
    const status = /Authentication|verified email/i.test(message) ? 401 : /not configured/i.test(message) ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
