"use client";
import { bi } from "@/lib/i18n";
import { storyEntries } from "@/lib/collections";
import { CollectionIndex } from "@/components/article";

export default function StoriesIndex() {
  return (
    <CollectionIndex
      accent="magenta"
      title={bi("Stories", "物語")}
      lead={bi(
        "What happened behind the screen — conversations, failures, and the strange detours that turned into something real.",
        "画面の裏で起きたこと — 会話、失敗、そして本物になった奇妙な寄り道。",
      )}
      entries={storyEntries}
    />
  );
}
