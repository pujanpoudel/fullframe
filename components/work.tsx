import Image from "next/image";
import { cases } from "@/content/work";
import { formatIndex, site } from "@/content/site";
import { Arrow, Cta } from "./ui";

export function WorkImage({ entry, priority = false, sizes }: { entry: (typeof cases)[number]; priority?: boolean; sizes: string }) {
  return <div className={`work-image work-image-${entry.slug}`}>
    <Image src={entry.image} alt={entry.alt} fill preload={priority} sizes={sizes} />
  </div>;
}

export function WorkList() {
  return <>
    {cases.map((entry, index) => <article className="work-row" key={entry.slug}>
      <a href={`/work/${entry.slug}`} className="work-thumb" aria-label={`${site.work.visit} · ${entry.client}`}>
        <WorkImage entry={entry} sizes="(max-width: 700px) 94vw, 54vw" />
      </a>
      <div className="work-details">
        <p className="mono muted">{formatIndex(index)} / {site.work.concept}</p>
        <h3>{entry.client}</h3>
        <ul className="work-tags">{entry.services.map((service) => <li key={service}>{service}</li>)}</ul>
        <p className="work-result"><strong>{entry.results[0].value}</strong><span>{entry.results[0].label}</span></p>
        <a href={`/work/${entry.slug}`} className="cta cta-text">{site.work.visit}<Arrow diagonal /></a>
      </div>
    </article>)}
    <div className="section-action"><Cta href="#contact" source="selected_work">{site.work.cta}</Cta></div>
  </>;
}
