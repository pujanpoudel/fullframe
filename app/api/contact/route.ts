import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { packages } from "@/content/packages";
import { services, site } from "@/content/site";
import { contactReady } from "@/lib/contact-config";

export const runtime = "nodejs";
const windowSeconds = 600;
const limit = 5;
const localWindows = new Map<string, { count: number; expires: number }>();
const fields = { name: 100, email: 254, phone: 50, company: 150, profile: 240, budget: 80, message: 3000, package: 30, billing: 10, currency: 3 };
const budgetOptions = new Set<string>(site.contact.budgets);
const serviceNames = new Set<string>(services.map(({ name }) => name));

function reply(status: number, retryAfter?: number) {
  return NextResponse.json({ ok: status === 200 }, {
    status, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
  });
}

async function readBody(request: Request) {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.length;
    if (size > 18_000) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(chunk.value, { stream: true });
  }
  return JSON.parse(body + decoder.decode()) as unknown;
}

async function underLimit(request: NextRequest) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "local";
  const identity = createHmac("sha256", token || "fullframe-local").update(ip).digest("hex");
  if (redisUrl && token) {
    const command = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
    const response = await fetch(redisUrl, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", command, 1, `fullframe:contact:${process.env.VERCEL_ENV || "local"}:${identity}`, windowSeconds]),
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Rate limit request failed");
    const { result } = await response.json();
    if (typeof result !== "number") throw new Error("Rate limit response invalid");
    return result <= limit;
  }
  const now = Date.now();
  for (const [key, entry] of localWindows) if (entry.expires <= now) localWindows.delete(key);
  const current = localWindows.get(identity) ?? { count: 0, expires: now + windowSeconds * 1000 };
  current.count += 1;
  localWindows.set(identity, current);
  return current.count <= limit;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const knownOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : "";
  if (origin && origin !== request.nextUrl.origin && origin !== knownOrigin) return reply(403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply(415);

  let payload: unknown;
  try { payload = await readBody(request); } catch { return reply(400); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return reply(400);
  const input = payload as Record<string, unknown>;
  if (typeof input.website === "string" && input.website.trim()) return reply(200);

  const lead = {} as Record<keyof typeof fields, string>;
  for (const key of Object.keys(fields) as (keyof typeof fields)[]) {
    const value = input[key] ?? "";
    if (typeof value !== "string" || value.length > fields[key]) return reply(400);
    lead[key] = value.trim();
  }
  const interests = input.interests ?? [];
  if (!Array.isArray(interests) || interests.length > services.length ||
      interests.some((name) => typeof name !== "string" || !serviceNames.has(name))) return reply(400);
  if (!lead.name || !lead.message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(lead.email)) return reply(400);
  if (lead.budget && !budgetOptions.has(lead.budget)) return reply(400);
  const tier = packages.find(({ id }) => id === lead.package);
  if ((lead.package || lead.billing || lead.currency) && (!tier ||
    !["monthly", "project"].includes(lead.billing) || !["NPR", "USD"].includes(lead.currency))) return reply(400);

  if (!contactReady()) return reply(503);
  try {
    if (!(await underLimit(request))) return reply(429, windowSeconds);
  } catch {
    return reply(503);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: lead.email,
        subject: tier ? `Fullframe website enquiry · ${tier.name}` : "Fullframe website enquiry",
        text: [
          `Name: ${lead.name}`, `Email: ${lead.email}`, `Phone: ${lead.phone || "—"}`, `Company: ${lead.company || "—"}`,
          `Website or social profile: ${lead.profile || "—"}`,
          `Services: ${[...new Set(interests)].join(", ") || "—"}`, `Budget: ${lead.budget || "—"}`,
          `Package: ${tier ? `${tier.name} / ${lead.billing} / ${lead.currency}` : "—"}`, "", lead.message,
        ].join("\n"),
      }),
    });
    return reply(response.ok ? 200 : 502);
  } catch {
    return reply(502);
  }
}
