import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { requireMarketingAdmin, jsonError } from "@/lib/marketing-auth";

export const runtime = "nodejs";
export const maxDuration = 30;

const EMAIL_RE = /[a-zA-Z0-9.!#$%&'*+/=?^`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;
const PATHS = ["/", "/contact", "/contact-us", "/about", "/about-us", "/privacy", "/terms"];

// Conservative exclusion for clearly identified IT/software vendors.
const IT_SOFTWARE_RE = /\b(?:software\s+(?:development|company|solutions|services)|software\s+house|IT\s+(?:services|consulting|solutions|company)|information\s+technology|SaaS|cloud\s+(?:computing|services)|cyber\s*security|web\s+(?:development|hosting|design)\s+(?:company|services)|app\s+development|mobile\s+app\s+development|digital\s+agency|managed\s+IT|data\s+center|computer\s+(?:repair|services)|technology\s+company)\b/i;

function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) {
    const p = ip.split(".").map(Number);
    return p[0] === 10 || p[0] === 127 || p[0] === 0 || p[0] >= 224 ||
      (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168);
  }
  const value = ip.toLowerCase();
  return value === "::1" || value === "::" || value.startsWith("fc") ||
    value.startsWith("fd") || value.startsWith("fe80:") || value.startsWith("::ffff:127.");
}

async function safeUrl(raw: string) {
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
    throw new Error("শুধু public HTTP/HTTPS ওয়েবসাইট ব্যবহার করা যাবে।");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local"))
    throw new Error("Private/local host অনুমোদিত নয়।");
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new Error("Private IP অনুমোদিত নয়।");
  } else {
    const records = await lookup(host, { all: true, verbatim: true });
    if (!records.length || records.some((item) => isPrivateIp(item.address)))
      throw new Error("ওয়েবসাইটের host public IP-তে resolve হচ্ছে না।");
  }
  return url;
}

async function fetchPublic(raw: string) {
  let url = await safeUrl(raw);
  for (let i = 0; i < 4; i++) {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "NEXORA-Public-Contact-Finder/1.0 (+https://nexora-international-technology.vercel.app)" }
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return null;
      url = await safeUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok || !(response.headers.get("content-type") || "").includes("text/html")) return null;
    return { url: url.toString(), html: (await response.text()).slice(0, 700_000) };
  }
  return null;
}

function robotsAllows(robots: string, path: string) {
  let active = false;
  const rules: string[] = [];
  for (const line of robots.split(/\r?\n/)) {
    const [key, ...rest] = line.split(":");
    if (!key) continue;
    const value = rest.join(":").trim();
    if (key.trim().toLowerCase() === "user-agent") active = value === "*" || value.toLowerCase().includes("nexora");
    else if (active && key.trim().toLowerCase() === "disallow" && value) rules.push(value);
  }
  return !rules.some((rule) => path.startsWith(rule));
}

function extractEmails(html: string) {
  const clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ");
  const found = new Set<string>();
  for (const match of clean.matchAll(/mailto:([^"'?\s>]+)/gi)) {
    try { found.add(decodeURIComponent(match[1]).trim().toLowerCase()); } catch { /* ignore malformed mailto */ }
  }
  for (const match of clean.matchAll(EMAIL_RE)) found.add(match[0].toLowerCase());
  return [...found].filter((email) => email.length <= 254 && !/\.(png|jpe?g|gif|webp|svg)$/i.test(email));
}

export async function POST(request: Request) {
  try {
    await requireMarketingAdmin(request);
    const body = await request.json() as { websites?: string[] };
    const websites = Array.isArray(body.websites) ? [...new Set(body.websites.map((v) => String(v).trim()).filter(Boolean))].slice(0, 5) : [];
    if (!websites.length) return jsonError(new Error("কমপক্ষে একটি ওয়েবসাইট URL দিন।"));
    const results = await Promise.all(websites.map(async (website) => {
      try {
        const start = await safeUrl(website.startsWith("http://") || website.startsWith("https://") ? website : "https://" + website);
        const origin = start.origin;
        let robots = "";
        try {
          const robotUrl = await safeUrl(new URL("/robots.txt", origin).toString());
          const robotResponse = await fetch(robotUrl, {
            redirect: "manual", signal: AbortSignal.timeout(2500),
            headers: { "User-Agent": "NEXORA-Public-Contact-Finder/1.0" }
          });
          if (robotResponse.ok) robots = (await robotResponse.text()).slice(0, 100_000);
        } catch { /* robots unavailable: inspect only standard public pages */ }
        const paths = [...new Set([start.pathname === "/" ? "/" : start.pathname, ...PATHS.slice(1)])];
        const allowed = paths.filter((path) => !robots || robotsAllows(robots, path));
        const pages = (await Promise.all(allowed.map(async (path) => {
          try { return await fetchPublic(new URL(path, origin).toString()); }
          catch { return null; }
        }))).filter((page): page is NonNullable<typeof page> => page !== null);
        const siteText = pages.map((page) => page.html.replace(/<[^>]+>/g, " ")).join(" ").slice(0, 2_000_000);
        if (IT_SOFTWARE_RE.test(siteText)) {
          return { website: origin, emails: [], pagesScanned: pages.length, excluded: true, exclusionReason: "IT/software business detected" };
        }
        const contacts = new Map<string, string>();
        for (const page of pages) for (const email of extractEmails(page.html)) {
          if (!contacts.has(email)) contacts.set(email, page.url);
        }
        return { website: origin, emails: [...contacts].map(([email, sourceUrl]) => ({
          email, sourceUrl, consent: false, consentStatus: "Not confirmed"
        })), pagesScanned: pages.length, excluded: false };
      } catch (error) {
        return { website, emails: [], pagesScanned: 0, error: error instanceof Error ? error.message : "ওয়েবসাইট পরীক্ষা করা যায়নি।" };
      }
    }));
    return Response.json({ results, notice: "শুধু প্রকাশ্যে দৃশ্যমান ওয়েবসাইটের ইমেইল সংগ্রহ করা হয়েছে; সম্মতি স্বয়ংক্রিয়ভাবে ধরে নেওয়া হয়নি।" });
  } catch (error) {
    return jsonError(error, error instanceof Error && error.message.includes("Authentication") ? 401 : 400);
  }
}
