import { notFound } from "next/navigation";
import { blogEntries, findEntry } from "@/lib/collections";
import { ArticleView } from "@/components/article";

export function generateStaticParams() {
  return blogEntries.map((e) => ({ slug: e.slug }));
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = findEntry("blog", slug);
  if (!entry) notFound();
  return <ArticleView entry={entry} />;
}
