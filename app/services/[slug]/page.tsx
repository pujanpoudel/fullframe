import { notFound } from "next/navigation";
import { AuditLink, Breadcrumbs, FeatureList, PageIntro } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { posts, blogCopy } from "@/content/blog";
import { packages } from "@/content/packages";
import { servicePageCopy as copy, servicePages } from "@/content/service-pages";
import { site } from "@/content/site";
import { cases } from "@/content/work";
import { organizationId, pageMetadata, serializeSchema, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => servicePages.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) notFound();
  return pageMetadata({ title: service.name, description: service.intro, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) notFound();
  const article = posts.find((post) => post.service === slug);
  const work = cases.find((entry) => entry.services.includes(service.name));
  const packageIds: readonly string[] = service.packages;
  const path = `/services/${slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Service", name: service.name,
    description: service.intro, url: new URL(path, siteUrl).href, provider: { "@id": organizationId } };

  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.back, path: "/services" }, { name: service.name, path }]} />
    <PageIntro label={copy.title} title={service.name} description={service.intro}>
      <AuditLink source="service_detail" service={slug}>{copy.audit}</AuditLink>
      <Cta href="/packages" source="service_packages">{site.hero.secondary}</Cta>
    </PageIntro>
    <div className="inner-section detail-columns">
      <section><h2>{copy.scope}</h2><ul className="scope-list">{service.details.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>{site.services.included}</h2><div className="tags">
        {packages.filter(({ id }) => packageIds.includes(id)).map(({ id, name }) => <a href={`/packages#package-${id}`} key={id}>{name}</a>)}
      </div></section>
    </div>
    <FeatureList title={copy.fitTitle} items={[[copy.fit, service.audience], [copy.measurement, service.measure]]} />
    <section className="inner-section">
      <h2>{copy.questions}</h2>
      <div className="faq-list"><details><summary>{service.faq[0]}<span aria-hidden="true" /></summary><p className="muted">{service.faq[1]}</p></details></div>
    </section>
    <section className="inner-section related-links">
      <h2>{copy.relevant}</h2>
      {work && <Cta href={`/work/${work.slug}`} source="service_to_work">{copy.examples} · {work.client}</Cta>}
      {article && <Cta href={`/blog/${article.slug}`} source="service_to_blog">{article.title}</Cta>}
      {!article && <Cta href="/blog" source="service_to_blog">{blogCopy.title}</Cta>}
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }} />
  </main>;
}
