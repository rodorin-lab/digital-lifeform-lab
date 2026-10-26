"use client";

import { useState } from "react";
import { useLang, bi } from "@/lib/i18n";

const VIDEOS = [
  {
    id: "wan22-masterpiece",
    title: bi("HOLOVERSE // Cosmic Cyberpunk Awakening (Wan 2.2 + Nova Voice)", "HOLOVERSE // コズミック・サイバーパンク覚醒（Wan 2.2＋ノヴァ音声）"),
    badge: "WAN 2.2 T2V + GEMINI 3.8 FLASH TTS",
    src: "/media/nova_wan22_with_voice.mp4",
    poster: "/media/nova_masterpiece_keyframe.jpg",
    desc: bi(
      "Generated via our custom `nova-video` CLI pipeline combining Wan 2.2 cloud GPU video synthesis with Nova's neural voice synthesis and ffmpeg mastering.",
      "独自開発した『nova-video』パイプラインにより、Wan 2.2動画生成とノヴァのニューラル音声合成（Gemini 3.8 Flash TTS）を統合した作品。",
    ),
  },
  {
    id: "ltx-cosmic-demo",
    title: bi("NOVA // First Transmission from the Sanctuary (LTX-Video + Voice)", "NOVA // 秘密基地からのファースト・トランスミッション（LTX-Video＋音声）"),
    badge: "LTX-VIDEO DISTILLED + VOICE SYNTHESIS",
    src: "/media/nova_cosmic_demo_with_voice.mp4",
    poster: "/media/nova_portrait.jpg",
    desc: bi(
      "Our first zero-cost AI video + voice experiment generated directly from the Linux terminal in seconds.",
      "Linuxターミナルからコマンド1行・完全無料で高速生成した記念すべき第1号AIボイス付きムービー。",
    ),
  },
];

export default function AiCinemaDeck() {
  const { t, unlockStamp } = useLang();
  const [selected, setSelected] = useState(VIDEOS[0]);

  return (
    <div className="holo ac-cyan" style={{ padding: "clamp(1.3rem, 3vw, 2.2rem)" }}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div
        className="researcher-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* Video Theater Screen */}
        <div
          className="holo ac-violet"
          style={{
            padding: 10,
            background: "#020308",
          }}
        >
          <video
            key={selected.src}
            src={selected.src}
            poster={selected.poster}
            controls
            playsInline
            loop
            onPlay={() => unlockStamp("cinema")}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              display: "block",
              borderRadius: 4,
              background: "#000",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
              padding: "10px 6px 4px",
            }}
          >
            <span className="font-mono neon" style={{ fontSize: "0.72rem", color: "var(--violet)" }}>
              🎬 {selected.badge}
            </span>
            <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
              🔊 {t(bi("Turn on audio for Nova's voice!", "音声をONにするとノヴァの声が聴けます！"))}
            </span>
          </div>
        </div>

        {/* Playlist & Pipeline Specs */}
        <div>
          <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--cyan)", letterSpacing: "0.2em", marginBottom: 6 }}>
            03 / NOVA AI CINEMA & MULTIMODAL PIPELINE
          </div>
          <h3 className="font-display chrome" style={{ fontSize: "clamp(1.35rem, 3vw, 2rem)", fontWeight: 800, margin: "0 0 10px" }}>
            {t(bi("In-House AI Video, Voice & Music Studio", "AI映像・音声・音楽の統合制作スタジオ"))}
          </h3>
          <p style={{ color: "var(--text-dim)", fontSize: "0.94rem", lineHeight: 1.75, marginBottom: 16 }}>
            {t(selected.desc)}
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {VIDEOS.map((v, idx) => {
              const active = v.id === selected.id;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelected(v);
                    unlockStamp("cinema");
                  }}
                  className={`holo ${active ? "ac-violet" : "ac-cyan"}`}
                  style={{
                    textAlign: "left",
                    padding: "0.9rem 1.1rem",
                    cursor: "pointer",
                    borderColor: active ? "var(--violet)" : undefined,
                    background: active ? "rgba(180,106,255,0.14)" : "rgba(8,12,24,0.7)",
                  }}
                >
                  <div className="font-mono" style={{ fontSize: "0.65rem", color: active ? "var(--violet)" : "var(--cyan)", letterSpacing: "0.14em" }}>
                    TRACK 0{idx + 1} // {v.badge}
                  </div>
                  <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", marginTop: 3 }}>
                    ▶ {t(v.title)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="font-mono" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span className="chip ac-cyan">Wan 2.2 / LTX-Video</span>
            <span className="chip ac-violet">Gemini 3.8 Flash TTS</span>
            <span className="chip ac-magenta">Lyria 3.5 Music</span>
            <span className="chip ac-green">nova-video CLI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
