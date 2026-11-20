import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { ProjectVideo } from "@/components/project-video";
import { WorkImage } from "@/components/work";
import { cases } from "@/content/work";
import { services, site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => cases.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = cases.find((item) => item.slug === slug);
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
  const entry = cases.find((item) => item.slug === slug);
  if (!entry) notFound();
  const copy = site.work;
  return <main id="main" className="container case-page">
    <Breadcrumbs items={[{ name: "Work", path: "/work" }, { name: entry.client, path: `/work/${entry.slug}` }]} />
    <p className="mono section-label">{copy.concept} / {entry.client}</p>
    <h1>{entry.headline}</h1>
    <ul className="work-tags">{entry.services.map((name) => {
      const service = services.find((item) => item.name === name);
      return <li key={name}>{service ? <a href={`/services/${service.slug}`}>{name}</a> : name}</li>;
    })}</ul>
    <WorkImage entry={entry} priority sizes="(max-width: 1424px) 94vw, 1320px" />
    <div className="case-copy">
      <section><h2>{copy.challenge}</h2><p>{entry.challenge}</p></section>
      <section><h2>{copy.solution}</h2><p>{entry.solution}</p></section>
    </div>
    <section className="case-results"><h2>{copy.results}</h2><dl>{entry.results.map(({ label, value }) => <div key={label}>
      <dt className="mono muted">{label}</dt><dd>{value}</dd>
    </div>)}</dl></section>
    {(entry.gallery?.length || entry.video) ? <section className="case-media">
      <h2>{copy.gallery}</h2>
      {entry.gallery?.map(({ src, alt }) => <div className="work-image" key={src}><Image src={src} alt={alt} fill sizes="94vw" /></div>)}
      {entry.video && <ProjectVideo {...entry.video} poster={entry.image} />}
    </section> : null}
    <div className="section-action"><Cta href="#contact" variant="button" source="case_contact">{copy.cta}</Cta></div>
  </main>;
}
