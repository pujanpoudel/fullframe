# Fullframe Studio

A full-service digital marketing agency website for a Kathmandu creative and growth studio. It uses the Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and variable fonts served locally through `next/font`.

## Run locally

Use Node.js 22 or newer. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Open http://localhost:3000. Use `pnpm check` for TypeScript and `pnpm build` for a production build.

## Site map

- /services and /services/[slug] for the directory and individual service scopes.
- /work and /work/[slug] for the concept portfolio and case studies.
- /packages for retainer and project scopes in NPR or USD.
- /about and /contact for the studio, engagement process and project enquiries.
- /blog, /blog/topic/[topic] and /blog/[slug] for articles, topic archives and search. /feed.xml is the RSS feed.
- /privacy for a description of enquiry data and optional analytics.

## Edit the site

| Change | File |
| --- | --- |
| Navigation, homepage copy, service scopes, stats, testimonials and social links | `content/site.ts` |
| Dedicated service-page descriptions, deliverables and FAQs | `content/service-pages.ts` |
| About, contact, portfolio and privacy page copy | `content/pages.ts` |
| Blog posts, topic labels and sources | `content/blog.ts` |
| Package scopes and NPR/USD prices for both billing options | `content/packages.ts` |
| Service questions and answers | `content/faq.ts` |
| Work pages and gallery/video references | `content/work/cases.json` |
| Accent, theme colors and layout spacing | `app/globals.css` |
| Wordmark and monogram | `public/wordmark.svg` and `public/monogram.svg` |

Change `--accent` once in `app/globals.css` and check text contrast against `--on-accent`. The viewfinder inherits the same accent. The site uses a light palette and respects the visitor’s reduced-motion preference.

NPR is the default for every visitor. A manual currency selection is remembered in that browser. NPR and USD are independently editable price lists so neither moves with exchange rates. Set a scope’s `prices` to `null` for custom pricing. Billing and currency are included in package enquiries.

### Publish a blog post

1. Add an entry to `content/blog.ts` with a unique slug, topic, title, description, author, timezone-aware publication date, related service and article sections.
2. Link to relevant sources and add an optional optimized cover in `public/` with alt text. Keep the featured article first in the list.
3. Run `pnpm build` to update the article page, category archive, RSS, sitemap and social metadata.

The blog is edited in source and published on rebuild. It does not require a CMS account or database.

### Add a case study

1. Add optimized artwork to `public/work/`.
2. Copy an entry in `content/work/cases.json`. Assign a unique URL-safe `slug` and add the client, headline, image path, image alt text, services, challenge, solution and results. The first result appears in the homepage list.
3. Optionally add `"gallery": [{"src": "/work/detail.webp", "alt": "..."}]` or `"video": {"src": "/work/film.mp4", "captions": "/work/film.vtt"}`. The lead image is the video poster. Video loads after a visitor chooses to load it. Supply captions for spoken content.
4. Rebuild to generate the case route, metadata and sitemap entry. Change the concept and target labels in `content/site.ts` when replacing the demo portfolio with published client work.

## Enquiries and deployment

Copy `.env.example` to `.env.local` for local setup. Add the same values to your Vercel project's environments. Import this folder with the Next.js preset and set the root directory to this folder if it lives in a larger repository.

- Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin for canonical URLs and indexing. Vercel Preview is set to noindex.
- Configure the three Resend variables in `.env.example`. The sender must use a verified domain. Each email includes a visitor reply-to address. Without delivery settings, the site shows an unavailable state for the form.
- Configure the Upstash Redis URL and token for Vercel production. The API requires them in production so the five-requests-per-ten-minutes quota works across function instances. Local development can use an in-memory limiter. Separate Vercel environments have separate limits.
- Add your public email and WhatsApp number to enable the alternate contact paths. Add social profile URLs in `content/site.ts`.
- GA4 and Meta Pixel require their respective IDs and the visitor's opt-in. Visitors can reopen Analytics preferences from the footer. `lib/analytics.ts` handles CTA, package and successful enquiry events without sending contact fields to either vendor. Review the privacy notice and provider settings for your deployment before enabling tracking.
- The prices, work and quotes are illustrative. Replace them with approved pricing, portfolio material and testimonials before going live.
- Run a mobile Lighthouse audit on the deployed URL and test a real lead through Resend and Redis. Verify the analytics events if you enable either tracker.

## Research behind the site

- Digital Terai provides a local benchmark for pairing specialized service pages with educational content. [Digital Terai](https://digitalterai.com/)
- WebFX makes its lead-generation offer prominent. Fullframe uses the free audit as the main action and carries the visitor’s service or package choice into the enquiry. [WebFX](https://www.webfx.com/)
- Siege Media gives readers topic archives and article search. The Fullframe journal uses both and links readers to relevant services. [Siege Media](https://www.siegemedia.com/strategy)
- Google’s search documentation informed the crawlable internal links, useful headings and article metadata. [Search Essentials](https://developers.google.com/search/docs/essentials) · [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)

[Next.js metadata documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) · [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi)
