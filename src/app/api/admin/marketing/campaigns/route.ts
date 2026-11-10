import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";

function selectedListIds(audience: string) {
  const ids: number[] = [];
  if (audience === "both" || audience === "business") {
    const id = Number(process.env.BREVO_BUSINESS_LIST_ID || "3");
    if (Number.isSafeInteger(id) && id > 0) ids.push(id);
  }
  if (audience === "both" || audience === "individual") {
    const id = Number(process.env.BREVO_INDIVIDUAL_LIST_ID || "4");
    if (Number.isSafeInteger(id) && id > 0) ids.push(id);
  }
  return [...new Set(ids)];
}

export async function GET(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const snapshot = await adminDb.collection("marketingCampaigns").orderBy("createdAt", "desc").limit(50).get();
    const apiKey = process.env.BREVO_API_KEY;
    const campaigns = await Promise.all(snapshot.docs.map(async (item) => {
      const data = item.data();
      const campaignId = Number(data.brevoCampaignId);
      if (!apiKey || !Number.isSafeInteger(campaignId) || campaignId <= 0) {
        return { id: item.id, ...data, analytics: null };
      }
      try {
        const response = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}?statistics=globalStats`, {
          headers: { "api-key": apiKey }, cache: "no-store"
        });
        if (!response.ok) return { id: item.id, ...data, analytics: null };
        const report = await response.json() as {
          status?: string;
          statistics?: { globalStats?: {
            sent?: number; delivered?: number; viewed?: number; opensRate?: number;
            clickers?: number; uniqueClicks?: number; unsubscriptions?: number;
            hardBounces?: number; softBounces?: number;
          } }
        };
        const stats = report.statistics?.globalStats;
        const delivered = Number(stats?.delivered || 0);
        const clickers = Number(stats?.clickers || 0);
        return {
          id: item.id, ...data,
          providerStatus: report.status || null,
          analytics: stats ? {
            sent: Number(stats.sent || 0),
            delivered,
            opens: Number(stats.viewed || 0),
            openRate: Number(stats.opensRate || 0),
            clickers,
            clickRate: delivered > 0 ? Number((clickers / delivered * 100).toFixed(2)) : 0,
            unsubscriptions: Number(stats.unsubscriptions || 0),
            bounces: Number(stats.hardBounces || 0) + Number(stats.softBounces || 0)
          } : null
        };
      } catch {
        return { id: item.id, ...data, analytics: null };
      }
    }));
    return Response.json({ campaigns });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return jsonError(new Error("Brevo API Key কনফিগার করা নেই।"), 503);
    const body = await request.json() as {
      name?: string; subject?: string; htmlContent?: string;
      audience?: string; confirmed?: boolean; replyTo?: string;
    };
    // Use the configured, already verified Brevo sender. Gmail addresses are Reply-To destinations.
    const senderEmail = String(process.env.BREVO_SENDER_EMAIL || "computer26training@gmail.com").trim().toLowerCase();
    const senderName = process.env.BREVO_SENDER_NAME || "NEXORA INTERNATIONAL TECHNOLOGY";
    const replyTo = String(body.replyTo || "").trim().toLowerCase();
    if (replyTo) {
      if (!/^[^\\s@]+@gmail\\.com$/i.test(replyTo)) return jsonError(new Error("শুধু বৈধ Gmail Reply-To ঠিকানা ব্যবহার করুন।"));
      const mailbox = await adminDb.collection("marketingReplyToAddresses").doc(replyTo).get();
      if (!mailbox.exists || mailbox.data()?.active !== true) {
        return jsonError(new Error("নির্বাচিত Reply-To Gmail ঠিকানাটি Admin Panel-এ সংরক্ষিত/সক্রিয় নয়।"));
      }
    }
    const name = String(body.name || "").trim().slice(0, 100);
    const subject = String(body.subject || "").trim().slice(0, 150);
    const htmlContent = String(body.htmlContent || "").trim();
    const audience = ["both", "business", "individual"].includes(String(body.audience)) ? String(body.audience) : "both";
    if (body.confirmed !== true) return jsonError(new Error("পাঠানোর আগে ক্যাম্পেইন নিশ্চিত করুন।"));
    if (!name || !subject || htmlContent.replace(/<[^>]*>/g, "").trim().length < 20) {
      return jsonError(new Error("ক্যাম্পেইনের নাম, বিষয় এবং কমপক্ষে ২০ অক্ষরের বার্তা প্রয়োজন।"));
    }
    const recipients = selectedListIds(audience);
    if (!recipients.length) {
      return jsonError(new Error("Brevo-তে ব্যবসা ও ব্যক্তিগত গ্রাহকদের জন্য আলাদা Contact List তৈরি করে তাদের List ID Vercel-এ সেট করুন।"), 503);
    }

    const createResponse = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        name, subject, sender: { name: senderName, email: senderEmail },
        replyTo: replyTo || senderEmail,
        htmlContent,
        recipients: { listIds: recipients },
        tag: "nexora-admin-marketing"
      })
    });
    const createText = await createResponse.text();
    if (!createResponse.ok) {
      return Response.json({ error: "Brevo campaign তৈরি করা যায়নি।", detail: createText.slice(0, 1000) }, { status: 502 });
    }
    const created = JSON.parse(createText) as { id?: number };
    if (!created.id) return jsonError(new Error("Brevo campaign ID পাওয়া যায়নি।"), 502);

    const sendResponse = await fetch(`https://api.brevo.com/v3/emailCampaigns/${created.id}/sendNow`, {
      method: "POST", headers: { "api-key": apiKey }
    });
    if (!sendResponse.ok) {
      const detail = await sendResponse.text();
      await adminDb.collection("marketingCampaigns").add({
        brevoCampaignId: created.id, name, subject, audience, senderEmail,
        status: "send_failed", error: detail.slice(0, 1000),
        createdAt: FieldValue.serverTimestamp()
      });
      return Response.json({ error: "ক্যাম্পেইন তৈরি হয়েছে, কিন্তু পাঠানো শুরু হয়নি।", campaignId: created.id, detail }, { status: 502 });
    }

    const record = await adminDb.collection("marketingCampaigns").add({
      brevoCampaignId: created.id, name, subject, audience, senderEmail,
      status: "scheduled", provider: "Brevo",
      createdAt: FieldValue.serverTimestamp()
    });
    return Response.json({ ok: true, id: record.id, campaignId: created.id, status: "scheduled" }, { status: 201 });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
