import { isAdmin, sameOrigin } from "@/lib/cms/auth";
import { readContent, writeContent } from "@/lib/cms/store";
import { validateContent } from "@/lib/cms/model";
export async function GET() {
  if (!await isAdmin()) return Response.json({error:"Sign in required."},{status:401});
  return Response.json(await readContent("draft"),{headers:{"Cache-Control":"no-store"}});
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return Response.json({error:"Sign in required."},{status:401});
  try {
    const raw = await request.text();
    if (raw.length > 1000000) return Response.json({error:"Content is too large."},{status:413});
    const {content,publish} = JSON.parse(raw);
    if (!validateContent(content)) return Response.json({error:"Check project slugs, required fields and media paths. Each slug must be unique."},{status:400});
    await writeContent(content,"draft");
    if (publish === true) await writeContent(content,"published");
    return Response.json({ok:true});
  } catch { return Response.json({error:"Unable to save. Check the server storage and try again."},{status:500}); }
}
