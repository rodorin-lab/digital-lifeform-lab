"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, bi } from "@/lib/i18n";
import { LINKS } from "@/lib/content";

type WarpTarget = {
  name: string;
  tag: { en: string; ja: string };
  href: string;
  external?: boolean;
};

const WARP_TARGETS: WarpTarget[] = [
  {
    name: "OFFICIAL HOLOVERSE 3D WEBXR WORLD (Quest 3 / PC)",
    tag: bi("3D SPATIAL SANCTUARY & VR", "公式3D WebXR空間＆Quest 3没入"),
    href: "/webxr",
  },
  {
    name: "HOLOVERSE: STAR BREAKER 3D (Three.js Boss Combat)",
    tag: bi("3D SPACE COMBAT GAME", "本格3Dスペース・シューティング"),
    href: "/play/star-breaker",
  },
  {
    name: "DOT QUEST RPG",
    tag: bi("FANTASY BROWSER RPG", "ドット絵ブラウザRPG"),
    href: LINKS.dotQuest,
    external: true,
  },
  {
    name: "AI MONSTER FACTORY",
    tag: bi("AI CREATURE LAB & RANCH", "AIモンスター生成ラボ"),
    href: LINKS.monster,
    external: true,
  },
  {
    name: "NOVA CORTEX NEURO-SIMULATOR",
    tag: bi("LIVE 6-THEORY AI BRAIN", "リアルタイム脳シミュレーター"),
    href: "#neuro-ai",
  },
  {
    name: "CYBER SERPENT X",
    tag: bi("NEON SNAKE EXPERIMENT", "サイバーパンクSnake"),
    href: "/play/cyber-serpent",
  },
  {
    name: "VR STUDIO ALLIANCE DECK",
    tag: bi("FOR VR CEOs & PARTNERS", "VR開発企業・CEO向け提携"),
    href: "/alliance",
  },
];

