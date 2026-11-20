import { AuditLink, Breadcrumbs, PageIntro } from "@/components/page-parts";
import { WorkList } from "@/components/work";
import { pages } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const copy = pages.work;
const path = "/work";
export const metadata = pageMetadata({ title: copy.label, description: copy.description, path });

export default function WorkPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: copy.label, path }]} />
    <PageIntro label={copy.label} title={copy.title} description={site.work.copy}><AuditLink source="work_index" /></PageIntro>
    <WorkList />
  </main>;
}
