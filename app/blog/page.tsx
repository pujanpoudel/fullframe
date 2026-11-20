import { ArticleArchive, FeaturedArticle } from "@/components/blog-sections";
import { Breadcrumbs, PageIntro } from "@/components/page-parts";
import { Cta } from "@/components/ui";
import { blogCopy } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

const path = "/blog";
export const metadata = { ...pageMetadata({ title: "Blog", description: blogCopy.description, path }),
  alternates: { canonical: path, types: { "application/rss+xml": "/feed.xml" } } };

export default function BlogPage() {
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: "Blog", path }]} />
    <PageIntro label={blogCopy.label} title={blogCopy.title} description={blogCopy.description}>
      <Cta href="#articles" source="blog_archive">{blogCopy.archive}</Cta>
      <Cta href="/feed.xml" source="blog_rss">{blogCopy.feed}</Cta>
    </PageIntro>
    <FeaturedArticle />
    <ArticleArchive />
  </main>;
}
