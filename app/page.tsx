import type { Metadata } from "next";
import { Pricing } from "@/components/pricing";
import { FeaturedArticle } from "@/components/blog-sections";
import { Marquee } from "@/components/marquee";
import { ServiceRow } from "@/components/service-row";
import { Arrow, Count, Cta, Reveal } from "@/components/ui";
import { WorkList } from "@/components/work";
import { faqs } from "@/content/faq";
import { blogCopy } from "@/content/blog";
import { packages } from "@/content/packages";
import { formatIndex, services, site } from "@/content/site";
import { organizationId, serializeSchema } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" }, openGraph: { url: "/", type: "website", title: site.name, description: site.description, siteName: site.name } };

function SectionHeading({ label, title, copy, id }: { label: string; title: string; copy?: string; id: string }) {
  return <div className="section-heading">
    <p className="mono section-label">{label}</p>
    <h2 id={id}>{title}</h2>
    {copy && <p className="section-description muted">{copy}</p>}
  </div>;
}

function Hero() {
  const { hero } = site;
  return <>
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="mono eyebrow"><span className="signal" aria-hidden="true" />{hero.eyebrow}</p>
          <h1 id="hero-title">{hero.lines.map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="hero-description">{hero.copy}</p>
          <div className="hero-actions">
            <Cta href="#contact" variant="button" source="hero">{site.audit}</Cta>
            <Cta href="#packages" source="hero_packages">{hero.secondary}</Cta>
          </div>
        </div>
        <div className="frame-art" aria-hidden="true">
          <div className="frame-meta mono"><span><i />{hero.frameLabels[0]}</span><span>{hero.frameLabels[1]}</span></div>
          <div className="viewfinder">
            <i /><i /><i /><i />
            <span className="viewfinder-mark" />
          </div>
          <div className="frame-meta mono"><span>{hero.frameLabels[2]}</span><span>{hero.frameLabels[3]}</span></div>
        </div>
      </div>
    </section>
    <Marquee />
    <div className="container trust">
      <div className="stats">{site.stats.map(({ value, suffix, label }) => <div key={label}>
        <strong><Count value={value} suffix={suffix} /></strong><span className="mono muted">{label}</span>
      </div>)}</div>
      <div className="sample-brands"><span className="mono muted">{site.sampleLabel}</span>
        <ul>{site.sampleBrands.map((brand) => <li key={brand}>{brand}</li>)}</ul>
      </div>
    </div>
  </>;
}

export default function Home() {
  const schema = [
    ...services.map(({ name, outcome }) => ({
      "@context": "https://schema.org", "@type": "Service", name, description: outcome, provider: { "@id": organizationId },
    })),
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })) },
  ];
  return <main id="main">
    <Hero />
    <section id="services" className="section container" aria-labelledby="services-title">
      <Reveal><SectionHeading {...site.services} id="services-title" /></Reveal>
      <div className="service-list">{services.map((service, index) => <ServiceRow key={service.name}>
        <summary>
          <span className="mono muted">{formatIndex(index)}</span>
          <span className="service-name">{service.name}</span>
          <span className="service-outcome muted">{service.outcome}</span>
          <span className="service-arrow"><Arrow diagonal /></span>
        </summary>
        <div className="service-details">
          <ul>{service.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          <div><span className="mono muted">{site.services.included}</span>
            <div className="tags">{service.packages.map((id) => <a key={id} href={`#package-${id}`}>{packages.find((tier) => tier.id === id)?.name}</a>)}</div>
            <Cta href={`/services/${service.slug}`} source="home_to_service">{site.services.detail}</Cta>
          </div>
        </div>
      </ServiceRow>)}</div>
      <div className="section-action"><Cta href="/services" source="home_services">{site.services.directory}</Cta><Cta href="#packages" source="services">{site.services.cta}</Cta></div>
    </section>
    <section id="packages" className="section container" aria-labelledby="packages-title">
      <Reveal><SectionHeading {...site.pricing} id="packages-title" /></Reveal><Pricing />
    </section>
    <section id="work" className="section container" aria-labelledby="work-title">
      <Reveal><SectionHeading {...site.work} id="work-title" /></Reveal><WorkList />
      <div className="section-action"><Cta href="/work" source="home_work">{site.links.work}</Cta></div>
    </section>
    <section id="process" className="section container" aria-labelledby="process-title">
      <Reveal><SectionHeading {...site.process} id="process-title" /></Reveal>
      <ol className="process-list">{site.process.steps.map(([name, description], index) => <li key={name}>
        <span className="mono muted">{formatIndex(index)} / 04</span><h3>{name}</h3><p className="muted">{description}</p>
      </li>)}</ol>
      <div className="section-action"><Cta href="#contact" source="process">{site.process.cta}</Cta></div>
    </section>
    <section id="proof" className="section container" aria-labelledby="proof-title">
      <Reveal><SectionHeading {...site.proof} copy={site.proof.note} id="proof-title" /></Reveal>
      <div className="quotes">{site.proof.quotes.map(([quote, author]) => <figure key={author}>
        <blockquote>“{quote}”</blockquote><figcaption className="mono muted">{author}</figcaption>
      </figure>)}</div>
      <div className="section-action"><Cta href="#process" source="proof">{site.proof.cta}</Cta></div>
    </section>
    <section id="journal" className="section container" aria-labelledby="journal-title">
      <Reveal><SectionHeading label={blogCopy.label} title={blogCopy.title} copy={blogCopy.description} id="journal-title" /></Reveal>
      <FeaturedArticle />
      <div className="section-action"><Cta href="/blog" source="home_blog">{site.links.blog}</Cta></div>
    </section>
    <section id="faq" className="section container faq" aria-labelledby="faq-title">
      <Reveal><SectionHeading {...site.faq} id="faq-title" /></Reveal>
      <div className="faq-list">{faqs.map(({ question, answer }) => <details key={question}>
        <summary>{question}<span aria-hidden="true" /></summary><p className="muted">{answer}</p>
      </details>)}</div>
      <div className="section-action"><Cta href="#contact" source="faq">{site.faq.cta}</Cta></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }} />
  </main>;
}
