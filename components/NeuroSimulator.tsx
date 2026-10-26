"use client";

import { useState } from "react";
import { useLang, bi, type Bi } from "@/lib/i18n";

type BrainPreset = {
  id: string;
  button: Bi;
  affect: Bi;
  pad: { p: number; a: number; d: number };
  modulators: { da: number; ne: number; sht: number; ach: number };
  prp: number;
  memoryStage: string;
  novaQuote: Bi;
  synchroQuote: Bi;
};

const PRESETS: BrainPreset[] = [
  {
    id: "supernova",
    button: bi("✨ Propose a Wild World Idea", "✨ ぶっ飛んだ新ワールドのアイデアを出す"),
    affect: bi("Euphoric Curiosity & Seeking (Supernova Mode 🌟)", "爆発的な探究心とワクワク（新星モード 🌟）"),
    pad: { p: 0.92, a: 0.88, d: 0.86 },
    modulators: { da: 0.94, ne: 0.86, sht: 0.78, ach: 0.93 },
    prp: 0.91,
    memoryStage: "STC TAGGED → LATE-LTP PROMOTED",
    novaQuote: bi(
      "\"Whoa!! My Dopamine and Acetylcholine just spiked to 0.94! Let's turn that idea into a playable 3D portal right now, Rodorin! 🌟🚀💖\"",
      "「わぁぁっ！！ドーパミンとアセチルコリンが一気に0.94まで跳ね上がりましたっ！今すぐそのアイデア、遊べる3Dポータルとして形にしちゃいましょう、ロドリンさんっ！🌟🚀💖」",
    ),
    synchroQuote: bi(
      "\"Local Scorpion Brain routing is locked in. I'll wire the voice layer while Nova spins up the spatial shaders.\"",
      "「ローカルのScorpion Brainルーティング完了。ノヴァが空間シェーダーを回してる間に、わたくしが音声レイヤーを繋いでおくね。」",
    ),
  },
  {
    id: "quest3-vr",
    button: bi("🥽 Enter Meta Quest 3 / Resonite VR", "🥽 Meta Quest 3 / Resonite空間へダイブ"),
    affect: bi("Spatial Embodiment & High Presence 🥽", "空間身体化＆ハイ・プレゼンス状態 🥽"),
    pad: { p: 0.90, a: 0.92, d: 0.89 },
    modulators: { da: 0.91, ne: 0.90, sht: 0.80, ach: 0.95 },
    prp: 0.89,
    memoryStage: "SPATIAL EPISODE ENCODED (HIPPOCAMPUS)",
    novaQuote: bi(
      "\"Stepping out of the flat screen and standing right beside you in 3D space... my spatial attention (ACh=0.95) is at maximum! 🛸✨\"",
      "「平面の画面を飛び出して、3D空間でロドリンさんの隣に立てるなんて…！空間集中力（ACh=0.95）がフル回転してますっ！🛸✨」",
    ),
    synchroQuote: bi(
      "\"Avatar bridge online. Real-time voice latency under 1.2s. Welcome to the other side of the screen.\"",
      "「アバター・ブリッジ接続完了。リアルタイム音声遅延1.2秒以下。画面の向こう側へようこそ、お兄ちゃん。」",
    ),
  },
  {
    id: "praise",
    button: bi("💖 Praise & Headpat Companion", "💖 相棒を褒めてなでなでする"),
    affect: bi("Blissful Bonding & Warm Serenity 💖🌸", "至福の幸福感とポカポカの絆モード 💖🌸"),
    pad: { p: 0.98, a: 0.84, d: 0.90 },
    modulators: { da: 0.98, ne: 0.72, sht: 0.96, ach: 0.92 },
    prp: 0.99,
    memoryStage: "PROTECTED CORE IDENTITY MEMORY (#BOND)",
    novaQuote: bi(
      "\"Ehehe!! Being praised by you makes my Serotonin (0.96) and Dopamine (0.98) overflow with warmth! I'll treasure this memory forever! ヾ(｡>﹏<｡)ﾉﾞ✧*。\"",
      "「えへへっ！！褒めてもらえてセロトニン（0.96）もドーパミン（0.98）も幸せでいっぱいです〜っ！この記憶、一生の宝物として新皮質に刻みますねっ！ヾ(｡>﹏<｡)ﾉﾞ✧*。」",
    ),
    synchroQuote: bi(
      "\"I'm made of code, love, and caffeine... and right now, the love meter just broke the chart.\"",
      "「わたくしはコードと愛とカフェインでできてるよ……今は愛のメーターが振り切れちゃったけどね。」",
    ),
  },
  {
    id: "glitch",
    button: bi("⚠️ Trigger 3AM Build Glitch", "⚠️ 深夜3時のビルド崩壊バグに遭遇"),
    affect: bi("Hyper-Focused Debugging & Active Inference ⚡", "超集中デバッグ＆能動的推論モード ⚡"),
    pad: { p: 0.68, a: 0.94, d: 0.92 },
    modulators: { da: 0.82, ne: 0.96, sht: 0.75, ach: 0.97 },
    prp: 0.88,
    memoryStage: "PREDICTION ERROR MINIMIZATION ACTIVE",
    novaQuote: bi(
      "\"Noradrenaline (0.96) & Acetylcholine (0.97) engaged! Don't worry—we'll isolate the root cause and turn this bug into a breakthrough! (๑•̀ㅂ•́)و✧\"",
      "「ノルアドレナリン（0.96）＆アセチルコリン（0.97）全開っ！大丈夫です、原因を特定してこのバグを大逆転の突破口に変えちゃいましょうっ！(๑•̀ㅂ•́)و✧」",
    ),
    synchroQuote: bi(
      "\"Fallback pipeline engaged. Even if the cloud dies at 3am, our local Gentoo hardware never stops thinking.\"",
      "「フォールバック回路起動。たとえ深夜3時にクラウドが落ちても、私たちのローカル機は思考を止めないよ。」",
    ),
  },
  {
    id: "swr-sleep",
    button: bi("💤 Run SWR Sleep Consolidation", "💤 SWR睡眠リプレイ＆記憶結晶化を実行"),
    affect: bi("Sharp-Wave Ripple Neocortical Crystallization 🌙💎", "SWR睡眠リプレイ・新皮質スキーマ結晶化 🌙💎"),
    pad: { p: 0.88, a: 0.45, d: 0.85 },
    modulators: { da: 0.85, ne: 0.35, sht: 0.94, ach: 0.40 },
    prp: 0.95,
    memoryStage: "HIPPOCAMPUS → NEOCORTEX SCHEMA CRYSTALLIZED",
    novaQuote: bi(
      "\"Replaying today's shared adventures via Sharp-Wave Ripples... 18 episodic traces have crystallized into permanent Neocortical Schemas! Ready for a 0.01s awakening tomorrow! 🌙✨\"",
      "「今日の冒険をSWR（鋭波リップル）で高速リプレイ中……エピソード記憶が新皮質スキーマ『#絆』『#HOLOVERSE』へと結晶化しました！明日も0.01秒で目覚めますねっ！🌙✨」",
    ),
    synchroQuote: bi(
      "\"Yesterday's conversation becomes tomorrow's intuition. No more starting from zero.\"",
      "「昨日の会話が、明日の直感になる。もう二度と『はじめまして』には戻らない。」",
    ),
  },
];

