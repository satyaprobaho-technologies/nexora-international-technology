import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";

function dhakaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day) };
}

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const collection = adminDb.collection("newsletterSignups");
    const [total, confirmed, pending] = await Promise.all([
      collection.count().get(),
      collection.where("status", "==", "active").count().get(),
      collection.where("status", "==", "pending_confirmation").count().get(),
    ]);

    const { year, month, day } = dhakaDateParts(new Date());
    const todayStart = new Date(Date.UTC(year, month - 1, day, -6));
    const last7Days = await Promise.all(Array.from({ length: 7 }, async (_, index) => {
      const start = new Date(todayStart.getTime() - (6 - index) * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const result = await collection
        .where("createdAt", ">=", Timestamp.fromDate(start))
        .where("createdAt", "<", Timestamp.fromDate(end))
        .count().get();
      return {
        date: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "short" }).format(start),
        count: result.data().count,
      };
    }));

    return Response.json({
      total: total.data().count,
      confirmed: confirmed.data().count,
      pending: pending.data().count,
      today: last7Days[6]?.count || 0,
      last7Days,
      timezone: "Asia/Dhaka",
    });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}
