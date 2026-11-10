import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { jsonError, requireMarketingAdmin } from "@/lib/marketing-auth";

export const runtime = "nodejs";
export const maxDuration = 30;

const BLOCKED_HOSTS = new Set([
  "facebook.com", "instagram.com", "linkedin.com", "youtube.com", "youtu.be",
  "tiktok.com", "x.com", "twitter.com", "pinterest.com", "google.com",
  "bing.com", "yahoo.com", "wikipedia.org", "maps.google.com"
]);
const BLOCKED_SUFFIXES = [".gov", ".edu", ".ac.uk"];
const IT_SOFTWARE_RE = /\b(?:software|information technology|\bIT services\b|SaaS|cloud computing|cyber ?security|web development|app development|telecom(?:munications)?|computer services)\b/i;

function privateIp(ip: string) {
  if (isIP(ip) === 4) {
    const p = ip.split(".").map(Number);
    return p[0] === 10 || p[0] === 127 || p[0] === 0 || p[0] >= 224 ||
      (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168);
  }
  const v = ip.toLowerCase();
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80:");
}
async function safeUrl(raw: string) {
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("শুধু public HTTP/HTTPS directory URL ব্যবহার করুন।");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) throw new Error("Local/private host অনুমোদিত নয়।");
  if (isIP(host)) {
    if (privateIp(host)) throw new Error("Private IP অনুমোদিত নয়।");
  } else {
    const records = await lookup(host, { all: true, verbatim: true });
    if (!records.length || records.some((r) => privateIp(r.address))) throw new Error("Directory host public IP-তে resolve হচ্ছে না।");
  }
  return url;
}
function allowedByRobots(robots: string, path: string) {
  let applies = false;
  const disallow: string[] = [];
  for (const line of robots.split(/\r?\n/)) {
    const [key, ...rest] = line.split(":");
    if (!key) continue;
    const value = rest.join(":").trim();
    if (key.trim().toLowerCase() === "user-agent") applies = value === "*" || value.toLowerCase().includes("nexora");
    else if (applies && key.trim().toLowerCase() === "disallow" && value) disallow.push(value);
  }
  return !disallow.some((rule) => path.startsWith(rule));
}
function hostBlocked(host: string) {
  return BLOCKED_HOSTS.has(host) || [...BLOCKED_HOSTS].some((base) => host.endsWith("." + base)) ||
    BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { directoryUrls?: string[]; limit?: number };
    const urls = Array.isArray(body.directoryUrls)
      ? [...new Set(body.directoryUrls.map((v) => String(v).trim()).filter(Boolean))].slice(0, 5)
      : [];
    if (!urls.length) return jsonError(new Error("কমপক্ষে একটি প্রকাশ্য ব্যবসায়িক ডিরেক্টরি URL দিন।"));
    const limit = Math.min(30, Math.max(1, Math.floor(Number(body.limit) || 20)));
    const candidates = new Map<string, { website: string; directoryUrl: string; listingLabel: string }>();
    const sources: Array<{ url: string; scanned: boolean; found: number; error?: string }> = [];

    for (const raw of urls) {
      try {
        let directory = await safeUrl(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
        const robotUrl = await safeUrl(new URL("/robots.txt", directory.origin).toString());
        let robots = "";
        try {
          const rr = await fetch(robotUrl, { redirect: "manual", signal: AbortSignal.timeout(2500), headers: { "User-Agent": "NEXORA-Public-Business-Discovery/1.0" } });
          if (rr.ok) robots = (await rr.text()).slice(0, 100000);
        } catch { /* unavailable robots file: do not assume disallow */ }
        if (robots && !allowedByRobots(robots, directory.pathname)) {
          sources.push({ url: directory.toString(), scanned: false, found: 0, error: "robots.txt এই পৃষ্ঠা স্ক্যান করতে অনুমতি দেয়নি।" });
          continue;
        }
        const response = await fetch(directory, { redirect: "manual", signal: AbortSignal.timeout(6000), headers: { "User-Agent": "NEXORA-Public-Business-Discovery/1.0 (+https://nexora-international-technology.vercel.app)", Accept: "text/html" } });
        if ([301,302,303,307,308].includes(response.status)) {
          const location = response.headers.get("location");
          if (!location) throw new Error("Directory redirect target পাওয়া যায়নি।");
          directory = await safeUrl(new URL(location, directory).toString());
          if (directory.origin !== new URL(raw.startsWith("http") ? raw : "https://" + raw).origin) throw new Error("Cross-domain redirect review প্রয়োজন; স্বয়ংক্রিয়ভাবে অনুসরণ করা হয়নি।");
          throw new Error("Redirect হয়েছে; সরাসরি final directory URL দিন।");
        }
        if (!response.ok || !(response.headers.get("content-type") || "").includes("text/html")) throw new Error("Directory page HTML হিসেবে পাওয়া যায়নি।");
        const html = (await response.text()).slice(0, 900000);
        const before = candidates.size;
        let inspectedLinks = 0;
        for (const match of html.matchAll(/<a\b([^>]*?)href\s*=\s*(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi)) {
          inspectedLinks += 1;
          if (inspectedLinks > 200) break;
          const href = match[3];
          const label = match[5].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140);
          try {
            const target = await safeUrl(new URL(href, directory).toString());
            const host = target.hostname.toLowerCase().replace(/^www\./, "");
            const sourceHost = directory.hostname.toLowerCase().replace(/^www\./, "");
            if (target.origin === directory.origin || host === sourceHost || hostBlocked(host) || !host.includes(".") || target.pathname.match(/\.(?:pdf|jpg|jpeg|png|gif|zip|docx?)$/i)) continue;
            if (IT_SOFTWARE_RE.test(label)) continue;
            target.hash = "";
            target.search = "";
            const normalized = target.origin + "/";
            if (!candidates.has(normalized)) candidates.set(normalized, { website: normalized, directoryUrl: directory.toString(), listingLabel: label || host });
            if (candidates.size >= limit) break;
          } catch { /* skip unsafe or malformed external links */ }
        }
        sources.push({ url: directory.toString(), scanned: true, found: candidates.size - before });
      } catch (error) {
        sources.push({ url: raw, scanned: false, found: 0, error: error instanceof Error ? error.message : "Directory scan failed" });
      }
      if (candidates.size >= limit) break;
    }
    return Response.json({
      candidates: [...candidates.values()],
      sources,
      limit,
      notice: "এগুলো ডিরেক্টরিতে পাওয়া বাহ্যিক ওয়েবসাইট; ব্যবসার ধরন ও দেশ যাচাই করে তারপর Email Finder চালান। কোনো ইমেইল এখনো সংগ্রহ বা মার্কেটিং-এ সাবস্ক্রাইব করা হয়নি।"
    });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
