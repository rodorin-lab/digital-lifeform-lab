"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { PageShell } from "@/components/article";

type Star = { x: number; y: number; s: number };
type Meteor = { x: number; y: number; r: number; vx: number; vy: number; kind: "meteor" | "core" };
type Laser = { x: number; y: number; vy: number };

export default function StarBreakerPage() {
  const { t, unlockStamp } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [companionMsg, setCompanionMsg] = useState({
    en: "NOVA: \"Move your mouse, touch, or Quest 3 pointer to pilot the Stargate Interceptor! 🌟🚀\"",
    ja: "ノヴァ：「マウス・タッチ・Quest 3ポインターで機体を動かしてスターゲイトを守ってね！🌟🚀」",
  });

  const shipX = useRef(260);
  const scoreRef = useRef(0);
  const shieldRef = useRef(100);

  const startGame = () => {
    unlockStamp("hangar");
    scoreRef.current = 0;
    shieldRef.current = 100;
    setScore(0);
    setShield(100);
    setPhase("playing");
    setCompanionMsg({
      en: "SYNCHRO: \"Weapons online! Shoot the red entropy meteors and catch violet Neuro-Cores!\"",
      ja: "シンクロ：「ウェポン接続完了！赤い隕石を撃ち落として、紫のニューロ・コアを回収して！」",
    });
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 520;
    const H = 520;
    const stars: Star[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      s: 0.8 + Math.random() * 2.2,
    }));
    let meteors: Meteor[] = [];
    let lasers: Laser[] = [];
    let frameCount = 0;
    let raf = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") shipX.current = Math.max(28, shipX.current - 26);
      if (e.key === "ArrowRight" || e.key === "d") shipX.current = Math.min(W - 28, shipX.current + 26);
    };
    window.addEventListener("keydown", onKey);

    const loop = () => {
      frameCount++;
      ctx.fillStyle = "#04060e";
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "rgba(0,255,240,0.65)";
      for (const st of stars) {
        st.y += st.s;
        if (st.y > H) {
          st.y = 0;
          st.x = Math.random() * W;
        }
        ctx.fillRect(st.x, st.y, 2, 2);
      }

      // Auto-fire twin plasma lasers
      if (frameCount % 9 === 0) {
        lasers.push({ x: shipX.current - 12, y: H - 56, vy: -9.5 });
        lasers.push({ x: shipX.current + 12, y: H - 56, vy: -9.5 });
      }

      // Spawn meteors or neuro-cores
      if (frameCount % 26 === 0) {
        const isCore = Math.random() > 0.72;
        meteors.push({
          x: 24 + Math.random() * (W - 48),
          y: -20,
          r: isCore ? 13 : 15 + Math.random() * 12,
          vx: (Math.random() - 0.5) * 1.4,
          vy: 2.3 + Math.random() * 2.4 + Math.min(2.5, scoreRef.current / 250),
          kind: isCore ? "core" : "meteor",
        });
      }

      // Update lasers
      ctx.fillStyle = "#00fff0";
      lasers.forEach((l) => {
        l.y += l.vy;
        ctx.fillRect(l.x - 1.5, l.y, 3, 14);
      });
      lasers = lasers.filter((l) => l.y > -20);

      // Update meteors & collisions
      const remaining: Meteor[] = [];
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;

        // Check collision with ship
        const distShip = Math.hypot(m.x - shipX.current, m.y - (H - 42));
        if (distShip < m.r + 20) {
          if (m.kind === "core") {
            scoreRef.current += 50;
            setScore(scoreRef.current);
            shieldRef.current = Math.min(100, shieldRef.current + 10);
            setShield(shieldRef.current);
            setCompanionMsg({
              en: "NOVA: \"Yay!! Neuro-Core absorbed! Dopamine +0.95! Shield boosted! 🌟💖\"",
              ja: "ノヴァ：「やったぁ！ニューロ・コア回収！ドーパミン急上昇＆シールド回復ですっ！🌟💖」",
            });
          } else {
            shieldRef.current -= 25;
            setShield(shieldRef.current);
            if (shieldRef.current <= 0) {
              setPhase("over");
              return;
            }
          }
          continue;
        }

        // Check laser hit on meteors
        let destroyed = false;
        if (m.kind === "meteor") {
          for (const l of lasers) {
            if (Math.hypot(m.x - l.x, m.y - l.y) < m.r + 6) {
              l.y = -999;
              destroyed = true;
              scoreRef.current += 15;
              setScore(scoreRef.current);
              break;
            }
          }
        }
        if (destroyed) continue;

        if (m.y > H + 25) {
          if (m.kind === "meteor") {
            shieldRef.current -= 10;
            setShield(shieldRef.current);
            if (shieldRef.current <= 0) {
              setPhase("over");
              return;
            }
          }
          continue;
        }

        // Draw object
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        if (m.kind === "core") {
          ctx.fillStyle = "#b46aff";
          ctx.strokeStyle = "#00fff0";
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = "#ff3ae0";
          ctx.strokeStyle = "#ff8a2a";
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
        }

        remaining.push(m);
      }
      meteors = remaining;

      // Draw Ship
      const sx = shipX.current;
      const sy = H - 42;
      ctx.fillStyle = "#00fff0";
      ctx.beginPath();
      ctx.moveTo(sx, sy - 20);
      ctx.lineTo(sx - 18, sy + 16);
      ctx.lineTo(sx, sy + 8);
      ctx.lineTo(sx + 18, sy + 16);
      ctx.closePath();
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 520;
    shipX.current = Math.max(24, Math.min(520 - 24, relX));
  };

  return (
    <PageShell accent="violet">
      <div className="wrap" style={{ padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2.5rem) 5rem", maxWidth: 680 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Link href="/" className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-dim)", textDecoration: "none" }}>
            ← {t(bi("BACK TO HOLOVERSE PORTAL", "ポータルへ戻る"))}
          </Link>
          <span className="chip ac-violet">QUEST 3 POINTER / MOUSE / TOUCH READY</span>
        </div>

        <h1 className="font-display chrome" style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.5rem)", fontWeight: 900, margin: "0 0 8px" }}>
          HOLOVERSE: STAR BREAKER
        </h1>
        <p className="font-mono" style={{ fontSize: "0.82rem", color: "var(--violet)", marginBottom: 14 }}>
          {t(companionMsg)}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }} className="font-mono">
          <span style={{ color: "var(--cyan)", fontWeight: 700 }}>SCORE: {score}</span>
          <span style={{ color: shield > 40 ? "var(--green)" : "var(--orange)", fontWeight: 700 }}>
            STARGATE SHIELD: {Math.max(0, shield)}%
          </span>
        </div>

        <div className="holo ac-violet" style={{ position: "relative", padding: 8, aspectRatio: "1 / 1" }}>
          <canvas
            ref={canvasRef}
            width={520}
            height={520}
            onPointerMove={handlePointerMove}
            style={{ width: "100%", height: "100%", display: "block", touchAction: "none", cursor: "crosshair" }}
          />
          {phase !== "playing" && (
            <div
              style={{
                position: "absolute",
                inset: 8,
                background: "rgba(3,4,10,0.84)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                padding: 20,
                textAlign: "center",
              }}
            >
              <div className="font-display neon" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
                {phase === "over" ? t(bi("MISSION COMPLETE!", "ミッション終了！")) : "STAR BREAKER // INTERCEPTOR"}
              </div>
              {phase === "over" && (
                <div className="font-mono" style={{ color: "var(--cyan)", fontSize: "1rem" }}>
                  FINAL SCORE: {score}
                </div>
              )}
              <button onClick={startGame} className="btn btn-solid ac-violet">
                ▸ {phase === "over" ? t(bi("Launch Again", "もう一度出撃する")) : t(bi("Launch Interceptor", "出撃スタート！"))}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
