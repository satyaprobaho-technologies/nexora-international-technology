import { adminAuth } from "@/lib/firebase-admin";

export async function requireMarketingAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("Authentication required");
  const decoded = await adminAuth.verifyIdToken(token);
  if (!["satyaprobaho.official@gmail.com", "computer26training@gmail.com"].includes(String(decoded.email || "").toLowerCase()) || decoded.email_verified !== true) {
    throw new Error("Administrator access required");
  }
  return decoded;
}

export function jsonError(error: unknown, status = 400) {
  return Response.json(
    { error: error instanceof Error ? error.message : "Request failed" },
    { status }
  );
}
