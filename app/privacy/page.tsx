import { Breadcrumbs, FeatureList, PageIntro } from "@/components/page-parts";
import { pages } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

const copy = pages.privacy;
const path = "/privacy";
export const metadata = pageMetadata({ title: copy.label, description: copy.description, path });

export default function PrivacyPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.label, path }]} />
    <PageIntro label={copy.label} title={copy.title} description={copy.description} />
    <FeatureList title={copy.label} items={copy.sections} />
  </main>;
}
