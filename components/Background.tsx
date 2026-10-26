"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";

type P = { x: number; y: number; vx: number; vy: number };

export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { mode } = useLang();

  useEffect(() => {
    if (mode === "lite") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    let particles: P[] = [];
    let drops: number[] = [];
    const FS = 16;
    const GLYPHS = "HOLOVERSEノヴァシンクロ0123456789ΣΔΩ✦⬡".split("");
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const maxParticles = mode === "quest3" ? 55 : 100;
      const count = Math.min(maxParticles, Math.floor((w * h) / 17000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }));
      drops = Array(Math.floor(w / FS))
        .fill(0)
        .map(() => Math.random() * -50);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const LINK = mode === "quest3" ? 110 : 138;

    const drawMatrix = () => {
      if (mode === "quest3") return; // Keep Quest 3 VR view extra clean
      ctx.font = `${FS}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const x = i * FS;
        const y = drops[i] * FS;
        ctx.fillStyle = "rgba(180,106,255,0.045)";
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.45;
      }
    };

    const drawNet = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.24;
            ctx.strokeStyle = `rgba(140,170,255,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        const near = Math.hypot(p.x - mouse.x, p.y - mouse.y) < 160;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? 2.4 : 1.3, 0, Math.PI * 2);
        ctx.fillStyle = near
          ? "rgba(180,106,255,0.95)"
          : "rgba(0,255,240,0.68)";
        ctx.fill();
      }
    };

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      drawMatrix();
      drawNet();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "var(--bg)" }} />
      {mode !== "lite" && (
        <div className="pointer-events-none fixed inset-0 z-0" style={{ overflow: "hidden" }} aria-hidden>
          <span className="aurora a1" />
          <span className="aurora a2" />
          <span className="aurora a3" />
        </div>
      )}
      {mode !== "lite" && (
        <canvas ref={ref} className="bg-canvas pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.58 }} />
      )}

      <style>{`
        .aurora {
          position: absolute; border-radius: 50%; filter: blur(95px); opacity: 0.46;
          mix-blend-mode: screen; will-change: transform;
        }
        .aurora.a1 { width: 46vw; height: 46vw; left: -8vw; top: -10vw;
          background: radial-gradient(circle, rgba(0,255,240,0.42), transparent 65%);
          animation: drift1 24s ease-in-out infinite; }
        .aurora.a2 { width: 52vw; height: 52vw; right: -12vw; top: 16vh;
          background: radial-gradient(circle, rgba(180,106,255,0.44), transparent 65%);
          animation: drift2 30s ease-in-out infinite; }
        .aurora.a3 { width: 42vw; height: 42vw; left: 28vw; bottom: -14vw;
          background: radial-gradient(circle, rgba(255,58,224,0.34), transparent 65%);
          animation: drift3 27s ease-in-out infinite; }
        @keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(8vw,6vh) scale(1.15); } }
        @keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-7vw,4vh) scale(1.1); } }
        @keyframes drift3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(5vw,-6vh) scale(1.2); } }
        @media (prefers-reduced-motion: reduce) { .aurora { animation: none !important; } }
      `}</style>
    </>
  );
}
