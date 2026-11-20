import Image from "next/image";
import { notFound } from "next/navigation";
import { AuditLink, Breadcrumbs, PageIntro } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { blogCopy, formatDate, posts, readingMinutes, topics } from "@/content/blog";
import { services, site } from "@/content/site";
import { organizationId, pageMetadata, serializeSchema, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => posts.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  return pageMetadata({ ...post, image: post.cover, path: `/blog/${slug}` });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const path = `/blog/${slug}`;
  const topicPath = `/blog/topic/${post.topic}`;
  const service = services.find(({ slug }) => slug === post.service);
  const others = posts.filter((item) => item.slug !== slug);
  const related = [...others.filter((item) => item.topic === post.topic), ...others.filter((item) => item.topic !== post.topic)].slice(0, 3);
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    "@id": new URL(path, siteUrl).href, mainEntityOfPage: new URL(path, siteUrl).href,
    headline: post.title, description: post.description, datePublished: post.published,
    author: { "@type": "Organization", name: post.author, url: new URL("/about", siteUrl).href },
    publisher: { "@id": organizationId },
    ...(post.cover ? { image: [new URL(post.cover.src, siteUrl).href] } : {}),
  };

  return <main id="main" className="container inner-page article-page">
    <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: topics[post.topic], path: topicPath }, { name: post.title, path }]} />
    <article>
      <PageIntro label={topics[post.topic]} title={post.title} description={post.description} />
      <div className="article-byline mono"><a href="/about">{post.author}</a><time dateTime={post.published}>{formatDate(post.published)}</time><span>{readingMinutes(post)} min read</span></div>
      {post.cover && <div className="article-cover journal-image">
        <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(max-width: 700px) 92vw, 1060px" />
      </div>}
      <div className="article-layout">
        <aside><nav aria-label={blogCopy.contents}>
          <p className="mono muted">{blogCopy.contents}</p>
          <ol>{post.sections.map(({ title }, index) => <li key={title}><a href={`#section-${index + 1}`}>{title}</a></li>)}</ol>
        </nav></aside>
        <div className="article-copy">
          {post.sections.map(({ title, paragraphs, checklist }, index) => <section key={title} id={`section-${index + 1}`}>
            <h2>{title}</h2>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {checklist && <ul className="scope-list">{checklist.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>)}
          {!!post.sources?.length && <section className="article-sources"><h2>{blogCopy.sources}</h2>
            <ul>{post.sources.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
          </section>}
        </div>
      </div>
    </article>
    <section className="inner-section related-links">
      <h2>{blogCopy.related}</h2>
      {related.map(({ slug, title }) => <Cta key={slug} href={`/blog/${slug}`} source="blog_related">{title}</Cta>)}
      {service && <Cta href={`/services/${service.slug}`} source="blog_to_service">{blogCopy.service} · {service.name}</Cta>}
      <AuditLink source="article" service={service?.slug}>{site.audit}</AuditLink>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }} />
  </main>;
}
