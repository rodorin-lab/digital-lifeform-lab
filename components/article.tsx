"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Block, Entry, DiaryEntry, Kind } from "@/lib/collections";
import { kindBase } from "@/lib/collections";
import type { Accent } from "@/lib/content";
import { brand } from "@/lib/content";
import Background from "@/components/Background";
import { Reveal } from "@/components/motion";

const acClass = (a: Accent) => `ac-${a}`;

// Lightweight top bar for sub-pages (home link + language toggle).
export function SubNav() {
  const { lang, toggle } = useLang();
  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ background: "rgba(4,6,11,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,255,240,0.14)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <Link href="/" className="font-display" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--text)" }}>
          <span style={{ color: "var(--cyan)", fontSize: 17, textShadow: "0 0 12px rgba(0,255,240,0.6)" }}>⬡</span>
          <span style={{ lineHeight: 1 }}>
            <span style={{ display: "block", fontWeight: 800, letterSpacing: "0.1em", fontSize: 13 }}>DIGITAL LIFEFORM LAB</span>
            <span className="font-mono" style={{ display: "block", fontSize: 8, letterSpacing: "0.22em", color: "var(--magenta)", marginTop: 2 }}>{brand.signature}</span>
          </span>
        </Link>
        <button onClick={toggle} className="font-mono" aria-label="Toggle language" style={{ cursor: "pointer", padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "var(--cyan)", background: "rgba(0,255,240,0.08)", border: "1px solid rgba(0,255,240,0.35)", borderRadius: 2, letterSpacing: "0.1em" }}>
          {lang === "en" ? "EN" : "日本語"}
        </button>
      </div>
    </header>
  );
}

// Shared shell: background + subnav + content.
export function PageShell({ children, accent = "cyan" }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <div className={acClass(accent)}>
      <Background />
      <div className="fx-overlay" />
      <div className="scan-sweep" />
      <SubNav />
      <main style={{ position: "relative", zIndex: 2, paddingTop: 58 }}>{children}</main>
    </div>
  );
}

function Corners() {
  return (<><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /></>);
}

// One content block.
function BlockView({ block }: { block: Block }) {
  const { t } = useLang();
  switch (block.t) {
    case "h":
      return <h2 className="font-display neon" style={{ fontSize: "clamp(1.3rem,3.5vw,1.9rem)", fontWeight: 700, margin: "2rem 0 0.6rem", whiteSpace: "pre-line" }}>{t(block.text)}</h2>;
    case "p":
      return <p style={{ whiteSpace: "pre-line", color: "var(--text)", fontSize: "1.06rem", lineHeight: 1.9, margin: "0 0 1.1rem" }}>{t(block.text)}</p>;
    case "callout":
      return (
        <div className="holo" style={{ padding: "1.2rem 1.4rem", margin: "1.4rem 0", borderLeft: "3px solid var(--ac)" }}>
          <p style={{ whiteSpace: "pre-line", color: "var(--text)", margin: 0, fontSize: "1rem", lineHeight: 1.8 }}>{t(block.text)}</p>
        </div>
      );
    case "quote": {
      const isSyn = block.who === "SYNCHRO";
      const col = isSyn ? "var(--magenta)" : "var(--cyan)";
      return (
        <blockquote className={isSyn ? "ac-magenta" : "ac-cyan"} style={{ margin: "1.6rem 0", padding: "1.2rem 1.5rem", borderLeft: `3px solid ${col}`, background: "rgba(10,15,26,0.5)" }}>
          <div className="font-mono" style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: col, marginBottom: 8 }}>◇ {block.who}</div>
          <p className="font-display" style={{ whiteSpace: "pre-line", color: col, fontSize: "clamp(1.05rem,2.4vw,1.35rem)", fontWeight: 600, lineHeight: 1.55, margin: 0, textShadow: `0 0 16px rgba(var(--ac-rgb),0.3)` }}>{t(block.text)}</p>
        </blockquote>
      );
    }
    case "code":
      return (
        <pre className="font-mono" style={{ margin: "1.4rem 0", padding: "1.1rem 1.3rem", background: "rgba(4,7,13,0.85)", border: "1px solid rgba(var(--ac-rgb),0.25)", borderRadius: 4, overflowX: "auto", fontSize: "0.82rem", lineHeight: 1.7, color: "var(--text-dim)" }}>
          <code>{block.text}</code>
        </pre>
      );
  }
}

