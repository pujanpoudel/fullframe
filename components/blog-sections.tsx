import Image from "next/image";
import { blogCopy, formatDate, posts, readingMinutes, topics, type Topic } from "@/content/blog";
import { BlogIndex } from "./blog-index";
import { Cta } from "./ui";

export function FeaturedArticle() {
  const post = posts[0];
  return <article className="journal-feature">
    {post.cover && <div className="journal-image">
      <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(max-width: 700px) 92vw, 48vw" />
    </div>}
    <div className="journal-feature-body">
      <p className="mono muted">{blogCopy.featured} / {topics[post.topic]} / {readingMinutes(post)} min read</p>
      <h2>{post.title}</h2>
      <p className="muted">{post.description}</p>
      <Cta href={`/blog/${post.slug}`} source="featured_article">{blogCopy.read}</Cta>
    </div>
  </article>;
}

export function ArticleArchive({ topic }: { topic?: Topic }) {
  const entries = posts.filter((post) => !topic || post.topic === topic).map((post) => ({
    slug: post.slug, title: post.title, description: post.description, topic: topics[post.topic],
    date: formatDate(post.published), published: post.published, minutes: readingMinutes(post),
  }));

  return <section className="inner-section" id="articles">
    <h2>{topic ? topics[topic] : blogCopy.archive}</h2>
    <nav className="topic-nav" aria-label={blogCopy.topic}>
      <a href="/blog#articles" aria-current={!topic ? "page" : undefined}>{blogCopy.archive}</a>
      {Object.entries(topics).map(([key, label]) => <a key={key} href={`/blog/topic/${key}#articles`} aria-current={key === topic ? "page" : undefined}>{label}</a>)}
    </nav>
    <BlogIndex entries={entries} copy={blogCopy} />
  </section>;
}
