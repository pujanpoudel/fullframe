import type { MetadataRoute } from "next";
import { posts, topics } from "@/content/blog";
import { services } from "@/content/site";
import { readContent } from "@/lib/cms/store";
export const dynamic = "force-dynamic";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = (await readContent()).projects.filter(p => p.published);
  const paths = [
    "/", "/services", "/work", "/packages", "/about", "/contact", "/privacy", "/blog",
    ...services.map(({ slug }) => `/services/${slug}`),
    ...cases.map(({ slug }) => `/work/${slug}`),
    ...Object.keys(topics).map((topic) => `/blog/topic/${topic}`),
  ];
  return [...paths.map((path) => ({ url: new URL(path, siteUrl).href })),
    ...posts.map(({ slug, published }) => ({ url: new URL(`/blog/${slug}`, siteUrl).href, lastModified: new Date(published) }))];
}
