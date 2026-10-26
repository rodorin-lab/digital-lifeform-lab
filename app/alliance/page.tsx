"use client";

import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { PageShell } from "@/components/article";
import { Reveal } from "@/components/motion";
import VrAllianceDeck from "@/components/VrAllianceDeck";
import { LINKS } from "@/lib/content";

export default function AlliancePage() {
  const { t } = useLang();

  const pillars = [
    {
      code: "PILLAR 01 // LIVING NPC SDK",
      title: bi("Neuro-Affective AI Companions Inside Your VR World", "貴社VRワールド内に「記憶と心を持つAI住民」を実装"),
      accent: "ac-violet",
      desc: bi(
        "Most VR worlds feel empty when friends are offline. By integrating Nova Cortex (6 neuroscience theories: episodic-neocortical consolidation, PAD emotion space, 4 neuromodulators) and Scorpion Brain, your world gains persistent AI guides, shopkeepers, and raid partners who remember every returning player.",
        "「フレンドがいない時間帯でも、ワールドに温かな存在感がある」——Nova Cortexの神経記憶エンジンとScorpion Brainにより、プレイヤーの名前や前回の冒険を覚え、感情豊かに出迎えるAIガイドや相棒NPCを貴社ワールドへ統合します。",
      ),
    },
    {
      code: "PILLAR 02 // STARGATE NETWORK",
      title: bi("Cross-World Portal Traffic & Traveler Passport Stamps", "ワールド間スターゲイト相互送客＆旅人スタンプラリー"),
      accent: "ac-cyan",
      desc: bi(
        "Connect your Meta Quest 3, Resonite, Roblox, or WebXR experience to the HOLOVERSE Stargate. Visitors earn official holographic stamps on their Traveler Passport by stepping into partner worlds—turning passive web traffic into active in-headset players.",
        "Meta Quest 3、Resonite、Roblox、WebXRのワールドをHOLOVERSEスターゲイトと接続。旅人パスポートの公式スタンプラリーを通じて、Web上の訪問者を実際のVRワールド体験へとシームレスに誘導します。",
      ),
    },
    {
      code: "PILLAR 03 // RAPID GAME & ASSET FORGE",
      title: bi("Playable Web Teasers & AI Monster / Mech Pipelines", "Web体験版ミニゲーム＆AIモンスター／メカ素材パイプライン"),
      accent: "ac-green",
      desc: bi(
        "Downloading a 10GB VR app is a high barrier for new users. We co-build lightweight, instant-play browser & WebXR teasers (like Dot Quest RPG and Star Breaker) plus custom AI Monster Factory rosters that let players fall in love with your IP in 10 seconds on any device.",
        "大容量VRアプリのダウンロード前に、ブラウザで10秒で貴社IPの魅力を体験できるプレイアブルWebミニゲームや、『AI Monster Factory』によるカスタムモンスター・メカ素材群を超高速で共同制作します。",
      ),
    },
    {
      code: "PILLAR 04 // PUBLIC CO-CREATION",
      title: bi("Bilingual Global Media & Live-Streamed Co-Development", "英語標準の国際発信＆「開発×配信」コミュニティ熱狂づくり"),
      accent: "ac-orange",
      desc: bi(
        "We don't just ship behind closed doors—we turn the development journey itself into entertainment through English-first global storytelling, HOLOVERSE Explorers community events, and live-streamed human × AI building sessions.",
        "完成品だけでなく「創る過程そのもの」をエンターテインメント化。英語を標準としたグローバル発信と『HOLOVERSE Explorers』国際コミュニティ、開発×配信イベントで世界中から熱狂的なファンを集めます。",
      ),
    },
  ];

  return (
    <PageShell accent="orange">
      <div className="wrap" style={{ padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1rem, 4vw, 2.5rem) 6rem" }}>
        <Reveal>
          <Link
            href="/"
            className="font-mono"
            style={{ fontSize: "0.75rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}
          >
            ← {t(bi("RETURN TO HOLOVERSE LIVING PORTAL", "HOLOVERSEポータルトップへ戻る"))}
          </Link>
        </Reveal>

        <Reveal delay={1}>
          <div className="kicker ac-orange" style={{ marginTop: "1.4rem", marginBottom: 10 }}>
            EXECUTIVE BRIEFING // VR STUDIO ALLIANCE & CO-DEVELOPMENT
          </div>
          <h1 className="section-title chrome" style={{ margin: "0 0 1rem" }}>
            {t(
              bi(
                "Partner With HOLOVERSE.\nBuild Living Worlds Together.",
                "HOLOVERSE国際スタジオ提携。\n「生きた仮想世界」を共に創る。",
              ),
            )}
          </h1>
          <p style={{ color: "var(--text-dim)", maxWidth: 780, fontSize: "1.08rem", lineHeight: 1.85, marginBottom: "2.2rem" }}>
            {t(
              bi(
                "Designed for VR Game Studio CEOs, Spatial Computing Directors, and World Creators. Combine your spatial world-building with our neuro-affective AI companions, zero-friction WebXR portals, and rapid browser game forge.",
                "VRゲーム開発企業の代表・ディレクター・ワールド制作者の皆様へ。貴社の空間開発力と、私たちの神経感情AIコンパニオン技術・WebXR即時体験ポータル・高速プロトタイプ開発力を掛け合わせ、次世代のVR体験を世界へ届けませんか？",
              ),
            )}
          </p>
        </Reveal>

        {/* 4 Strategic Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: "3rem" }}>
          {pillars.map((p, idx) => (
            <Reveal key={p.code} delay={((idx % 4) + 1) as 1 | 2 | 3 | 4} className={p.accent}>
              <div className="holo" style={{ padding: "1.5rem", height: "100%" }}>
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <div className="font-mono neon" style={{ fontSize: "0.68rem", letterSpacing: "0.16em", marginBottom: 8 }}>
                  {p.code}
                </div>
                <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
                  {t(p.title)}
                </h2>
                <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.75, margin: 0 }}>
                  {t(p.desc)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Interactive Blueprint Configurator */}
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <VrAllianceDeck showFullLink={false} />
          </div>
        </Reveal>

        {/* Compute & Infrastructure Roadmap */}
        <Reveal>
          <div className="holo ac-cyan" style={{ padding: "1.8rem 2rem", marginBottom: "2.5rem" }}>
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--cyan)", letterSpacing: "0.18em", marginBottom: 6 }}>
              INFRASTRUCTURE & ROADMAP // 2026 → 2027
            </div>
            <h3 className="font-display neon" style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 12px" }}>
              {t(
                bi(
                  "From Local-First Hybrid Nodes to MONSTER MACHINE 100 (Oct 2027)",
                  "ローカル優先ハイブリッド構成から『MONSTER MACHINE 100』（2027年10月）へ",
                ),
              )}
            </h3>
            <p style={{ color: "var(--text-dim)", fontSize: "0.95rem", lineHeight: 1.8, margin: "0 0 16px" }}>
              {t(
                bi(
                  "Our architecture is built on Gentoo Linux + NVMe 0.01s hot-cache memory + hybrid local/cloud routing—eliminating runaway API bills for partner studios while scaling toward our dedicated flagship Gentoo workstation (MONSTER MACHINE 100) in October 2027.",
                  "Gentoo Linux＋NVMe 0.01秒ホットキャッシュ記憶＋ローカル／クラウド自動ルーティングにより、API課金の暴走を防ぎながら安定したAIコンパニオン稼働を実現。さらに2027年10月にはフラッグシップ計算機『MONSTER MACHINE 100』へのスケールアップを推進しています。",
                ),
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={LINKS.explorersGroup} target="_blank" rel="noopener noreferrer" className="btn btn-solid ac-cyan">
                🌍 {t(bi("Join HOLOVERSE Explorers & Propose Collaboration", "HOLOVERSEコミュニティで提携・共同実験を相談する"))}
              </a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="btn ac-violet">
                ▸ {t(bi("Inspect 79+ Open Repositories on GitHub", "GitHubで79以上の公開リポジトリを見る"))}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
