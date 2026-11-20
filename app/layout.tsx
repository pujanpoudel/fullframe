import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@/components/analytics";
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { site } from "@/content/site";
import { indexable, organization, serializeSchema, siteUrl } from "@/lib/seo";
import "./globals.css";

const syne = localFont({ src: "./fonts/syne.woff2", weight: "400 800", variable: "--font-display", display: "swap" });
const inter = localFont({ src: "./fonts/inter.woff2", weight: "100 900", variable: "--font-body", display: "swap" });
const mono = localFont({ src: "./fonts/jetbrains-mono.woff2", weight: "100 800", variable: "--font-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${site.name} — Creative & Growth Studio in Kathmandu`, template: `%s | ${site.name}` },
  description: site.description,
  robots: { index: indexable, follow: indexable },
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${syne.variable} ${inter.variable} ${mono.variable}`}>
    <body>
      <a className="skip-link" href="#main">{site.skip}</a>
      <Header />{children}<Contact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(organization) }} />
      <Analytics />
    </body>
  </html>;
}
