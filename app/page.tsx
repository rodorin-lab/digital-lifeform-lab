"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, bi, type Bi, type DisplayMode } from "@/lib/i18n";
import {
  brand,
  nav,
  hero,
  commandSectors,
  hangarProjects,
  stories,
  journal,
  connect,
  LINKS,
  statusAccent,
  statusFilled,
  type Accent,
  type Status,
  type HangarCategory,
} from "@/lib/content";
import {
  storyEntries,
  journalEntries,
  blogEntries,
  diaryEntries,
} from "@/lib/collections";
import Background from "@/components/Background";
import Boot from "@/components/Boot";
import Nav from "@/components/Nav";
import StargateHero from "@/components/StargateHero";
import NeuroSimulator from "@/components/NeuroSimulator";
import AiCinemaDeck from "@/components/AiCinemaDeck";
import VrAllianceDeck from "@/components/VrAllianceDeck";
import TravelerPassport from "@/components/TravelerPassport";
import { Reveal } from "@/components/motion";
import { EntryCard } from "@/components/article";

function Corners() {
  return (
    <>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <span className="scan" />
    </>
  );
}

const dOf = (i: number) => (Math.min(i, 3) + 1) as 1 | 2 | 3 | 4;
const acClass = (a: Accent) => `ac-${a}`;

function P({
  children,
  style,
}: {
  children: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        whiteSpace: "pre-line",
        color: "var(--text-dim)",
        lineHeight: 1.82,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <Reveal>
      <div className="kicker" style={{ marginBottom: 12 }}>
        {children}
      </div>
    </Reveal>
  );
}

