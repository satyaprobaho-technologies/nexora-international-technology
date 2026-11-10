import { createHash } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function page(title: string, message: string, token?: string) {
  const form = token ? `
    <form method="post">
      <input type="hidden" name="token" value="${token}">
      <button type="submit" style="padding:12px 20px;background:#087ac1;color:white;border:0;border-radius:6px;font-size:16px;cursor:pointer">Confirm subscription</button>
    </form>` : "";
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:Arial,sans-serif;background:#f3f6fa;padding:40px 16px;color:#172033"><main style="max-width:560px;margin:8vh auto;background:white;padding:32px;border-radius:12px;box-shadow:0 8px 32px #14243a18"><h1>${title}</h1><p style="line-height:1.7">${message}</p>${form}<p style="margin-top:28px;color:#64748b;font-size:13px">NEXORA INTERNATIONAL TECHNOLOGY</p></main></body></html>`, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return page("Invalid confirmation link", "This subscription confirmation link is invalid.");
  }
  const ref = adminDb.collection("newsletterConfirmations").doc(tokenHash(token));
  const snapshot = await ref.get();
  if (!snapshot.exists) return page("Link unavailable", "This confirmation link has already been used or is no longer valid.");
  const expiresAt = snapshot.data()?.expiresAt as Timestamp | undefined;
  if (!expiresAt || expiresAt.toMillis() < Date.now()) {
    return page("Link expired", "This confirmation link has expired. Please subscribe again from the NEXORA website.");
  }
  return page("Confirm your NEXORA subscription", "Click the button below to confirm that you own this email address and want to receive NEXORA product and service updates.", token);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const token = String(form.get("token") || "");
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return page("Invalid confirmation link", "This subscription confirmation link is invalid.");
    }

    const hash = tokenHash(token);
    const tokenRef = adminDb.collection("newsletterConfirmations").doc(hash);
    const tokenSnapshot = await tokenRef.get();
    if (!tokenSnapshot.exists) {
      return page("Link unavailable", "This confirmation link has already been used or is no longer valid.");
    }
    const tokenData = tokenSnapshot.data()!;
    const expiresAt = tokenData.expiresAt as Timestamp | undefined;
    if (!expiresAt || expiresAt.toMillis() < Date.now()) {
      await tokenRef.delete();
      return page("Link expired", "This confirmation link has expired. Please subscribe again from the NEXORA website.");
    }

    const email = String(tokenData.email || "");
    const contactId = email.replaceAll("/", "_");
    const contactRef = adminDb.collection("marketingContacts").doc(contactId);
    const newsletterRef = adminDb.collection("newsletterSignups").doc(contactId);
    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_INDIVIDUAL_LIST_ID);
    if (!apiKey || !Number.isSafeInteger(listId) || listId <= 0) {
      console.error("Newsletter confirmation blocked: Brevo API key or individual list ID is not configured");
      return page("Confirmation temporarily unavailable", "Your email address has been verified, but the newsletter service is not fully configured yet. Please try again later. Your address has not been activated for marketing.");
    }

    const contactSnapshot = await contactRef.get();
    const name = String(contactSnapshot.data()?.name || "");
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        email,
        attributes: name ? { FIRSTNAME: name } : {},
        listIds: [listId],
        updateEnabled: true,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Brevo confirmed contact sync failed", response.status, detail.slice(0, 500));
      return page("Confirmation could not be completed", "Your email was verified, but it could not be added to the NEXORA list right now. Please try again later.");
    }
    const brevoSyncStatus = "synced";

    await adminDb.runTransaction(async (tx) => {
      const currentToken = await tx.get(tokenRef);
      if (!currentToken.exists) throw new Error("Confirmation link already used");
      const currentExpiry = currentToken.data()?.expiresAt as Timestamp | undefined;
      if (!currentExpiry || currentExpiry.toMillis() < Date.now()) throw new Error("Confirmation link expired");
      tx.set(newsletterRef, {
        consent: true,
        marketingEligible: true,
        status: "active",
        confirmedAt: FieldValue.serverTimestamp(),
        brevoSyncStatus,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      tx.set(contactRef, {
        consent: true,
        marketingEligible: true,
        status: "active",
        confirmedAt: FieldValue.serverTimestamp(),
        brevoSyncStatus,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      tx.delete(tokenRef);
    });

    return page("Subscription confirmed", "Thank you. Your email address has been confirmed and your NEXORA updates subscription is complete.");
  } catch (error) {
    console.error("Newsletter confirmation failed", error);
    return page("Confirmation unavailable", "We could not complete the confirmation right now. Please try again later.");
  }
}
