"use client";
import { bi } from "@/lib/i18n";
import { journalEntries } from "@/lib/collections";
import { CollectionIndex } from "@/components/article";

export default function JournalIndex() {
  return (
    <CollectionIndex
      accent="cyan"
      title={bi("Journal", "ログ")}
      lead={bi(
        "What we learned. When we build things, more goes wrong than right — so we keep the takeaways, and maybe help someone move a little faster.",
        "学んだこと。作っているとうまくいかないことの方が多い — だから教訓を残す。誰かが少しだけ早く進めるように。",
      )}
      entries={journalEntries}
    />
  );
}
