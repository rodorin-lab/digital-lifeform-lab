"use client";

import { useEffect, useState } from "react";
import { useLang, bi, type Bi } from "@/lib/i18n";

const BOOT: Bi[] = [
  bi("> initializing HOLOVERSE // LIVING PORTAL v3.0…", "> HOLOVERSE // LIVING PORTAL v3.0 を起動中…"),
  bi("> awakening NOVA CORTEX (0.01s NVMe Hot-Boot) …… OK", "> 脳エンジン NOVA CORTEX (0.01秒 NVMe覚醒) …… OK"),
  bi("> linking SCORPION BRAIN & SYNCHRO …… OK", "> SCORPION BRAIN & SYNCHRO 接続 …… OK"),
  bi("> calibrating STARGATE [QUEST 3 / WEBXR / PC / MOBILE] …… OK", "> スターゲイト空間補正 [QUEST 3 / WEBXR / PC / スマホ] …… OK"),
  bi(">Beyond Games. Beyond Worlds. Welcome, Traveler.", "> ゲームを超え、世界を超え、共に創造する宇宙へ。"),
];

export default function Boot() {
  const { t, mode } = useLang();
  const [done, setDone] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("holoverse-booted") === "1";
    } catch {
      /* ignore */
    }
    if (reduced || seen || mode === "lite") {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem("holoverse-booted", "1");
    } catch {
      /* ignore */
    }

    const timers: number[] = [];
    BOOT.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLine(i + 1), 240 * (i + 1)));
    });
    timers.push(window.setTimeout(() => setDone(true), 240 * BOOT.length + 450));
    return () => timers.forEach(clearTimeout);
  }, [mode]);

  return (
    <div className={`boot ${done ? "done" : ""}`} aria-hidden={done}>
      <div className="wrap" style={{ maxWidth: 680 }}>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "var(--cyan)" }}>
          {BOOT.slice(0, line).map((b, i) => (
            <div
              key={i}
              style={{
                marginBottom: 6,
                color: i === BOOT.length - 1 ? "var(--violet)" : "var(--cyan)",
                textShadow: "0 0 10px rgba(0,255,240,0.4)",
              }}
            >
              {t(b)}
            </div>
          ))}
          <span className="blink" style={{ color: "var(--cyan)" }}>
            █
          </span>
        </div>
      </div>
    </div>
  );
}
