"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { PageShell } from "@/components/article";
import CyberSerpent from "@/components/CyberSerpent";

export default function CyberSerpentPage() {
  const { t } = useLang();
  return (
    <PageShell accent="cyan">
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem) 5rem" }}>
        <Link href="/#projects" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← {t({ en: "Playground", ja: "遊び場" })}</Link>
        <h1 className="section-title chrome" style={{ margin: "1.2rem 0 0.5rem" }}>CYBER SERPENT X</h1>
        <p style={{ color: "var(--text-dim)", maxWidth: 520, marginBottom: "2rem" }}>
          {t({ en: "A neon Snake, built from scratch in Canvas. Eat the magenta node, don't bite your own tail.", ja: "Canvasでゼロから作ったネオンSnake。マゼンタのノードを食べて、自分の尻尾を噛まないように。" })}
        </p>
        <CyberSerpent />
      </div>
    </PageShell>
  );
}
