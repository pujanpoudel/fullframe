import { AuditLink, Breadcrumbs, FeatureList, PageIntro } from "@/components/page-parts";
import { pages } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

import { Contact } from "@/components/contact";

const copy = pages.contact;
const path = "/contact";
export const metadata = pageMetadata({ title: copy.label, description: copy.description, path });

export default function ContactPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.label, path }]} />
    <PageIntro label={copy.label} title={copy.title} description={copy.description}><AuditLink source="contact_intro" /></PageIntro>
    <FeatureList title={copy.nextTitle} items={copy.steps} /><Contact />
  </main>;
}
