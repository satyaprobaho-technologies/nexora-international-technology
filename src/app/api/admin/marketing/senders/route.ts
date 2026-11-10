import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";

type BrevoSender = { id: number; name?: string; email?: string; active?: boolean };

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return jsonError(new Error("Brevo API Key কনফিগার করা নেই।"), 503);
    const response = await fetch("https://api.brevo.com/v3/senders", {
      headers: { "api-key": apiKey },
      cache: "no-store"
    });
    const text = await response.text();
    if (!response.ok) {
      return Response.json({ error: "Brevo Sender তালিকা লোড করা যায়নি।", detail: text.slice(0, 500) }, { status: 502 });
    }
    const payload = JSON.parse(text) as { senders?: BrevoSender[] };
    const senders = (payload.senders || [])
      .filter((sender) => Number.isSafeInteger(sender.id) && !!sender.email)
      .map((sender) => ({
        id: sender.id,
        name: String(sender.name || "NEXORA"),
        email: String(sender.email),
        active: sender.active === true
      }));
    return Response.json({ senders });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return jsonError(new Error("Brevo API Key কনফিগার করা নেই।"), 503);
    const body = await request.json() as { email?: string; name?: string };
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "NEXORA INTERNATIONAL TECHNOLOGY").trim().slice(0, 70);
    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      return jsonError(new Error("শুধু বৈধ @gmail.com ঠিকানা যোগ করুন।"));
    }
    if (!name) return jsonError(new Error("Sender Name প্রয়োজন।"));
    const response = await fetch("https://api.brevo.com/v3/senders", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });
    const text = await response.text();
    if (!response.ok) {
      return Response.json({ error: "Brevo-তে Gmail Sender যোগ করা যায়নি।", detail: text.slice(0, 700) }, { status: 502 });
    }
    const created = JSON.parse(text) as { id?: number };
    return Response.json({
      ok: true,
      senderId: created.id,
      email,
      message: "Brevo যাচাইকরণ ইমেইল পাঠিয়েছে। Gmail Inbox/Spam থেকে verify করুন, তারপর Refresh করুন।"
    }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
