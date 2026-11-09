import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error: "Online gateway checkout is disabled. NEXORA does not accept credit/debit cards. Contact support for approved local payment instructions."
    },
    { status: 503 }
  );
}
