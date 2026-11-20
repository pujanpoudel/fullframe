import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../.reference-site/", import.meta.url));
const port = Number(process.env.REFERENCE_PORT || 3100);
const studioOrigin = process.env.FULLFRAME_STUDIO_ORIGIN || "http://localhost:3000";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
};
const policy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.mux.com",
  "media-src 'self' data: blob: https://*.mux.com",
  "connect-src 'self' https://*.mux.com https://*.sanity.io",
  "frame-src https://*.mux.com",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "form-action 'none'",
  "base-uri 'self'",
].join("; ");

const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8").catch(error => {
  if (error.code === "ENOENT") throw new Error("Run python3 scripts/sync-reference.py before starting the reference preview.");
  throw error;
}));
const pages = new Set(manifest.pages);
const assets = new Set(manifest.assets.map(decodeURIComponent));

http.createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  if (pathname === "/admin" || pathname === "/admin/") {
    response.writeHead(302, { Location: new URL("/admin", studioOrigin).href }).end();
    return;
  }
  const page = pathname.replace(/\/+$/, "") || "/";
  const relative = pages.has(page)
    ? `pages${page === "/" ? "" : page}/index.html`
    : assets.has(pathname) ? `assets${pathname}` : "";
  const file = path.resolve(root, relative);
  if (!relative || !file.startsWith(root)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("This URL was not in the public reference capture.");
    return;
  }
  try {
    const info = await stat(file);
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Content-Length": info.size,
      "Content-Security-Policy": policy,
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).on("error", () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Public reference preview: http://127.0.0.1:${port} (${pages.size} pages, ${assets.size} local assets)`);
  console.log(`Fullframe admin: ${studioOrigin}/admin`);
});
