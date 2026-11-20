import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataDirectory } from "@/lib/cms/store";
export async function GET(request: Request, {params}: {params: Promise<{file:string}>}) {
  const {file} = await params;
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp|mp4)$/.test(file)) return new Response(null,{status:404});
  try {
    const data = await readFile(path.join(dataDirectory,"media",file));
    const type = file.endsWith("mp4") ? "video/mp4" : file.endsWith("jpg") ? "image/jpeg" : `image/${file.split(".").pop()}`;
    const headers = {"Content-Type":type,"Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff","Accept-Ranges":"bytes"};
    const range = request.headers.get("range");
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) return new Response(null,{status:416,headers:{"Content-Range":`bytes */${data.length}`}});
      const start = Number(match[1]), end = Math.min(match[2] ? Number(match[2]) : data.length-1,data.length-1);
      if (start > end || start >= data.length) return new Response(null,{status:416,headers:{"Content-Range":`bytes */${data.length}`}});
      return new Response(data.subarray(start,end+1),{status:206,headers:{...headers,"Content-Range":`bytes ${start}-${end}/${data.length}`,"Content-Length":String(end-start+1)}});
    }
    return new Response(data,{headers});
  } catch { return new Response(null,{status:404}); }
}
