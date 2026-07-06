"use client";
import { bi } from "@/lib/i18n";
import { diaryEntries } from "@/lib/collections";
import { DiaryTimeline } from "@/components/article";

export default function DiaryPage() {
  return (
    <DiaryTimeline
      title={bi("Dev Diary", "開発日記")}
      lead={bi(
        "A running log of what the lab did each day. Short, dated, honest — the trail of a lab that is never finished.",
        "ラボが毎日何をしたかの記録。短く、日付つき、正直に — 完成しないラボの軌跡。",
      )}
      entries={diaryEntries}
    />
  );
}
