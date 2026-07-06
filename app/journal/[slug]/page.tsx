import { notFound } from "next/navigation";
import { journalEntries, findEntry } from "@/lib/collections";
import { ArticleView } from "@/components/article";

export function generateStaticParams() {
  return journalEntries.map((e) => ({ slug: e.slug }));
}

export default async function JournalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = findEntry("journal", slug);
  if (!entry) notFound();
  return <ArticleView entry={entry} />;
}
