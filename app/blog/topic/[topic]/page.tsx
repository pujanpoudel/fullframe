import { notFound } from "next/navigation";
import { ArticleArchive } from "@/components/blog-sections";
import { Breadcrumbs, PageIntro } from "@/components/page-parts";
import { blogCopy, topics, type Topic } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ topic: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(topics).map((topic) => ({ topic }));

function getTopic(value: string): Topic {
  if (!Object.hasOwn(topics, value)) notFound();
  return value as Topic;
}

export async function generateMetadata({ params }: Props) {
  const topic = getTopic((await params).topic);
  return pageMetadata({ title: `${topics[topic]} articles`, description: `Read Fullframe Studio’s ${topics[topic].toLowerCase()} guides and checklists.`, path: `/blog/topic/${topic}` });
}

export default async function TopicPage({ params }: Props) {
  const topic = getTopic((await params).topic);
  const name = topics[topic];
  const path = `/blog/topic/${topic}`;
  return <main id="main" className="container inner-page">
    <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name, path }]} />
    <PageIntro label={blogCopy.label} title={name} description={blogCopy.description} />
    <ArticleArchive topic={topic} />
  </main>;
}
