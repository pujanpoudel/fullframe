import type { MetadataRoute } from "next";
import { posts, topics } from "@/content/blog";
import { services } from "@/content/site";
import { cases } from "@/content/work";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/services", "/work", "/packages", "/about", "/contact", "/privacy", "/blog",
    ...services.map(({ slug }) => `/services/${slug}`),
    ...cases.map(({ slug }) => `/work/${slug}`),
    ...Object.keys(topics).map((topic) => `/blog/topic/${topic}`),
  ];
  return [...paths.map((path) => ({ url: new URL(path, siteUrl).href })),
    ...posts.map(({ slug, published }) => ({ url: new URL(`/blog/${slug}`, siteUrl).href, lastModified: new Date(published) }))];
}
