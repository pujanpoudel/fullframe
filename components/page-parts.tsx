import type { ReactNode } from "react";
import { Cta } from "./ui";
import { site } from "@/content/site";
import { breadcrumbSchema, serializeSchema } from "@/lib/seo";

type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: site.links.home, path: "/" }, ...items];
  return <>
    <nav className="breadcrumbs mono" aria-label="Breadcrumb">
      <ol>{trail.map(({ name, path }, index) => <li key={path}>
        {index === trail.length - 1 ? <span aria-current="page">{name}</span> : <a href={path}>{name}</a>}
      </li>)}</ol>
    </nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema(trail)) }} />
  </>;
}

export function PageIntro({ title, label, description, children }: { title: string; label: string; description: string; children?: ReactNode }) {
  return <header className="inner-intro">
    <p className="mono eyebrow"><span className="signal" aria-hidden="true" />{label}</p>
    <h1>{title}</h1>
    <p className="inner-lede muted">{description}</p>
    {children && <div className="hero-actions">{children}</div>}
  </header>;
}

export function AuditLink({ source, service, children = site.audit }: { source: string; service?: string; children?: ReactNode }) {
  return <Cta href={service ? `/contact?service=${service}#contact` : "#contact"} variant="button" source={source}>{children}</Cta>;
}

export function FeatureList({ title, items }: { title: string; items: string[][] }) {
  return <section className="inner-section">
    <h2>{title}</h2>
    <dl className="feature-list">{items.map(([name, description]) => <div key={name}><dt>{name}</dt><dd className="muted">{description}</dd></div>)}</dl>
  </section>;
}