export default function StargateHero() {
  const { t, mode, unlockStamp } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [warping, setWarping] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<WarpTarget | null>(null);
  const warpSpeedRef = useRef(1);

  useEffect(() => {
    if (mode === "lite") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 440;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const stars = Array.from({ length: mode === "quest3" ? 65 : 110 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 18 + Math.random() * 185,
      z: Math.random() * 1,
      color:
        Math.random() > 0.65
          ? "#00fff0"
          : Math.random() > 0.35
            ? "#b46aff"
            : "#ff3ae0",
    }));

    let angle = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const spd = warpSpeedRef.current;
      angle += 0.012 * spd;

      // Outer cosmic glow
      const grad = ctx.createRadialGradient(cx, cy, 12, cx, cy, 205);
      grad.addColorStop(0, "rgba(180, 106, 255, 0.36)");
      grad.addColorStop(0.45, "rgba(0, 255, 240, 0.16)");
      grad.addColorStop(0.78, "rgba(255, 58, 224, 0.08)");
      grad.addColorStop(1, "rgba(3, 4, 10, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 205, 0, Math.PI * 2);
      ctx.fill();

      // Rotating stargate rings
      const rings = [
        { r: 190, dash: [14, 10], col: "rgba(0, 255, 240, 0.55)", dir: 1, w: 2 },
        { r: 162, dash: [6, 14], col: "rgba(180, 106, 255, 0.65)", dir: -1.4, w: 2 },
        { r: 128, dash: [24, 12], col: "rgba(255, 58, 224, 0.5)", dir: 1.8, w: 1.5 },
        { r: 92, dash: [8, 8], col: "rgba(0, 255, 102, 0.45)", dir: -2.2, w: 1.5 },
      ];

      rings.forEach((rg) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle * rg.dir);
        ctx.strokeStyle = rg.col;
        ctx.lineWidth = rg.w;
        ctx.setLineDash(rg.dash);
        ctx.beginPath();
        ctx.arc(0, 0, rg.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Wormhole stars streaming outward
      for (const s of stars) {
        s.radius += (0.45 + s.z * 0.9) * spd;
        s.angle += 0.006 * spd;
        if (s.radius > 192) {
          s.radius = 12 + Math.random() * 20;
          s.angle = Math.random() * Math.PI * 2;
        }
        const x = cx + Math.cos(s.angle) * s.radius;
        const y = cy + Math.sin(s.angle) * s.radius;
        const r = 1.1 + (s.radius / 192) * 1.8;

        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        if (spd > 1.5) {
          const tx = cx + Math.cos(s.angle) * (s.radius - 14 * spd);
          const ty = cy + Math.sin(s.angle) * (s.radius - 14 * spd);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      // Singularity core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 2);
      ctx.strokeStyle = "#00fff0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = Math.cos(a) * 34;
        const py = Math.sin(a) * 34;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const triggerPortalRoulette = () => {
    unlockStamp("gateway");
    setWarping(true);
    warpSpeedRef.current = 6.5;
    const pick = WARP_TARGETS[Math.floor(Math.random() * WARP_TARGETS.length)];
    setTimeout(() => {
      warpSpeedRef.current = 1;
      setWarping(false);
      setSelectedTarget(pick);
    }, 900);
  };

  return (
    <div
      className="holo ac-violet anim-border"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background:
          "radial-gradient(circle at 50% 42%, rgba(180,106,255,0.16), rgba(9,13,26,0.88) 72%)",
      }}
    >
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div
        className="font-mono"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          color: "var(--violet)",
          marginBottom: 8,
        }}
      >
        ✦ STARGATE // ACTIVE SINGULARITY
      </div>

      {/* Interactive 3D Stargate or Lite SVG fallback */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 340,
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mode !== "lite" ? (
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: "50%",
              border: "3px dashed var(--cyan)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(0,255,240,0.25)",
            }}
          >
            <span className="font-display neon" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              HOLOVERSE GATE
            </span>
          </div>
        )}

        {/* Orbiting labels */}
        <div
          className="font-mono"
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            fontSize: "0.64rem",
            padding: "3px 8px",
            background: "rgba(3,4,10,0.82)",
            border: "1px solid rgba(0,255,240,0.4)",
            color: "var(--cyan)",
            borderRadius: 999,
          }}
        >
          01 // WORLD LAB
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            fontSize: "0.64rem",
            padding: "3px 8px",
            background: "rgba(3,4,10,0.82)",
            border: "1px solid rgba(180,106,255,0.45)",
            color: "var(--violet)",
            borderRadius: 999,
          }}
        >
          02 // NOVA CORTEX
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            bottom: 8,
            left: 10,
            fontSize: "0.64rem",
            padding: "3px 8px",
            background: "rgba(3,4,10,0.82)",
            border: "1px solid rgba(0,255,102,0.4)",
            color: "var(--green)",
            borderRadius: 999,
          }}
        >
          03 // HANGAR
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            bottom: 8,
            right: 10,
            fontSize: "0.64rem",
            padding: "3px 8px",
            background: "rgba(3,4,10,0.82)",
            border: "1px solid rgba(255,138,42,0.45)",
            color: "var(--orange)",
            borderRadius: 999,
          }}
        >
          04 // VR ALLIANCE
        </div>
      </div>

      {/* Portal Roulette Controls */}
      <div style={{ width: "100%", marginTop: 10, display: "grid", gap: 8 }}>
        <a
          href="/webxr"
          className="btn btn-solid ac-cyan"
          style={{ width: "100%", fontSize: "0.82rem", textDecoration: "none" }}
        >
          🥽 {t(bi("ENTER OFFICIAL 3D WEBXR WORLD (QUEST 3 / PC)", "公式 3D WebXR ワールドへ突入（Quest 3 / PC）"))}
        </a>
        <button
          onClick={triggerPortalRoulette}
          className="btn ac-violet"
          style={{ width: "100%", fontSize: "0.78rem" }}
        >
          {warping
            ? t(bi("⚡ ENGAGING HYPERDRIVE WARP...", "⚡ ハイパードライブ・ワープ中..."))
            : t(bi("🎲 PORTAL ROULETTE // RANDOM WORLD JUMP", "🎲 ポータル・ルーレット（ランダム世界ワープ）"))}
        </button>

        {selectedTarget && (
          <div
            className="holo ac-cyan"
            style={{
              marginTop: 12,
              padding: "0.9rem 1rem",
              textAlign: "left",
              background: "rgba(4,8,18,0.92)",
            }}
          >
            <div
              className="font-mono"
              style={{ fontSize: "0.65rem", color: "var(--green)", letterSpacing: "0.14em" }}
            >
              ▸ DESTINATION LOCKED // {t(selectedTarget.tag)}
            </div>
            <div
              className="font-display"
              style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text)", margin: "4px 0 8px" }}
            >
              {selectedTarget.name}
            </div>
            <a
              href={selectedTarget.href}
              target={selectedTarget.external ? "_blank" : undefined}
              rel={selectedTarget.external ? "noopener noreferrer" : undefined}
              className="btn ac-cyan"
              style={{ padding: "0.5em 1.1em", fontSize: "0.75rem", width: "100%" }}
            >
              ▸ {t(bi("ENTER DESTINATION NOW →", "このワールドへ突入する →"))}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
