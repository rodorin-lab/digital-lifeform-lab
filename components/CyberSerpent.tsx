"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

// CYBER SERPENT X — a neon Snake, playable in the browser. Pure Canvas,
// keyboard + swipe controls, no dependencies. Ships as a route so it
// deploys with the site (a real, hosted, playable experiment).

const GRID = 22;
const TICK_START = 140; // ms per step
const TICK_MIN = 70;

type Pt = { x: number; y: number };
type Phase = "idle" | "playing" | "over";

export default function CyberSerpent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const { t } = useLang();

  // mutable game state (kept in refs so the loop doesn't re-create)
  const snake = useRef<Pt[]>([]);
  const dir = useRef<Pt>({ x: 1, y: 0 });
  const nextDir = useRef<Pt>({ x: 1, y: 0 });
  const food = useRef<Pt>({ x: 10, y: 10 });
  const acc = useRef(0);
  const last = useRef(0);
  const tick = useRef(TICK_START);
  const raf = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    try {
      const b = Number(localStorage.getItem("cyber-serpent-best") || "0");
      if (b > 0) setBest(b);
    } catch { /* ignore */ }
  }, []);

  const placeFood = useCallback(() => {
    let p: Pt;
    do {
      p = { x: (Math.random() * GRID) | 0, y: (Math.random() * GRID) | 0 };
    } while (snake.current.some((s) => s.x === p.x && s.y === p.y));
    food.current = p;
  }, []);

  const reset = useCallback(() => {
    snake.current = [{ x: 8, y: 11 }, { x: 7, y: 11 }, { x: 6, y: 11 }];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    tick.current = TICK_START;
    acc.current = 0;
    scoreRef.current = 0;
    setScore(0);
    placeFood();
  }, [placeFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const cell = size / GRID;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, size, size);

    // grid
    ctx.strokeStyle = "rgba(0,255,240,0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke();
    }

    // food (magenta)
    const f = food.current;
    ctx.fillStyle = "#ff3ae0";
    ctx.shadowColor = "#ff3ae0";
    ctx.shadowBlur = 16;
    ctx.fillRect(f.x * cell + cell * 0.2, f.y * cell + cell * 0.2, cell * 0.6, cell * 0.6);

    // snake (cyan gradient head → tail)
    snake.current.forEach((s, i) => {
      const head = i === 0;
      ctx.fillStyle = head ? "#00fff0" : `rgba(0,255,240,${Math.max(0.25, 1 - i / snake.current.length)})`;
      ctx.shadowColor = "#00fff0";
      ctx.shadowBlur = head ? 18 : 8;
      const pad = head ? 0.06 : 0.14;
      ctx.fillRect(s.x * cell + cell * pad, s.y * cell + cell * pad, cell * (1 - pad * 2), cell * (1 - pad * 2));
    });
    ctx.shadowBlur = 0;
  }, []);

  const step = useCallback(() => {
    const d = nextDir.current;
    dir.current = d;
    const head = snake.current[0];
    const nx = head.x + d.x;
    const ny = head.y + d.y;

    // collision: walls or self
    if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID || snake.current.some((s) => s.x === nx && s.y === ny)) {
      setPhase("over");
      setBest((prev) => {
        const nb = Math.max(prev, scoreRef.current);
        try { localStorage.setItem("cyber-serpent-best", String(nb)); } catch { /* ignore */ }
        return nb;
      });
      return;
    }

    const newHead = { x: nx, y: ny };
    snake.current = [newHead, ...snake.current];
    if (nx === food.current.x && ny === food.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      tick.current = Math.max(TICK_MIN, TICK_START - scoreRef.current * 3);
      placeFood();
    } else {
      snake.current.pop();
    }
  }, [placeFood]);

  // main loop
  useEffect(() => {
    if (phase !== "playing") return;
    last.current = performance.now();
    const loop = (now: number) => {
      const dt = now - last.current;
      last.current = now;
      acc.current += dt;
      while (acc.current >= tick.current) {
        acc.current -= tick.current;
        step();
      }
      draw();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, step, draw]);

  // redraw board on idle/over so it isn't blank
  useEffect(() => {
    if (phase !== "playing") {
      if (snake.current.length === 0) reset();
      draw();
    }
  }, [phase, draw, reset]);

  const startGame = useCallback(() => {
    reset();
    setPhase("playing");
  }, [reset]);

  const turn = useCallback((x: number, y: number) => {
    // disallow reversing directly
    if (dir.current.x === -x && dir.current.y === -y) return;
    nextDir.current = { x, y };
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      if (k === "arrowup" || k === "w") turn(0, -1);
      else if (k === "arrowdown" || k === "s") turn(0, 1);
      else if (k === "arrowleft" || k === "a") turn(-1, 0);
      else if (k === "arrowright" || k === "d") turn(1, 0);
      else if (k === " " || k === "enter") { if (phase !== "playing") startGame(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn, phase, startGame]);

  // touch swipe
  const touch = useRef<Pt | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) { if (phase !== "playing") startGame(); return; }
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span className="font-mono neon" style={{ fontSize: "0.9rem", letterSpacing: "0.1em" }}>{t({ en: "SCORE", ja: "スコア" })} {score}</span>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>{t({ en: "BEST", ja: "最高" })} {best}</span>
      </div>

      <div className="holo ac-cyan" style={{ position: "relative", padding: 8, aspectRatio: "1 / 1" }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
        <canvas ref={canvasRef} width={484} height={484} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />

        {phase !== "playing" && (
          <div style={{ position: "absolute", inset: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(4,6,11,0.78)", textAlign: "center", gap: 14 }}>
            <div className="font-display neon" style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "0.08em" }}>
              {phase === "over" ? t({ en: "GAME OVER", ja: "ゲームオーバー" }) : "CYBER SERPENT X"}
            </div>
            {phase === "over" && <div className="font-mono" style={{ color: "var(--magenta)", fontSize: "0.9rem" }}>{t({ en: "SCORE", ja: "スコア" })} {score}</div>}
            <button className="btn btn-solid ac-cyan" onClick={startGame}>
              ▸ {phase === "over" ? t({ en: "Play again", ja: "もう一度" }) : t({ en: "Start", ja: "スタート" })}
            </button>
            <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-dim)", letterSpacing: "0.06em" }}>
              {t({ en: "Arrow keys / WASD · swipe on mobile", ja: "矢印キー / WASD · モバイルはスワイプ" })}
            </div>
          </div>
        )}
      </div>

      {/* on-screen dpad for touch */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 56px)", gridTemplateRows: "repeat(2, 56px)", gap: 6, justifyContent: "center", marginTop: 16 }}>
        <div />
        <DPad onClick={() => turn(0, -1)}>▲</DPad>
        <div />
        <DPad onClick={() => turn(-1, 0)}>◀</DPad>
        <DPad onClick={() => turn(0, 1)}>▼</DPad>
        <DPad onClick={() => turn(1, 0)}>▶</DPad>
      </div>
    </div>
  );
}

function DPad({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="font-mono" style={{ cursor: "pointer", border: "1px solid rgba(0,255,240,0.35)", background: "rgba(0,255,240,0.06)", color: "var(--cyan)", borderRadius: 4, fontSize: 18 }}>
      {children}
    </button>
  );
}
