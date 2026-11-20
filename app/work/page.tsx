import { StudioProjects } from "@/components/studio-home";
import { readContent } from "@/lib/cms/store";
export const dynamic = "force-dynamic";
export const metadata = {title:"Projects",description:"Photography, films and creative worlds by Fullframe Studio."};
export default async function WorkPage() {
  const content = await readContent();
  return <main id="main" className="studio-section studio-work-index"><div className="studio-section-head"><h1>Case Studies</h1><p>{content.projectsTitle}</p></div><StudioProjects projects={content.projects}/></main>;
}