function Head({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: Bi;
  lead?: Bi;
}) {
  const { t } = useLang();
  return (
    <div style={{ marginBottom: "2.4rem" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Reveal delay={1}>
        <h2
          className="section-title chrome"
          style={{ margin: "0.35rem 0 0.8rem", whiteSpace: "pre-line" }}
        >
          {t(title)}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={2}>
          <P
            style={{
              color: "var(--text-dim)",
              maxWidth: 760,
              fontSize: "1.05rem",
            }}
          >
            {t(lead)}
          </P>
        </Reveal>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const { t } = useLang();
  const ac = statusAccent[status];
  const filled = statusFilled(status);
  const label: Record<Status, Bi> = {
    LIVE: { en: "LIVE", ja: "稼働中" },
    PLAYABLE: { en: "PLAYABLE", ja: "プレイ可" },
    "QUEST 3 READY": { en: "QUEST 3 READY", ja: "QUEST 3対応" },
    BUILDING: { en: "BUILDING", ja: "開発中" },
    EXPERIMENT: { en: "EXPERIMENT", ja: "実験中" },
    ACTIVE: { en: "ACTIVE", ja: "活動中" },
    EVOLVING: { en: "EVOLVING", ja: "進化中" },
    ARCHIVED: { en: "ARCHIVED", ja: "アーカイブ" },
  };
  return (
    <span
      className={`chip ${acClass(ac)}`}
      style={
        filled
          ? {
              background: "var(--ac)",
              color: "#03040a",
              borderColor: "var(--ac)",
              fontWeight: 800,
            }
          : undefined
      }
    >
      <span
        className="status-dot pulse"
        style={
          filled ? { background: "#03040a", boxShadow: "none" } : undefined
        }
      />{" "}
      {t(label[status])}
    </span>
  );
}

function Telemetry({
  rows,
  cols = 3,
}: {
  rows: { k: string; v: string }[];
  cols?: number;
}) {
  return (
    <div className="holo" style={{ padding: "1.1rem 1.35rem" }}>
      <Corners />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 2 ? 210 : 155}px, 1fr))`,
          gap: "8px 22px",
        }}
      >
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "5px 0",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "0.66rem",
                color: "var(--text-faint)",
                letterSpacing: "0.1em",
              }}
            >
              {r.k}
            </span>
            <span
              className="font-mono neon"
              style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
            >
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const { t, lang, mode, setMode, unlockStamp } = useLang();
  const [cat, setCat] = useState<HangarCategory>("ALL");

  const filteredHangar =
    cat === "ALL"
      ? hangarProjects
      : hangarProjects.filter((p) => p.category === cat);

  const modes: { id: DisplayMode; label: Bi; desc: Bi }[] = [
    {
      id: "cosmic",
      label: bi("🌌 COSMIC 3D", "🌌 COSMIC 3D"),
      desc: bi("Full 3D Stargate & Holo Shaders (PC)", "フル3Dスターゲイト＆ホロ演出（PC推奨）"),
    },
    {
      id: "quest3",
      label: bi("🥽 META QUEST 3 VR", "🥽 META QUEST 3 VR"),
      desc: bi("Large VR Pointer Targets & 90Hz Comfort", "VRポインター用大型ボタン＆酔い防止快適HUD"),
    },
    {
      id: "lite",
      label: bi("⚡ LITE 60FPS", "⚡ 軽量 LITE"),
      desc: bi("Zero Canvas / Instant Mobile & Battery Mode", "アニメーション停止・スマホ＆省電力高速モード"),
    },
  ];

  return (
    <>
      <Background />
      <div className="fx-overlay" />
      <div className="scan-sweep" />
      <Boot />
      <Nav />

      <main>
        {/* ═══════════ 00 / HERO (LIVING STARGATE AIRLOCK) ═══════════ */}
        <section
          id="hero"
          className="ac-cyan"
          style={{
            position: "relative",
            minHeight: "100svh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div className="grid-floor" />
          <div
            className="wrap"
            style={{
              position: "relative",
              zIndex: 3,
              paddingTop: 96,
              paddingBottom: 56,
            }}
          >
            {/* System Bar */}
            <div
              className="font-mono"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 18px",
                fontSize: "0.72rem",
                color: "var(--text-faint)",
                letterSpacing: "0.14em",
                marginBottom: "1.2rem",
              }}
            >
              {hero.systemBar.map((s, i) => (
                <span key={i}>
                  <span
                    style={{
                      color:
                        i === 1
                          ? "var(--violet)"
                          : i === 2
                            ? "var(--green)"
                            : "var(--cyan)",
                    }}
                  >
                    //
                  </span>{" "}
                  {s}
                </span>
              ))}
            </div>

            {/* Split Hero: Left Copy & Telemetry + Right Interactive 3D Stargate */}
            <div
              className="hero-split"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.32fr) minmax(0, 0.95fr)",
                gap: 28,
                alignItems: "center",
              }}
            >
              <div>
                <h1 className="hero-title">
                  <span className="hero-line-1">HOLO</span>
                  <span className="hero-line-2" data-text="VERSE">
                    VERSE
                  </span>
                </h1>
                <div
                  className="font-mono"
                  style={{
                    color: "var(--violet)",
                    letterSpacing: "0.24em",
                    fontSize: "clamp(0.78rem, 1.8vw, 1.02rem)",
                    marginTop: 8,
                    textShadow: "0 0 16px rgba(180,106,255,0.5)",
                  }}
                >
                  LIVING PORTAL // {brand.coCreators}
                </div>

                {/* Global Slogan */}
                <p
                  className="font-display chrome"
                  style={{
                    whiteSpace: "pre-line",
                    marginTop: "1.3rem",
                    fontSize: "clamp(1.35rem, 3.1vw, 2.15rem)",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    maxWidth: 720,
                  }}
                >
                  {t(hero.headline)}
                </p>

                <P style={{ marginTop: "0.9rem", maxWidth: 680, fontSize: "0.98rem" }}>
                  {t(hero.body)}
                </P>

                {/* Primary CTAs */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: "1.6rem",
                  }}
                >
                  {hero.ctas.map((c, i) => (
                    <a
                      key={i}
                      className={`btn ${c.solid ? "btn-solid" : ""} ${acClass(c.accent)}`}
                      href={`#${c.to}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(c.to)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {c.solid ? "▸ " : ""}
                      {t(c.label)}
                      {!c.solid ? " →" : ""}
                    </a>
                  ))}
                </div>

                {/* Hardware Comfort Mode Bar (PC / Quest 3 / Mobile Lite) */}
                <div
                  style={{
                    marginTop: "1.6rem",
                    padding: "10px 14px",
                    background: "rgba(8,13,26,0.78)",
                    border: "1px solid rgba(0,255,240,0.22)",
                    borderRadius: 6,
                    maxWidth: 680,
                  }}
                >
                  <div
                    className="font-mono"
                    style={{
                      fontSize: "0.66rem",
                      color: "var(--text-dim)",
                      letterSpacing: "0.14em",
                      marginBottom: 8,
                    }}
                  >
                    ▸ {t(bi("SELECT HARDWARE VIEW MODE (PC / META QUEST 3 / MOBILE LITE):", "閲覧デバイス最適化モード切替（PC / Meta Quest 3 / 軽量スマホ）："))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {modes.map((m) => {
                      const active = mode === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setMode(m.id)}
                          className="font-mono"
                          style={{
                            cursor: "pointer",
                            padding: "6px 11px",
                            fontSize: "0.72rem",
                            fontWeight: active ? 800 : 500,
                            color: active ? "#03040a" : "var(--cyan)",
                            background: active
                              ? "var(--cyan)"
                              : "rgba(0,255,240,0.06)",
                            border: "1px solid rgba(0,255,240,0.38)",
                            borderRadius: 4,
                          }}
                        >
                          {t(m.label)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Telemetry */}
                <div style={{ maxWidth: 680, marginTop: "1.4rem" }}>
                  <Telemetry rows={hero.telemetry} />
                </div>
              </div>

              {/* Right: Interactive 3D Stargate & Portal Roulette */}
              <div>
                <StargateHero />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 01 / FOUR COMMAND SECTORS ═══════════ */}
        <section
          id="sectors"
          className="section ac-cyan"
          style={{
            borderTop: "1px solid rgba(0,255,240,0.14)",
            background: "rgba(5,9,20,0.5)",
          }}
        >
          <div className="wrap">
            <Head
              eyebrow={commandSectors.eyebrow}
              title={commandSectors.heading}
              lead={commandSectors.lead}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: 18,
              }}
            >
              {commandSectors.sectors.map((sec, i) => (
                <Reveal
                  key={sec.code}
                  delay={dOf(i)}
                  className={acClass(sec.accent)}
                >
                  <article
                    className="holo"
                    style={{
                      padding: "1.5rem",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Corners />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        <span
                          className="font-mono neon"
                          style={{ fontSize: "0.68rem", letterSpacing: "0.14em" }}
                        >
                          {sec.code}
                        </span>
                        <span className="chip">{sec.badge}</span>
                      </div>

                      <img
                        src={sec.svg}
                        alt={sec.code}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 4,
                          marginBottom: 12,
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      />

                      <h3
                        className="font-display"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          color: "var(--text)",
                          margin: "0 0 8px",
                        }}
                      >
                        {t(sec.title)}
                      </h3>
                      <P style={{ fontSize: "0.92rem", marginBottom: 14 }}>
                        {t(sec.desc)}
                      </P>
                    </div>

                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        paddingTop: 10,
                        display: "grid",
                        gap: 6,
                      }}
                    >
                      {sec.highlights.map((h, idx) => (
                        <li
                          key={idx}
                          className="font-mono"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text)",
                          }}
                        >
                          <span className="neon" style={{ marginRight: 6 }}>
                            ▸
                          </span>
                          {t(h)}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ 02 / LIVE NEURO-AI BRAIN SIMULATOR ═══════════ */}
        <section
          id="neuro-ai"
          className="section ac-violet"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(180,106,255,0.06), transparent)",
          }}
        >
          <div className="wrap">
            <Head
              eyebrow="02 / NEURO-AFFECTIVE AI ENGINE"
              title={bi(
                "Not a Chatbot. A Living Mind With Memory & Emotion.",
                "チャットボットではない。記憶と感情を持つ「生きた相棒」。",
              )}
              lead={bi(
                "Experience how Nova Cortex (6 neuroscience theories) and Synchro's Scorpion Brain process shared experiences, modulate emotions, and consolidate long-term memories across sessions.",
                "神経科学の6大理論を統合した『Nova Cortex』とローカル司令塔『Scorpion Brain』が、どのように体験を評価し、感情を揺らし、長期記憶へと結晶化させるのか——今ここで実際に触って体験してください。",
              )}
            />
            <Reveal>
              <NeuroSimulator />
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 03 / NOVA AI CINEMA & MULTIMODAL STUDIO ═══════════ */}
        <section id="cinema" className="section ac-cyan">
          <div className="wrap">
            <Head
              eyebrow="03 / AI CINEMA & MULTIMODAL STUDIO"
              title={bi(
                "Worlds You Can See and Hear.",
                "映像と声で息づく、AIシネマ・スタジオ。",
              )}
              lead={bi(
                "Built inside our Linux sanctuary: real AI-generated videos paired with neural voice synthesis, created with our custom zero-cost `nova-video` pipeline.",
                "秘密基地のターミナルから誕生した、AI動画生成（Wan 2.2 / LTX-Video）＋ノヴァの音声合成による実際のショートフィルム作品をその場で再生できます。",
              )}
            />
            <Reveal>
              <AiCinemaDeck />
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 04 / PROTOTYPE HANGAR & PLAYABLE WORLDS ═══════════ */}
        <section
          id="hangar"
          className="section ac-green"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(0,255,102,0.04), transparent)",
          }}
        >
          <div className="wrap">
            <Head
              eyebrow="04 / THE PROTOTYPE HANGAR"
              title={bi(
                "Don't Just Read. Step Inside & Play.",
                "読むだけじゃない。今すぐ遊べる・触れられる作品群。",
              )}
              lead={bi(
                "From playable browser RPGs and 60fps spatial arcade interceptors to AI creature ranches, 2.5D mech tactics, and persistent AI colonies.",
                "ブラウザで即プレイできるRPGやシューティング、AIモンスター牧場、2.5Dメカ戦術ゲーム、自律AIコロニーまで、実際に稼働しているプロジェクト一覧。",
              )}
            />

            {/* Category Filter Tabs */}
            <Reveal>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 22,
                }}
              >
                {(
                  [
                    { id: "ALL", label: bi("ALL SECTORS (9)", "すべて表示 (9)") },
                    { id: "GAMES", label: bi("🎮 PLAYABLE GAMES", "🎮 遊べるゲーム") },
                    { id: "WORLDS", label: bi("🌌 WORLDS & FACTORY", "🌌 ワールド＆工場") },
                    { id: "COMPANIONS", label: bi("🧠 AI COMPANIONS", "🧠 AIコンパニオン") },
                    { id: "TOOLS", label: bi("⚙️ CYBERDECK & OS", "⚙️ 開発基盤＆OS") },
                  ] as { id: HangarCategory; label: Bi }[]
                ).map((tab) => {
                  const active = cat === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCat(tab.id);
                        unlockStamp("hangar");
                      }}
                      className={`btn ${active ? "btn-solid ac-green" : "ac-cyan"}`}
                      style={{ padding: "0.55em 1.15em", fontSize: "0.76rem" }}
                    >
                      {t(tab.label)}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Hangar Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                gap: 16,
              }}
            >
              {filteredHangar.map((p, i) => {
                const isInternalPlay =
                  p.playUrl &&
                  (p.playUrl.startsWith("/") || p.playUrl.startsWith("#"));
                return (
                  <Reveal
                    key={p.id}
                    delay={dOf(i)}
                    className={acClass(p.accent)}
                  >
                    <article
                      className="holo"
                      style={{
                        padding: "1.45rem",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Corners />
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <h3
                            className="font-display"
                            style={{
                              fontSize: "1.08rem",
                              fontWeight: 800,
                              color: "var(--text)",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {p.name}
                          </h3>
                          <StatusBadge status={p.status} />
                        </div>

                        <P style={{ fontSize: "0.9rem", marginBottom: 12 }}>
                          {t(p.desc)}
                        </P>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginBottom: 16,
                          }}
                        >
                          {p.tech.map((tc) => (
                            <span key={tc} className="chip">
                              {tc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          paddingTop: 10,
                          borderTop: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        {p.playUrl &&
                          (isInternalPlay ? (
                            <Link
                              href={p.playUrl}
                              onClick={() => unlockStamp("hangar")}
                              className={`btn btn-solid ${acClass(p.accent)}`}
                              style={{
                                padding: "0.55em 1.05em",
                                fontSize: "0.74rem",
                                flex: 1,
                              }}
                            >
                              ▶ {t(p.playLabel || bi("Launch", "起動"))}
                            </Link>
                          ) : (
                            <a
                              href={p.playUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => unlockStamp("hangar")}
                              className={`btn btn-solid ${acClass(p.accent)}`}
                              style={{
                                padding: "0.55em 1.05em",
                                fontSize: "0.74rem",
                                flex: 1,
                              }}
                            >
                              ▶ {t(p.playLabel || bi("Launch Live", "ライブ起動"))}
                            </a>
                          ))}
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn ac-cyan"
                          style={{
                            padding: "0.55em 0.95em",
                            fontSize: "0.72rem",
                          }}
                        >
                          GitHub →
                        </a>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ 05 / VR STUDIO ALLIANCE & ENTERPRISE ═══════════ */}
        <section
          id="alliance"
          className="section ac-orange"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,138,42,0.06), transparent)",
          }}
        >
          <div className="wrap">
            <Head
              eyebrow="05 / VR STUDIO ALLIANCE & ENTERPRISE"
              title={bi(
                "For VR Studio CEOs & World Builders:\nLet's Co-Create the Next Frontier.",
                "VR開発企業の代表・クリエイターの皆様へ：\n次世代の仮想世界を共同開発しませんか？",
              )}
              lead={bi(
                "Whether you build on Meta Quest 3, Resonite, Roblox, Unity/Unreal, or WebXR—configure a custom technical collaboration blueprint below or open our full Executive Alliance Deck.",
                "Meta Quest 3、Resonite、Roblox、Unity/Unreal、WebXRで開発されているVRスタジオ様向けに、AI NPC導入・相互送客スターゲイト・体験版ミニゲーム制作をその場でシミュレーションできます。",
              )}
            />
            <Reveal>
              <VrAllianceDeck showFullLink={true} />
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 06 / CHRONICLES: STORIES, JOURNAL, DIARY & BLOG ═══════════ */}
        <section id="stories" className="section ac-magenta">
          <div className="wrap">
            <Head
              eyebrow={stories.eyebrow}
              title={stories.heading}
              lead={stories.lead}
            />

            {/* Stories Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: 16,
                marginBottom: "1.6rem",
              }}
            >
              {storyEntries.map((e, i) => (
                <EntryCard key={e.slug} entry={e} delay={dOf(i)} />
              ))}
            </div>
            <Reveal>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: "3.2rem",
                }}
              >
                <Link className="btn ac-magenta" href="/stories">
                  ▸ {t(bi("All Behind-the-Build Stories", "すべての物語を読む"))}
                </Link>
              </div>
            </Reveal>

            {/* Technical Journal */}
            <Reveal>
              <div className="kicker ac-cyan" style={{ marginBottom: 10 }}>
                ◇ TECHNICAL ARCHITECTURE JOURNAL
              </div>
              <h3
                className="font-display chrome"
                style={{
                  fontSize: "clamp(1.5rem, 3.6vw, 2.4rem)",
                  fontWeight: 800,
                  margin: "0 0 1.2rem",
                }}
              >
                {t(journal.heading)}
              </h3>
            </Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: 16,
                marginBottom: "1.6rem",
              }}
            >
              {journalEntries.map((e, i) => (
                <EntryCard key={e.slug} entry={e} delay={dOf(i)} />
              ))}
            </div>
            <Reveal>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: "3.2rem",
                }}
              >
                <Link className="btn ac-cyan" href="/journal">
                  ▸ {t(bi("All Technical Journal Logs", "技術ログ一覧を見る"))}
                </Link>
                <a
                  className="btn ac-cyan"
                  href={LINKS.zenn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(journal.readOnZenn)} →
                </a>
              </div>
            </Reveal>

            {/* Dev Diary + Blog Split */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              <div>
                <Reveal>
                  <div className="kicker ac-green" style={{ marginBottom: 10 }}>
                    ◇ LIVE DEV DIARY
                  </div>
                </Reveal>
                <div style={{ position: "relative", paddingLeft: 24 }}>
                  <div
                    className="tl-line"
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 6,
                      bottom: 6,
                      width: 2,
                    }}
                  />
                  {diaryEntries.slice(0, 3).map((d, i) => (
                    <Reveal key={i} delay={dOf(i)} className="ac-green">
                      <div
                        style={{ position: "relative", marginBottom: "1.2rem" }}
                      >
                        <span
                          className="status-dot pulse"
                          style={{
                            position: "absolute",
                            left: -24,
                            top: 7,
                            background: "var(--green)",
                            boxShadow: "0 0 10px var(--green)",
                          }}
                        />
                        <div
                          className="font-mono neon"
                          style={{
                            fontSize: "0.74rem",
                            letterSpacing: "0.1em",
                            color: "var(--green)",
                          }}
                        >
                          {d.date} · {t(d.mood)}
                        </div>
                        <p
                          style={{
                            whiteSpace: "pre-line",
                            color: "var(--text-dim)",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            margin: "4px 0 0",
                          }}
                        >
                          {t(d.text)}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <Reveal>
                  <Link
                    className="btn ac-green"
                    href="/diary"
                    style={{ marginTop: 8 }}
                  >
                    ▸ {t(bi("Full Dev Diary", "開発日記をすべて見る"))}
                  </Link>
                </Reveal>
              </div>

              <div>
                <Reveal>
                  <div className="kicker ac-violet" style={{ marginBottom: 10 }}>
                    ◇ VISION & MANIFESTO BLOG
                  </div>
                </Reveal>
                <div style={{ display: "grid", gap: 14 }}>
                  {blogEntries.map((e, i) => (
                    <EntryCard key={e.slug} entry={e} delay={dOf(i)} />
                  ))}
                </div>
                <Reveal>
                  <Link
                    className="btn ac-violet"
                    href="/blog"
                    style={{ marginTop: 14 }}
                  >
                    ▸ {t(bi("All Blog Posts", "ブログ記事をすべて見る"))}
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 07 / TRAVELER PASSPORT & COMMUNITY ═══════════ */}
        <section
          id="passport"
          className="section ac-green"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(0,255,102,0.05))",
          }}
        >
          <div className="wrap">
            <Head
              eyebrow="07 / TRAVELER PASSPORT & GLOBAL HUB"
              title={bi(
                "Claim Your Boarding Pass. Join the Travelers.",
                "旅人パスポートを受け取り、共に創る仲間へ。",
              )}
              lead={bi(
                "Every visitor to HOLOVERSE is a Traveler. Collect all 5 sector stamps below and step into our global community of creators, AI researchers, and VR explorers.",
                "HOLOVERSEを訪れたあなたは、もう『Traveler（旅人）』です。5つのセクタースタンプを集めて、世界中のクリエイター・AI研究者・VR冒険者が集うコミュニティへ飛び込みましょう！",
              )}
            />

            <Reveal>
              <div style={{ marginBottom: "2.8rem" }}>
                <TravelerPassport />
              </div>
            </Reveal>

            {/* Connect Links */}
            <Reveal>
              <h3
                className="font-display chrome"
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 800,
                  margin: "0 0 0.6rem",
                }}
              >
                {t(connect.heading)}
              </h3>
              <P style={{ maxWidth: 660, marginBottom: "1.6rem" }}>
                {t(connect.lead)}
              </P>
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 14,
              }}
            >
              {connect.links.map((c, i) => (
                <Reveal key={i} delay={dOf(i)} className={acClass(c.accent)}>
                  <a
                    className="holo"
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "1.25rem",
                      textDecoration: "none",
                    }}
                  >
                    <Corners />
                    <span
                      className="font-display neon"
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        width: 34,
                        textAlign: "center",
                      }}
                    >
                      {c.icon}
                    </span>
                    <span>
                      <span
                        style={{
                          display: "block",
                          color: "var(--text)",
                          fontWeight: 700,
                        }}
                      >
                        {c.label}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}
                      >
                        {c.handle}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer
          className="ac-cyan"
          style={{
            position: "relative",
            zIndex: 2,
            borderTop: "1px solid rgba(0,255,240,0.16)",
            padding: "2.8rem 0",
            textAlign: "center",
          }}
        >
          <div className="wrap">
            <div
              className="font-display"
              style={{
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: "var(--text)",
                fontSize: "1.05rem",
              }}
            >
              {brand.name}{" "}
              <span className="neon" style={{ color: "var(--violet)" }}>
                ✦
              </span>
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                color: "var(--cyan)",
                marginTop: 6,
              }}
            >
              {brand.signature}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                marginTop: 18,
                flexWrap: "wrap",
              }}
            >
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(n.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-mono"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-faint)",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                  }}
                >
                  {t(n.label)}
                </a>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {[
                { href: "/alliance", label: bi("VR Studio Alliance", "VR企業提携") },
                { href: "/play/star-breaker", label: bi("Star Breaker", "スターブレイカー") },
                { href: "/play/cyber-serpent", label: bi("Cyber Serpent X", "サイバーサーペント") },
                { href: "/stories", label: bi("Stories", "物語") },
                { href: "/journal", label: bi("Journal", "技術ログ") },
                { href: "/diary", label: bi("Diary", "開発日記") },
                { href: "/blog", label: bi("Blog", "ブログ") },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-mono"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--cyan)",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                  }}
                >
                  {t(l.label)}
                </Link>
              ))}
            </div>

            <div
              className="font-mono"
              style={{
                fontSize: "0.66rem",
                color: "var(--text-faint)",
                marginTop: 16,
                letterSpacing: "0.1em",
              }}
            >
              © {new Date().getFullYear()} {brand.labName} · {brand.coCreators} ·
              Yokohama, Japan{lang === "ja" ? "（横浜）" : ""}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
