import { cookies } from "next/headers";
import { cookieName, createSession, equal, sameOrigin } from "@/lib/cms/auth";
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({error:"Invalid origin."},{status:403});
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) return Response.json({error:"Set ADMIN_PASSWORD to at least 16 characters on the server."},{status:503});
  // One administrator: a global attempt budget avoids trusting spoofable proxy headers.
  const key = "admin";
  const limit = attempts.get(key);
  if (limit && limit.until > Date.now() && limit.count >= 10) return Response.json({error:"Too many attempts. Try again in 15 minutes."},{status:429});
  let password: unknown;
  try { ({password} = await request.json()); } catch { return Response.json({error:"Invalid request."},{status:400}); }
  if (typeof password !== "string" || !equal(password,process.env.ADMIN_PASSWORD)) {
    attempts.set(key, {count: limit && limit.until > Date.now() ? limit.count + 1 : 1, until: limit && limit.until > Date.now() ? limit.until : Date.now()+900000});
    return Response.json({error:"Incorrect password."},{status:401});
  }
  attempts.delete(key);
  (await cookies()).set(cookieName,createSession(),{httpOnly:true,sameSite:"strict",secure:new URL(request.url).protocol === "https:",path:"/",maxAge:28800});
  return Response.json({ok:true});
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({error:"Invalid origin."},{status:403});
  (await cookies()).delete(cookieName); return Response.json({ok:true});
}
