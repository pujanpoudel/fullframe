import { AuditLink, Breadcrumbs, PageIntro } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { servicePageCopy as copy, servicePages } from "@/content/service-pages";
import { formatIndex, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const path = "/services";
export const metadata = pageMetadata({ title: copy.title, description: copy.description, path });

export default function ServicesPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.title, path }]} />
    <PageIntro label={copy.title} title={copy.directoryHeading} description={copy.description}>
      <AuditLink source="services_directory" />
      <Cta href="/packages" source="services_packages">{site.hero.secondary}</Cta>
    </PageIntro>
    <div className="directory">
      {servicePages.map(({ slug, name, outcome, details }, index) => <article key={slug} className="directory-row">
        <span className="mono muted">{formatIndex(index)}</span>
        <div><h2><a href={`/services/${slug}`}>{name}</a></h2><p className="muted">{outcome}</p></div>
        <ul>{details.map((item) => <li key={item}>{item}</li>)}</ul>
        <Cta href={`/services/${slug}`} source="service_directory">{site.services.detail}<span className="sr-only"> · {name}</span></Cta>
      </article>)}
    </div>
  </main>;
}
