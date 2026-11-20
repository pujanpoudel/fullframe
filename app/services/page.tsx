import Link from "next/link";
import { StudioProgramList } from "@/components/studio-program-list";
import { servicePageCopy as copy, servicePages } from "@/content/service-pages";
import { pageMetadata } from "@/lib/seo";

const path = "/services";
export const metadata = pageMetadata({ title: "Programs", description: copy.description, path });

export default function ServicesPage() {
  return <main id="main" className="studio-section studio-program-directory">
    <div className="studio-section-head"><h1>Programs</h1><p>{copy.description}</p></div>
    <StudioProgramList programs={servicePages.map(({ slug, name, outcome }) => ({ slug, name, description: outcome }))} />
    <div className="section-action"><Link className="studio-pill" href="/packages">Compare packages</Link></div>
  </main>;
}
