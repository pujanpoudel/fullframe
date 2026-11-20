import { ArticleArchive } from "@/components/blog-sections";
import { StudioStories } from "@/components/studio-home";
import { blogCopy } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

const path = "/blog";
export const metadata = { ...pageMetadata({ title: "Blog", description: blogCopy.description, path }),
  alternates: { canonical: path, types: { "application/rss+xml": "/feed.xml" } } };

export default function BlogPage() {
  return <main id="main" className="container inner-page">
    <StudioStories directory />
    <h1 className="studio-directory-title">Journal</h1>
    <ArticleArchive />
  </main>;
}
