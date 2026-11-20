import { PageIntro } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { pages } from "@/content/pages";
import { site } from "@/content/site";

export default function NotFound() {
  return <main id="main" className="container inner-page">
    <PageIntro {...pages.missing}>
      <Cta href="/" variant="button" source="missing_home">{site.links.home}</Cta>
      <Cta href="/services" source="missing_services">{site.services.directory}</Cta>
    </PageIntro>
  </main>;
}
