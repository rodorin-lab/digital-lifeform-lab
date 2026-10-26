"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, bi, type Bi } from "@/lib/i18n";
import { LINKS } from "@/lib/content";

type Platform = {
  id: string;
  name: string;
  badge: string;
  spec: Bi;
};

type Track = {
  id: string;
  title: Bi;
  summary: Bi;
  deliverables: Bi[];
  architecture: string;
};

const PLATFORMS: Platform[] = [
  {
    id: "quest3",
    name: "Meta Quest 3 / Horizon OS",
    badge: "STANDALONE VR & MR",
    spec: bi(
      "Optimized for 72/90/120Hz standalone comfort, WebXR browser instant entry, and mixed-reality passthrough companions.",
      "72/90/120Hzスタンドアロン快適動作、インストール不要のWebXR即体験、MRパススルー相棒連携に最適化。",
    ),
  },
  {
    id: "resonite",
    name: "Resonite / Social VR",
    badge: "REALTIME IN-WORLD CO-DEV",
    spec: bi(
      "WebSocket / OSC bridge connecting external neuro-affective AI brains directly to in-world avatars and ProtoFlux logic.",
      "WebSocket/OSCブリッジにより、外部の神経感情AIエンジンをワールド内のアバターやロジックへ直結。",
    ),
  },
  {
    id: "roblox",
    name: "Roblox Worlds",
    badge: "MASSIVE MULTIPLAYER",
    spec: bi(
      "HttpService API integration for dynamic quests, persistent companion dialogue, and AI Monster Factory creature spawns.",
      "HttpService連携による動的クエスト生成、相棒AI対話、AIモンスター・ファクトリーのクリーチャー実装。",
    ),
  },
  {
    id: "webxr",
    name: "WebXR & Three.js Browser 3D",
    badge: "ZERO-FRICTION PORTAL",
    spec: bi(
      "Instant 1-click transition from standard web browsers or mobile into 3D portals—zero app store friction.",
      "PC・スマホ・VRヘッドセットのブラウザから1クリックで3D空間へ突入するゼロ摩擦ポータル。",
    ),
  },
];

const TRACKS: Track[] = [
  {
    id: "neuro-npc",
    title: bi("🧠 Neuro-Affective AI NPCs & Living World Guides", "🧠 記憶と感情を持つAI NPC・ワールド案内人"),
    summary: bi(
      "Replace scripted dialogue trees with AI characters powered by Nova Cortex & Scorpion Brain—capable of remembering returning players, forming emotional bonds, and guiding newcomers through your VR world.",
      "固定セリフのNPCではなく、プレイヤーとの再会を覚え、感情（PAD＋4大神経修飾物質）を持ち、初心者を温かく案内する「生きたAI住民」を貴社ワールドに導入します。",
    ),
    deliverables: [
      bi("Persistent episodic + neocortical memory per world/player", "ワールドおよびプレイヤー単位のエピソード記憶・長期スキーマ保持"),
      bi("Sub-1.5s voice + emotional expression sync (Live2D / 3D / VRM)", "1.5秒以下の低遅延ボイス＆感情表情シンクロ（3D/VRM/Live2D対応）"),
      bi("Hybrid Local LLM + Cloud fallback for predictable zero-runaway hosting costs", "ローカルLLM優先＋クラウド安全網による圧倒的な低ランニングコスト"),
    ],
    architecture: "VR Client (Quest 3 / Engine) ⇄ WebSocket/REST Airlock ⇄ Nova Cortex Memory DB + Scorpion Router",
  },
  {
    id: "portal-network",
    title: bi("🌀 Cross-World Stargate Network & Mutual Traffic", "🌀 ワールド間スターゲイト相互送客＆ポータル接続"),
    summary: bi(
      "Connect your VR title or social hub to the HOLOVERSE Living Portal. Travelers earn stamps in their Boarding Pass by visiting partner worlds, driving high-intent VR players directly to your experience.",
      "HOLOVERSEポータルと貴社VRワールドを「スターゲイト」で接続。旅人パスポートのスタンプラリー連動により、熱量の高いVRユーザー・クリエイターを相互送客します。",
    ),
    deliverables: [
      bi("Dedicated 3D Sector showcase & instant WebXR/Deep-Link launch from HOLOVERSE", "HOLOVERSEトップ画面での専用セクター展示＆ワンクリック起動リンク"),
      bi("Official Traveler Passport Stamp integration for your world", "旅人パスポート（Traveler Boarding Pass）への公式ワールドスタンプ実装"),
      bi("Global English + Japanese bilingual spotlight & media amplification", "英語標準・日英バイリンガルでのグローバル紹介＆コミュニティ発信"),
    ],
    architecture: "HOLOVERSE Living Portal ⇄ Deep-Link / WebXR Handshake ⇄ Partner VR World + Stamp Verification",
  },
  {
    id: "asset-factory",
    title: bi("🐉 AI Monster, Mech & Rapid Prototype Pipeline", "🐉 AIモンスター・メカ素材＆高速プロトタイプ共同開発"),
    summary: bi(
      "Tap into AI Monster Factory and our rapid game-forge workflows to co-develop new game modes, enemy rosters, customizable mechs, and browser playable teasers that promote your flagship VR release.",
      "『AI Monster Factory』やメカ・ブラウザゲーム高速開発パイプラインを活用し、貴社VRタイトルの世界観を体験できるWebミニゲームやクリーチャー群を共同開発します。",
    ),
    deliverables: [
      bi("Playable browser mini-game teaser built around your IP (PC/Mobile/Quest 3)", "貴社IP・世界観をベースにしたブラウザ即プレイ可能な体験版ミニゲーム制作"),
      bi("Custom AI Monster / Mech asset packs tailored to your art direction", "世界観に合わせたモンスター・メカ・アイテム素材の大量生成と実装"),
      bi("Live-streamed co-creation & community playtest sessions", "開発×配信イベントによるコミュニティ巻き込み型プレイテスト"),
    ],
    architecture: "Concept & IP ⇄ AI Monster/Mech Forge + Next.js/WebGL Teaser ⇄ Full VR Title Funnel",
  },
];

