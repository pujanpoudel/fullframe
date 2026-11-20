import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const cookieName = "fullframe_admin";
export { cookieName };
function secret() { return process.env.ADMIN_PASSWORD || ""; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("hex"); }
export function equal(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x,y); }
export function createSession() { const expires = String(Date.now() + 8 * 60 * 60 * 1000); return `${expires}.${sign(expires)}`; }
export async function isAdmin() {
  if (secret().length < 16) return false;
  const token = (await cookies()).get(cookieName)?.value || "";
  const [expires, signature] = token.split(".");
  return !!signature && Number(expires) > Date.now() && equal(signature, sign(expires));
}
export function sameOrigin(request: Request) { return request.headers.get("origin") === new URL(request.url).origin; }
