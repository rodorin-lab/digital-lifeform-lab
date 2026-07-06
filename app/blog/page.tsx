"use client";
import { bi } from "@/lib/i18n";
import { blogEntries } from "@/lib/collections";
import { CollectionIndex } from "@/components/article";

export default function BlogIndex() {
  return (
    <CollectionIndex
      accent="magenta"
      title={bi("Blog", "ブログ")}
      lead={bi(
        "Less structured than the journal — thoughts on design, cyberpunk, building with a companion, and whatever else is on my mind.",
        "ログよりゆるく — デザイン、サイバーパンク、相棒とのものづくり、その時考えていることの雑記。",
      )}
      entries={blogEntries}
    />
  );
}
