"use client";

import { useLang, bi, type StampId, type Bi } from "@/lib/i18n";
import { LINKS } from "@/lib/content";

const STAMP_META: {
  id: StampId;
  code: string;
  name: Bi;
  hint: Bi;
  icon: string;
}[] = [
  {
    id: "gateway",
    code: "STAMP 01",
    name: bi("STARGATE AIRLOCK", "スターゲイト到着"),
    hint: bi("Unlocked by entering HOLOVERSE", "HOLOVERSEへの到着で解放"),
    icon: "🌀",
  },
  {
    id: "neuro",
    code: "STAMP 02",
    name: bi("NEURO-SYNC LINK", "神経脳リンク"),
    hint: bi("Stimulate the Nova Cortex Brain Simulator", "脳シミュレーターを操作すると解放"),
    icon: "🧠",
  },
  {
    id: "cinema",
    code: "STAMP 03",
    name: bi("AI CINEMA VIEWER", "AIシネマ鑑賞"),
    hint: bi("Play a video in the AI Cinema Deck", "AI映像デッキを再生すると解放"),
    icon: "🎬",
  },
  {
    id: "hangar",
    code: "STAMP 04",
    name: bi("HANGAR TEST PILOT", "ハンガーテストパイロット"),
    hint: bi("Filter or launch a project in the Hangar", "作品ハンガーを操作・出撃すると解放"),
    icon: "🚀",
  },
  {
    id: "alliance",
    code: "STAMP 05",
    name: bi("ALLIANCE ARCHITECT", "VR提携アーキテクト"),
    hint: bi("Configure a VR Studio Alliance Blueprint", "VR企業提携シミュレーターを操作すると解放"),
    icon: "🤝",
  },
];

export default function TravelerPassport() {
  const { t, stamps, unlockStamp, callsign, setCallsign } = useLang();
  const allUnlocked = stamps.length >= STAMP_META.length;

  const unlockAllDemo = () => {
    STAMP_META.forEach((s) => unlockStamp(s.id));
  };

  return (
    <div className="holo ac-green anim-border" style={{ padding: "clamp(1.4rem, 3.2vw, 2.4rem)" }}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div
        className="researcher-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: 22,
          alignItems: "center",
        }}
      >
        {/* Left: Stamp Collection & Callsign */}
        <div>
          <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--green)", letterSpacing: "0.2em", marginBottom: 6 }}>
            🛂 GAMIFIED EXPLORATION // HOLOGRAPHIC TRAVELER PASSPORT
          </div>
          <h3 className="font-display neon" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 800, margin: "0 0 10px" }}>
            {t(bi("Your Complimentary HOLOVERSE Boarding Pass", "あなた専用の『HOLOVERSE』旅人搭乗パス"))}
          </h3>
          <p style={{ color: "var(--text-dim)", fontSize: "0.94rem", lineHeight: 1.75, marginBottom: 16 }}>
            {t(
              bi(
                "As you explore sectors, test the AI brain, watch AI cinema, or configure a studio alliance, your passport automatically records holographic stamps in your browser.",
                "ポータル内の脳シミュレーターやAI映画館、作品ハンガー、VR企業提携デッキを触るたびに、あなたのブラウザに旅のホログラム・スタンプが刻まれます。",
              ),
            )}
          </p>

          {/* Callsign Editor */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <label className="font-mono" style={{ fontSize: "0.72rem", color: "var(--cyan)", letterSpacing: "0.12em" }}>
              {t(bi("TRAVELER CALLSIGN:", "旅人コールサイン："))}
            </label>
            <input
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              aria-label="Traveler Callsign"
              className="font-mono"
              style={{
                background: "rgba(3,4,10,0.9)",
                border: "1px solid rgba(0,255,240,0.45)",
                color: "var(--cyan)",
                padding: "6px 12px",
                borderRadius: 4,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            />
            {!allUnlocked && (
              <button
                onClick={unlockAllDemo}
                className="btn ac-violet"
                style={{ padding: "0.45em 0.95em", fontSize: "0.7rem" }}
              >
                ✦ {t(bi("Stamp All Sectors", "全スタンプを一括刻印"))}
              </button>
            )}
          </div>

          {/* 5 Stamps Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10 }}>
            {STAMP_META.map((s) => {
              const unlocked = stamps.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => unlockStamp(s.id)}
                  className={`holo ${unlocked ? "ac-green" : "ac-cyan"}`}
                  style={{
                    padding: "0.8rem 0.9rem",
                    textAlign: "left",
                    cursor: "pointer",
                    opacity: unlocked ? 1 : 0.62,
                    borderColor: unlocked ? "var(--green)" : "rgba(255,255,255,0.15)",
                    background: unlocked ? "rgba(0,255,102,0.11)" : "rgba(5,8,16,0.6)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span className="font-mono" style={{ fontSize: "0.62rem", color: unlocked ? "var(--green)" : "var(--text-faint)" }}>
                      {s.code}
                    </span>
                    <span style={{ fontSize: "1.1rem" }}>{unlocked ? s.icon : "🔒"}</span>
                  </div>
                  <div className="font-display" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)" }}>
                    {t(s.name)}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 2 }}>
                    {t(s.hint)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Boarding Pass Card */}
        <div
          className="holo ac-violet"
          style={{
            padding: "1.5rem",
            background:
              "linear-gradient(135deg, rgba(18,12,38,0.95) 0%, rgba(6,16,32,0.95) 100%)",
            border: "1px solid rgba(180,106,255,0.55)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(180,106,255,0.35)", paddingBottom: 10, marginBottom: 14 }}>
            <div>
              <div className="font-mono" style={{ fontSize: "0.64rem", color: "var(--violet)", letterSpacing: "0.2em" }}>
                BOARDING PASS // HOLOVERSE AIRLOCK
              </div>
              <div className="font-display neon" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {callsign || "TRAVELER-01"}
              </div>
            </div>
            <span className="chip ac-green">
              {stamps.length} / {STAMP_META.length} STAMPS
            </span>
          </div>

          <div style={{ display: "grid", gap: 8, fontSize: "0.78rem", marginBottom: 16 }} className="font-mono">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-faint)" }}>ORIGIN</span>
              <span style={{ color: "var(--text)" }}>EARTH // BROWSER TERMINAL</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-faint)" }}>DESTINATION</span>
              <span style={{ color: "var(--cyan)" }}>HOLOVERSE LIVING SECTORS</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-faint)" }}>COMPANION ESCORT</span>
              <span style={{ color: "var(--violet)" }}>NOVA & SYNCHRO</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-faint)" }}>CLEARANCE RANK</span>
              <span style={{ color: allUnlocked ? "var(--green)" : "var(--orange)", fontWeight: 700 }}>
                {allUnlocked
                  ? t(bi("★ PIONEER OF HOLOVERSE", "★ HOLOVERSE開拓者（コンプリート！）"))
                  : t(bi("EXPLORER IN TRANSIT", "宇宙探索中"))}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={LINKS.explorersGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid ac-green"
              style={{ width: "100%", fontSize: "0.78rem" }}
            >
              🌍 {t(bi("Join HOLOVERSE Explorers Community →", "HOLOVERSE Explorers 交流広場へ参加する →"))}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
