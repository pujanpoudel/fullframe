import { AuditLink, Breadcrumbs, FeatureList, PageIntro } from "@/components/page-parts";
import { Pricing } from "@/components/pricing";
import { pages } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

const copy = pages.packages;
const path = "/packages";
export const metadata = pageMetadata({ title: copy.label, description: copy.description, path });

export default function PackagesPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.label, path }]} />
    <PageIntro label={copy.label} title={copy.title} description={copy.description}><AuditLink source="packages_page" /></PageIntro>
    <Pricing />
    <FeatureList title={copy.notesTitle} items={copy.notes} />
  </main>;
}
