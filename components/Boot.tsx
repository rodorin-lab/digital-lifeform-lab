"use client";

import { useEffect, useState } from "react";
import { useLang, bi, type Bi } from "@/lib/i18n";

// One-time entrance sequence (spec §00 / §15): types a short boot log once
// per session, then dissolves. Reduced motion / repeat visits skip it.
const BOOT: Bi[] = [
  bi("> booting DIGITAL LIFEFORM LAB…", "> DIGITAL LIFEFORM LAB を起動中…"),
  bi("> loading local core: SCORPION BRAIN …… OK", "> ローカルコア SCORPION BRAIN を読込 …… OK"),
  bi("> waking AI partner: SYNCHRO …… OK", "> AIパートナー SYNCHRO を起動 …… OK"),
  bi("> RODORIN × SYNCHRO linked …… OK", "> RODORIN × SYNCHRO 接続 …… OK"),
  bi("> status: BUILDING", "> ステータス: BUILDING"),
];

export default function Boot() {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("dll-booted") === "1";
    } catch { /* ignore */ }
    if (reduced || seen) {
      setDone(true);
      return;
    }
    try { sessionStorage.setItem("dll-booted", "1"); } catch { /* ignore */ }

    const timers: number[] = [];
    BOOT.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLine(i + 1), 360 * (i + 1)));
    });
    timers.push(window.setTimeout(() => setDone(true), 360 * BOOT.length + 600));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`boot ${done ? "done" : ""}`} aria-hidden={done}>
      <div className="wrap" style={{ maxWidth: 640 }}>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "var(--cyan)" }}>
          {BOOT.slice(0, line).map((b, i) => (
            <div key={i} style={{ marginBottom: 6, textShadow: "0 0 10px rgba(0,255,240,0.4)" }}>{t(b)}</div>
          ))}
          <span className="blink" style={{ color: "var(--cyan)" }}>█</span>
        </div>
      </div>
    </div>
  );
}
