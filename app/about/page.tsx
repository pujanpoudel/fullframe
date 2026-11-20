import { AuditLink, Breadcrumbs, FeatureList, PageIntro } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { pages } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const copy = pages.about;
const path = "/about";
export const metadata = pageMetadata({ title: copy.label, description: copy.description, path });

export default function AboutPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.label, path }]} />
    <PageIntro label={copy.label} title={copy.title} description={copy.description}>
      <AuditLink source="about" />
      <Cta href="/work" source="about_to_work">{site.links.work}</Cta>
    </PageIntro>
    <p className="inner-callout">{copy.intro}</p>
    <FeatureList title={copy.audienceTitle} items={copy.audience} />
    <FeatureList title={copy.stepsTitle} items={site.process.steps.map((step) => [...step])} />
  </main>;
}