export default function VrAllianceDeck({ showFullLink = true }: { showFullLink?: boolean }) {
  const { t, unlockStamp } = useLang();
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  const [track, setTrack] = useState<Track>(TRACKS[0]);

  return (
    <div className="holo ac-orange anim-border" style={{ padding: "clamp(1.4rem, 3.2vw, 2.4rem)" }}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: "1.4rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(255,138,42,0.25)",
        }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--orange)", letterSpacing: "0.2em" }}>
            🤝 EXECUTIVE B2B & STUDIO ALLIANCE // FOR VR GAME STUDIOS & CREATORS
          </div>
          <h3 className="font-display neon" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 800, margin: "4px 0 0" }}>
            {t(bi("Interactive VR Studio Co-Creation Blueprint", "VR開発スタジオ向け・共同開発ブループリント設計機"))}
          </h3>
        </div>
        <span className="chip ac-orange">
          <span className="status-dot pulse" /> OPEN FOR GLOBAL ALLIANCE
        </span>
      </div>

      {/* Step 1: Select Platform */}
      <div style={{ marginBottom: "1.4rem" }}>
        <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 8 }}>
          STEP 01 // {t(bi("SELECT YOUR TARGET SPATIAL PLATFORM:", "貴社のターゲットVR／空間プラットフォームを選択："))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {PLATFORMS.map((p) => {
            const active = p.id === platform.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPlatform(p);
                  unlockStamp("alliance");
                }}
                className={`holo ${active ? "ac-orange" : "ac-cyan"}`}
                style={{
                  textAlign: "left",
                  padding: "0.85rem 1rem",
                  cursor: "pointer",
                  borderColor: active ? "var(--orange)" : undefined,
                  background: active ? "rgba(255,138,42,0.15)" : "rgba(8,12,24,0.7)",
                }}
              >
                <div className="font-mono" style={{ fontSize: "0.62rem", color: active ? "var(--orange)" : "var(--cyan)", letterSpacing: "0.12em" }}>
                  {p.badge}
                </div>
                <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", marginTop: 2 }}>
                  {p.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Co-Creation Track */}
      <div style={{ marginBottom: "1.4rem" }}>
        <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 8 }}>
          STEP 02 // {t(bi("SELECT CO-DEVELOPMENT MODULE:", "共同開発・提携モジュールを選択："))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
          {TRACKS.map((tr) => {
            const active = tr.id === track.id;
            return (
              <button
                key={tr.id}
                onClick={() => {
                  setTrack(tr);
                  unlockStamp("alliance");
                }}
                className={`holo ${active ? "ac-orange" : "ac-violet"}`}
                style={{
                  textAlign: "left",
                  padding: "0.95rem 1.1rem",
                  cursor: "pointer",
                  borderColor: active ? "var(--orange)" : undefined,
                  background: active ? "rgba(255,138,42,0.15)" : "rgba(8,12,24,0.7)",
                }}
              >
                <div className="font-display" style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text)" }}>
                  {t(tr.title)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Generated Blueprint Output */}
      <div
        className="holo ac-cyan"
        style={{
          padding: "1.4rem 1.6rem",
          background: "rgba(4, 9, 20, 0.9)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <span className="font-mono neon" style={{ fontSize: "0.72rem", color: "var(--cyan)", letterSpacing: "0.14em" }}>
            ▸ GENERATED ALLIANCE BLUEPRINT // {platform.name.toUpperCase()}
          </span>
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--green)" }}>
            READY FOR PILOT DEPLOYMENT
          </span>
        </div>

        <p style={{ color: "var(--text)", fontSize: "0.98rem", lineHeight: 1.75, margin: "0 0 12px" }}>
          {t(track.summary)}
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.65, margin: "0 0 14px" }}>
          <strong style={{ color: "var(--orange)" }}>{platform.name}:</strong> {t(platform.spec)}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10, marginBottom: 14 }}>
          {track.deliverables.map((d, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: "rgba(0,255,240,0.06)",
                borderLeft: "2px solid var(--cyan)",
                fontSize: "0.86rem",
                color: "var(--text)",
              }}
            >
              ✓ {t(d)}
            </div>
          ))}
        </div>

        <div
          className="font-mono"
          style={{
            padding: "8px 12px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            fontSize: "0.74rem",
            color: "var(--violet)",
            marginBottom: 16,
          }}
        >
          PIPELINE: {track.architecture}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {showFullLink && (
            <Link href="/alliance" className="btn btn-solid ac-orange" onClick={() => unlockStamp("alliance")}>
              ▸ {t(bi("Open Full VR Studio Alliance Portal →", "VR企業提携・専用ページを開く →"))}
            </Link>
          )}
          <a
            href={LINKS.explorersGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn ac-cyan"
            onClick={() => unlockStamp("alliance")}
          >
            ▸ {t(bi("Connect via HOLOVERSE Explorers HQ", "HOLOVERSE国際コミュニティで交信する"))}
          </a>
          <a
            href={LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn ac-violet"
          >
            ▸ {t(bi("Direct Message Founder (Rodorin)", "創設者ロドリンへ直接メッセージ"))}
          </a>
        </div>
      </div>
    </div>
  );
}
