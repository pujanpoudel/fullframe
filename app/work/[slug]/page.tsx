import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cta } from "@/components/ui";
import { StudioCaseGallery } from "@/components/studio-case-gallery";
import { readContent } from "@/lib/cms/store";
import { services, site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = (await readContent()).projects.find((item) => item.slug === slug && item.published);
  if (!entry) notFound();
  const path = `/work/${entry.slug}`;
  return {
    title: entry.client, description: entry.headline, alternates: { canonical: path },
    openGraph: { url: path, title: `${entry.client} | ${site.name}`, description: entry.headline,
      images: [{ url: entry.image, alt: entry.alt }] },
    twitter: { card: "summary_large_image", images: [entry.image] },
  };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const entry = (await readContent()).projects.find((item) => item.slug === slug && item.published);
  if (!entry) notFound();
  const copy = site.work;
  return <main id="main" className="studio-case-detail">
    <hgroup className="studio-detail-title">
      <p>Concept case study</p>
      <h1>{entry.client}</h1>
      <p>{entry.headline}</p>
    </hgroup>
    <StudioCaseGallery project={entry} />
    <div className="studio-case-editorial">
      <div>
        <h2>Programs</h2>
        <ul>{entry.services.map(name => {
          const service = services.find(item => item.name === name);
          return <li key={name}>{service ? <a href={`/services/${service.slug}`}>{name}</a> : name}</li>;
        })}</ul>
      </div>
      <div>
        <p>{entry.challenge}</p>
        <details>
          <summary>Read the full story</summary>
          <p>{entry.solution}</p>
        </details>
      </div>
    </div>
    {entry.results.length > 0 && <section className="case-results studio-case-results">
      <h2>{copy.results}</h2>
      <dl>{entry.results.map(({ label, value }, index) => <div key={index}>
        <dt>{label}</dt><dd>{value}</dd>
      </div>)}</dl>
    </section>}
    <div className="studio-section"><Cta href="/contact#contact" variant="button" source="case_contact">{copy.cta}</Cta></div>
  </main>;
}
