import { mkdir, writeFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isAdmin, sameOrigin } from "@/lib/cms/auth";
import { dataDirectory } from "@/lib/cms/store";
export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return Response.json({error:"Sign in required."},{status:401});
  if (Number(request.headers.get("content-length")) > 52 * 1024 * 1024) return Response.json({error:"Maximum upload size is 50 MB."},{status:413});
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File) || !file.size || file.size > 50 * 1024 * 1024) return Response.json({error:"Choose a file under 50 MB."},{status:400});
    const bytes = Buffer.from(await file.arrayBuffer());
    let extension = "";
    if (bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) extension = "jpg";
    else if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = "png";
    else if (bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP") extension = "webp";
    else if (bytes.toString("ascii",4,8) === "ftyp") extension = "mp4";
    if (!extension) return Response.json({error:"Use JPG, PNG, WebP or MP4 files."},{status:400});
    const name = `${randomUUID()}.${extension}`;
    await mkdir(path.join(dataDirectory,"media"),{recursive:true});
    await writeFile(path.join(dataDirectory,"media",name),bytes);
    return Response.json({src:`/media/${name}`,type:extension === "mp4" ? "video" : "image"});
  } catch { return Response.json({error:"Upload failed. Please try again."},{status:500}); }
}

export async function GET() {
  if (!await isAdmin()) return Response.json({error:"Sign in required."},{status:401});
  try { const files = await readdir(path.join(dataDirectory,"media")); return Response.json(files.filter(f=>/^[a-f0-9-]{36}\.(jpg|png|webp|mp4)$/.test(f)).map(f=>`/media/${f}`),{headers:{"Cache-Control":"no-store"}}); }
  catch { return Response.json([]); }
}
