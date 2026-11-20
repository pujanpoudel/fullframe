import { blogCopy, posts } from "@/content/blog";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET() {
  const blogUrl = new URL("/blog", siteUrl).href;
  const feedUrl = new URL("/feed.xml", siteUrl).href;
  const items = posts.map((post) => {
    const url = xml(new URL(`/blog/${post.slug}`, siteUrl).href);
    return `<item><title>${xml(post.title)}</title><link>${url}</link><guid>${url}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.published).toUTCString()}</pubDate></item>`;
  }).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(site.name)} Blog</title><link>${xml(blogUrl)}</link><description>${xml(blogCopy.description)}</description><language>en</language><atom:link href="${xml(feedUrl)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