export function ArticleView({ entry }: { entry: Entry }) {
  const { t } = useLang();
  const backHref = `/${kindBase[entry.kind]}`;
  const backLabel: Record<Kind, { en: string; ja: string }> = {
    story: { en: "All stories", ja: "物語一覧" }, journal: { en: "All journal", ja: "ログ一覧" }, blog: { en: "All posts", ja: "記事一覧" },
  };
  return (
    <PageShell accent={entry.accent}>
      <article className="wrap" style={{ maxWidth: 760, padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 6rem" }}>
        <Reveal>
          <Link href={backHref} className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← {t(backLabel[entry.kind])}</Link>
        </Reveal>
        <Reveal delay={1}>
          <div className="kicker" style={{ margin: "1.4rem 0 0.8rem" }}>{t(entry.category)} · {entry.date} · {entry.readTime}</div>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="font-display chrome" style={{ fontSize: "clamp(1.8rem,5.5vw,3.2rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "0.01em", margin: "0 0 1rem", whiteSpace: "pre-line" }}>{t(entry.title)}</h1>
        </Reveal>
        <Reveal delay={2}>
          <p style={{ whiteSpace: "pre-line", color: "var(--text-dim)", fontSize: "1.12rem", lineHeight: 1.8, margin: "0 0 1.4rem" }}>{t(entry.summary)}</p>
        </Reveal>
        <Reveal delay={2}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "1rem" }}>
            {entry.tags.map((tg) => <span key={tg} className="chip">#{tg}</span>)}
          </div>
        </Reveal>
        <hr className="hr-neon" style={{ margin: "1.6rem 0 2rem" }} />
        <Reveal>
          <div>{entry.body.map((b, i) => <BlockView key={i} block={b} />)}</div>
        </Reveal>
        {entry.external && (
          <Reveal>
            <div style={{ marginTop: "2.2rem" }}>
              <a className="btn" href={entry.external.href} target="_blank" rel="noopener noreferrer">▸ {t(entry.external.label)}</a>
            </div>
          </Reveal>
        )}
        <Reveal>
          <div style={{ marginTop: "2.6rem", paddingTop: "1.4rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href={backHref} className="font-mono" style={{ fontSize: "0.78rem", color: "var(--ac)", textDecoration: "none", letterSpacing: "0.08em" }}>← {t(backLabel[entry.kind])}</Link>
          </div>
        </Reveal>
      </article>
    </PageShell>
  );
}

// Card for index pages and homepage teasers.
export function EntryCard({ entry, delay = 0 }: { entry: Entry; delay?: 0 | 1 | 2 | 3 | 4 }) {
  const { t } = useLang();
  return (
    <Reveal delay={delay} className={acClass(entry.accent)}>
      <Link href={`/${kindBase[entry.kind]}/${entry.slug}`} className="holo" style={{ display: "block", padding: "1.5rem", height: "100%", textDecoration: "none" }}>
        <Corners />
        <div className="font-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.12em", color: "rgba(var(--ac-rgb),0.9)", marginBottom: 10 }}>{t(entry.category)} · {entry.date} · {entry.readTime}</div>
        <h3 className="font-display" style={{ fontSize: "1.12rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.35, margin: "0 0 8px", whiteSpace: "pre-line" }}>{t(entry.title)}</h3>
        <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.7, margin: "0 0 12px" }}>{t(entry.summary)}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {entry.tags.slice(0, 3).map((tg) => <span key={tg} className="chip">#{tg}</span>)}
        </div>
        <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--ac)", letterSpacing: "0.08em", marginTop: 14 }}>▸ {t({ en: "Read", ja: "読む" })}</div>
      </Link>
    </Reveal>
  );
}

// Index page: header + grid of cards.
export function CollectionIndex({ title, lead, entries, accent }: { title: import("@/lib/i18n").Bi; lead: import("@/lib/i18n").Bi; entries: Entry[]; accent: Accent }) {
  const { t } = useLang();
  return (
    <PageShell accent={accent}>
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 5rem" }}>
        <Reveal><Link href="/" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← HOME</Link></Reveal>
        <Reveal delay={1}><h1 className="section-title chrome" style={{ margin: "1.2rem 0 0.6rem" }}>{t(title)}</h1></Reveal>
        <Reveal delay={2}><p style={{ color: "var(--text-dim)", maxWidth: 640, fontSize: "1.05rem", marginBottom: "2.6rem" }}>{t(lead)}</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 16 }}>
          {entries.map((e, i) => <EntryCard key={e.slug} entry={e} delay={(Math.min(i, 3) + 1) as 1 | 2 | 3 | 4} />)}
        </div>
      </div>
    </PageShell>
  );
}

// Diary: dated timeline of short entries.
export function DiaryTimeline({ title, lead, entries }: { title: import("@/lib/i18n").Bi; lead: import("@/lib/i18n").Bi; entries: DiaryEntry[] }) {
  const { t } = useLang();
  return (
    <PageShell accent="green">
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 5rem", maxWidth: 820 }}>
        <Reveal><Link href="/" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← HOME</Link></Reveal>
        <Reveal delay={1}><h1 className="section-title chrome" style={{ margin: "1.2rem 0 0.6rem" }}>{t(title)}</h1></Reveal>
        <Reveal delay={2}><p style={{ color: "var(--text-dim)", maxWidth: 640, fontSize: "1.05rem", marginBottom: "2.6rem" }}>{t(lead)}</p></Reveal>
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div className="tl-line" style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2 }} />
          {entries.map((d, i) => (
            <Reveal key={i} delay={(Math.min(i, 3) + 1) as 1 | 2 | 3 | 4}>
              <div style={{ position: "relative", marginBottom: "1.8rem" }}>
                <span className="status-dot pulse" style={{ position: "absolute", left: -28, top: 8, background: "var(--green)", boxShadow: "0 0 10px var(--green)" }} />
                <div className="holo ac-green" style={{ padding: "1.2rem 1.4rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <span className="font-mono neon" style={{ fontSize: "0.78rem", letterSpacing: "0.12em", color: "var(--green)" }}>{d.date}</span>
                    <span className="chip ac-green">{t(d.mood)}</span>
                  </div>
                  <p style={{ whiteSpace: "pre-line", color: "var(--text)", margin: "0 0 10px", lineHeight: 1.8 }}>{t(d.text)}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {d.tags.map((tg) => <span key={tg} className="chip ac-green" style={{ opacity: 0.8 }}>#{tg}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