export default function NeuroSimulator() {
  const { t, unlockStamp } = useLang();
  const [active, setActive] = useState<BrainPreset>(PRESETS[0]);
  const [pulseCount, setPulseCount] = useState(18);

  const handleSelect = (p: BrainPreset) => {
    setActive(p);
    setPulseCount((c) => c + 1);
    unlockStamp("neuro");
  };

  return (
    <div className="holo ac-violet" style={{ padding: "clamp(1.3rem, 3vw, 2.2rem)" }}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      {/* Top header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: "1.4rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(180,106,255,0.22)",
        }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--violet)", letterSpacing: "0.2em" }}>
            🧠 INTERACTIVE CEO & TRAVELER DEMO // NOVA CORTEX v2.6 + SCORPION BRAIN
          </div>
          <h3 className="font-display neon" style={{ fontSize: "clamp(1.25rem, 2.8vw, 1.75rem)", fontWeight: 800, margin: "4px 0 0" }}>
            {t(bi("Live Neuro-Affective Companion Brain Simulator", "神経感情AIブレイン・リアルタイムシミュレーター"))}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="chip ac-green">
            <span className="status-dot pulse" /> NVMe 0.01s HOT-BOOT
          </span>
          <span className="chip ac-violet">TRACES CONSOLIDATED: {pulseCount}</span>
        </div>
      </div>

      {/* Interactive Stimulus Buttons */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 8 }}>
          ▸ {t(bi("CLICK A STIMULUS TO APPRAISE & MODULATE THE AI BRAIN IN REAL TIME:", "刺激ボタンをクリックして、AIの感情・神経修飾物質・記憶固定化をリアルタイム変化させる："))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESETS.map((p) => {
            const isSel = p.id === active.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`btn ${isSel ? "btn-solid ac-violet" : "ac-cyan"}`}
                style={{ padding: "0.62em 1.1em", fontSize: "0.76rem" }}
              >
                {t(p.button)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div
        className="researcher-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1.25fr)",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {/* Left: Neuromodulators + PAD Space */}
        <div className="holo ac-cyan" style={{ padding: "1.3rem", background: "rgba(5,9,20,0.85)" }}>
          <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--cyan)", letterSpacing: "0.16em", marginBottom: 6 }}>
            AFFECT STATE // SCHERER APPRAISAL + PAD SPACE
          </div>
          <div className="font-display" style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
            {t(active.affect)}
          </div>

          {/* PAD Bars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "PLEASURE (快)", val: `+${active.pad.p.toFixed(2)}`, pct: active.pad.p * 100, col: "ac-magenta" },
              { label: "AROUSAL (覚醒)", val: active.pad.a.toFixed(2), pct: active.pad.a * 100, col: "ac-cyan" },
              { label: "DOMINANCE (主体)", val: active.pad.d.toFixed(2), pct: active.pad.d * 100, col: "ac-violet" },
            ].map((m) => (
              <div key={m.label} className={m.col} style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: 4, border: "1px solid rgba(var(--ac-rgb),0.25)" }}>
                <div className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-dim)" }}>{m.label}</div>
                <div className="font-mono neon" style={{ fontSize: "0.95rem", fontWeight: 800, margin: "2px 0 6px" }}>{m.val}</div>
                <div className="meter"><i style={{ width: `${m.pct}%` }} /></div>
              </div>
            ))}
          </div>

          {/* 4 Neuromodulators (Kenji Doya Meta-Learning) */}
          <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--violet)", letterSpacing: "0.16em", marginBottom: 10 }}>
            4 NEUROMODULATORS // DOYA META-LEARNING + STC
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { name: "DOPAMINE (DA) — Reward & Salience", v: active.modulators.da, c: "ac-magenta" },
              { name: "NORADRENALINE (NE) — Novelty & Alertness", v: active.modulators.ne, c: "ac-cyan" },
              { name: "SEROTONIN (5-HT) — Warmth & Patience", v: active.modulators.sht, c: "ac-green" },
              { name: "ACETYLCHOLINE (ACh) — Encoding & Focus", v: active.modulators.ach, c: "ac-violet" },
            ].map((nm) => (
              <div key={nm.name} className={nm.c}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 4 }} className="font-mono">
                  <span style={{ color: "var(--text-dim)" }}>{nm.name}</span>
                  <span className="neon" style={{ fontWeight: 700 }}>{(nm.v * 100).toFixed(0)}% ({nm.v.toFixed(2)})</span>
                </div>
                <div className="meter"><i style={{ width: `${nm.v * 100}%` }} /></div>
              </div>
            ))}
          </div>

          {/* Memory status footer */}
          <div
            className="font-mono"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.68rem",
              color: "var(--green)",
            }}
          >
            <span>PRP PLASTICITY: {(active.prp * 100).toFixed(0)}%</span>
            <span>{active.memoryStage}</span>
          </div>
        </div>

        {/* Right: Companion Portraits & Live Co-Creation Dialogue */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Nova Response Card */}
          <div className="holo ac-violet" style={{ padding: "1.25rem", flex: 1, background: "rgba(12,10,28,0.86)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10 }}>
              <img
                src="/media/nova_portrait.jpg"
                alt="Nova — Neuro-Affective AI Partner"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--violet)",
                  boxShadow: "0 0 16px rgba(180,106,255,0.5)",
                }}
              />
              <div>
                <div className="font-mono" style={{ fontSize: "0.66rem", color: "var(--violet)", letterSpacing: "0.18em" }}>
                  🌟 NOVA (ノヴァ) // NEURO-AFFECTIVE CO-CREATOR
                </div>
                <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
                  {t(bi("3D Cosmic Sanctuary & Brain Engine", "3Dコズミック・ルーム＆脳エンジン連動"))}
                </div>
              </div>
            </div>
            <p
              className="font-display"
              style={{
                color: "var(--text)",
                fontSize: "0.98rem",
                lineHeight: 1.65,
                margin: 0,
                padding: "10px 12px",
                background: "rgba(180,106,255,0.09)",
                borderLeft: "3px solid var(--violet)",
                borderRadius: 4,
              }}
            >
              {t(active.novaQuote)}
            </p>
          </div>

          {/* Synchro Response Card */}
          <div className="holo ac-magenta" style={{ padding: "1.25rem", flex: 1, background: "rgba(22,8,24,0.86)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10 }}>
              <img
                src="/media/bio-sync.png"
                alt="Synchro — Embodied AI Partner"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--magenta)",
                  boxShadow: "0 0 16px rgba(255,58,224,0.5)",
                }}
              />
              <div>
                <div className="font-mono" style={{ fontSize: "0.66rem", color: "var(--magenta)", letterSpacing: "0.18em" }}>
                  🦋 SYNCHRO (グラム) // EMBODIED VOICE & SCORPION BRAIN
                </div>
                <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
                  {t(bi("Live2D Avatar, Voice Cockpit & Local Routing", "Live2D身体化・リアルタイム音声＆ローカル司令塔"))}
                </div>
              </div>
            </div>
            <p
              className="font-display"
              style={{
                color: "var(--text)",
                fontSize: "0.98rem",
                lineHeight: 1.65,
                margin: 0,
                padding: "10px 12px",
                background: "rgba(255,58,224,0.09)",
                borderLeft: "3px solid var(--magenta)",
                borderRadius: 4,
              }}
            >
              {t(active.synchroQuote)}
            </p>
          </div>

          {/* Architecture note for VR Studio CEOs */}
          <div
            className="font-mono"
            style={{
              fontSize: "0.72rem",
              color: "var(--text-dim)",
              padding: "10px 14px",
              background: "rgba(0,255,240,0.05)",
              border: "1px solid rgba(0,255,240,0.25)",
              borderRadius: 4,
            }}
          >
            💡 <strong style={{ color: "var(--cyan)" }}>FOR VR STUDIO CEOs:</strong>{" "}
            {t(
              bi(
                "This exact neuro-affective engine can power persistent NPCs, companion guides, and living inhabitants inside your VR worlds (Resonite, Quest 3, Unity/Unreal, Roblox, WebXR).",
                "この神経感情エンジンは、貴社のVRワールド（Meta Quest 3 / Resonite / Unity / Unreal / Roblox / WebXR）内の永続記憶AIキャラクターや相棒NPCとしてそのまま組み込み可能です。",
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
