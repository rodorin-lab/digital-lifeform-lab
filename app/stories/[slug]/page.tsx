import { notFound } from "next/navigation";
import { storyEntries, findEntry } from "@/lib/collections";
import { ArticleView } from "@/components/article";

export function generateStaticParams() {
  return storyEntries.map((e) => ({ slug: e.slug }));
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = findEntry("story", slug);
  if (!entry) notFound();
  return <ArticleView entry={entry} />;
}
