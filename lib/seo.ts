import { site } from "@/content/site";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
export const indexable = Boolean(process.env.NEXT_PUBLIC_SITE_URL) &&
  (process.env.VERCEL_ENV === "production" || (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production"));

export const organizationId = new URL("#organization", siteUrl).toString();
export const organization = {
  "@context": "https://schema.org", "@type": ["Organization", "LocalBusiness"],
  "@id": organizationId, name: site.name, description: site.description,
  url: siteUrl.toString(), logo: new URL("/wordmark.svg", siteUrl).toString(),
  address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
};

export function serializeSchema(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function pageMetadata({ title, description, path, image, published, author }: {
  title: string; description: string; path: string; image?: { src: string; alt: string }; published?: string; author?: string;
}): import("next").Metadata {
  const shared = { title: `${title} | ${site.name}`, description, url: path, siteName: site.name,
    ...(image ? { images: [{ url: image.src, alt: image.alt }] } : { images: [{ url: "/opengraph-image", alt: site.name }] }) };
  return { title, description, alternates: { canonical: path },
    openGraph: published ? { ...shared, type: "article", publishedTime: published, authors: author ? [new URL("/about", siteUrl).href] : undefined } : { ...shared, type: "website" },
    twitter: { card: "summary_large_image", title: shared.title, description, images: shared.images.map(({ url }) => url) },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem", position: index + 1, name, item: new URL(path, siteUrl).href,
    })),
  };
}
