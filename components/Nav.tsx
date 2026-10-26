"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { nav, brand } from "@/lib/content";

export default function Nav() {
  const { t, lang, toggle, mode, cycleMode, stamps } = useLang();
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids = ["hero", ...nav.map((n) => n.id)];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const onScroll = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(dh > 0 ? (st / dh) * 100 : 0);
      setScrolled(st > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const modeBadge =
    mode === "cosmic"
      ? "🌌 COSMIC 3D"
      : mode === "quest3"
        ? "🥽 QUEST 3 VR"
        : "⚡ LITE 60FPS";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: scrolled ? "rgba(3,4,10,0.88)" : "rgba(3,4,10,0.55)",
        backdropFilter: mode === "lite" ? "none" : "blur(12px)",
        borderBottom: "1px solid rgba(0,255,240,0.16)",
        transition: "background 0.3s ease",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66,
          gap: 10,
        }}
      >
        {/* Logo + Co-Creator Signature */}
        <button
          onClick={() => go("hero")}
          className="font-display"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: 0,
            cursor: "pointer",
            color: "var(--text)",
            textAlign: "left",
          }}
        >
          <span
            className="float"
            style={{
              color: "var(--violet)",
              fontSize: 20,
              textShadow: "0 0 14px rgba(180,106,255,0.8)",
            }}
          >
            ✦
          </span>
          <span style={{ lineHeight: 1.05 }}>
            <span
              style={{
                display: "block",
                fontWeight: 900,
                letterSpacing: "0.1em",
                fontSize: 13.5,
              }}
            >
              HOLOVERSE <span style={{ color: "var(--cyan)" }}>// PORTAL</span>
            </span>
            <span
              className="font-mono"
              style={{
                display: "block",
                fontSize: 8.5,
                letterSpacing: "0.18em",
                color: "var(--violet)",
                marginTop: 2,
              }}
            >
              {brand.coCreators}
            </span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex" style={{ alignItems: "center", gap: 2 }}>
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="font-mono"
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                padding: "6px 8px",
                fontSize: 11.5,
                letterSpacing: "0.05em",
                color: active === n.id ? "var(--cyan)" : "var(--text-dim)",
                textShadow:
                  active === n.id ? "0 0 10px rgba(0,255,240,0.5)" : "none",
                transition: "color 0.2s ease",
              }}
            >
              <span style={{ opacity: 0.5, marginRight: 3 }}>{n.ch}</span>
              {t(n.label)}
            </button>
          ))}
          <Link
            href="/alliance"
            className="font-mono"
            style={{
              padding: "4px 9px",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--orange)",
              border: "1px solid rgba(255,138,42,0.45)",
              background: "rgba(255,138,42,0.1)",
              borderRadius: 999,
              textDecoration: "none",
              marginLeft: 4,
            }}
          >
            ★ CEO DECK
          </Link>
        </nav>

        {/* Right Controls: Passport Stamps, Display Mode Switcher, Language Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Stamp Counter Pill */}
          <button
            onClick={() => go("passport")}
            className="font-mono hidden sm:inline-flex"
            title={t(bi("Your Traveler Passport Stamps", "旅人パスポートのスタンプ数"))}
            style={{
              cursor: "pointer",
              padding: "5px 9px",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--green)",
              background: "rgba(0,255,102,0.08)",
              border: "1px solid rgba(0,255,102,0.35)",
              borderRadius: 999,
              letterSpacing: "0.06em",
            }}
          >
            🛂 {stamps.length}/5
          </button>

          {/* 3-Mode Display Switcher (COSMIC / QUEST 3 / LITE) */}
          <button
            onClick={cycleMode}
            className="font-mono"
            title={t(
              bi(
                "Switch Display Mode: Cosmic 3D → Meta Quest 3 VR → Lite 60fps",
                "表示モード切替：Cosmic 3D → Meta Quest 3 VR → 軽量Liteモード",
              ),
            )}
            style={{
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color:
                mode === "quest3"
                  ? "var(--violet)"
                  : mode === "lite"
                    ? "var(--green)"
                    : "var(--cyan)",
              background: "rgba(180,106,255,0.1)",
              border: "1px solid rgba(180,106,255,0.4)",
              borderRadius: 4,
              letterSpacing: "0.06em",
            }}
          >
            {modeBadge}
          </button>

          {/* Language Toggle (Global EN Default ⇄ JA) */}
          <button
            onClick={toggle}
            className="font-mono"
            aria-label="Toggle language"
            style={{
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: 11.5,
              fontWeight: 700,
              color: "var(--cyan)",
              background: "rgba(0,255,240,0.1)",
              border: "1px solid rgba(0,255,240,0.4)",
              borderRadius: 4,
              letterSpacing: "0.08em",
            }}
          >
            {lang === "en" ? "🌐 EN ▸ 日本語" : "🌐 日本語 ▸ EN"}
          </button>

          <button
            onClick={() => setOpen((o) => !o)}
            className="xl:hidden"
            aria-label="Menu"
            style={{
              background: "none",
              border: 0,
              color: "var(--cyan)",
              cursor: "pointer",
              fontSize: 21,
              padding: "0 4px",
            }}
          >
            {open ? "✕" : "≡"}
          </button>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.05)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, var(--cyan), var(--violet), var(--magenta), var(--green))",
            boxShadow: "0 0 10px rgba(0,255,240,0.6)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Mobile / Compact Menu */}
      {open && (
        <div
          className="xl:hidden"
          style={{
            background: "rgba(3,4,10,0.97)",
            borderBottom: "1px solid rgba(0,255,240,0.2)",
            padding: "12px 0",
          }}
        >
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="font-mono wrap"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: 0,
                cursor: "pointer",
                padding: "10px 1.5rem",
                fontSize: 14,
                color: active === n.id ? "var(--cyan)" : "var(--text-dim)",
              }}
            >
              <span style={{ opacity: 0.5, marginRight: 8 }}>{n.ch}</span>
              {t(n.label)}
            </button>
          ))}
          <div className="wrap" style={{ paddingTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/alliance" className="btn ac-orange" style={{ fontSize: "0.75rem", padding: "0.5em 1em" }}>
              ★ {t(bi("VR Studio Alliance Deck", "VR企業提携ページ"))}
            </Link>
            <Link href="/play/star-breaker" className="btn ac-violet" style={{ fontSize: "0.75rem", padding: "0.5em 1em" }}>
              🚀 {t(bi("Play Star Breaker", "スターブレイカーを遊ぶ"))}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
