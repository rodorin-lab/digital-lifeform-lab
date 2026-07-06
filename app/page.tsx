"use client";

import Link from "next/link";
import { useLang, bi, type Bi } from "@/lib/i18n";
import {
  brand, nav, hero, liveSignal, origin, synchro, howWeBuild, projects,
  systemMap, playground, stories, journal, factory, start, connect,
  finalMessage, LINKS, statusAccent, statusFilled, type Accent, type Status,
} from "@/lib/content";
import { storyEntries, journalEntries, blogEntries, diaryEntries } from "@/lib/collections";
import Background from "@/components/Background";
import Boot from "@/components/Boot";
import Nav from "@/components/Nav";
import { Reveal } from "@/components/motion";
import { EntryCard } from "@/components/article";

// ── shared bits ──────────────────────────────────────────────────
function Corners() {
  return (<><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="scan" /></>);
}
const dOf = (i: number) => (Math.min(i, 3) + 1) as 1 | 2 | 3 | 4;
const acClass = (a: Accent) => `ac-${a}`;

// Multiline paragraph (copy uses \n; JP body stays sans, never mono).
function P({ children, style }: { children: string; style?: React.CSSProperties }) {
  return <p style={{ whiteSpace: "pre-line", color: "var(--text-dim)", lineHeight: 1.85, ...style }}>{children}</p>;
}

function Eyebrow({ children }: { children: string }) {
  return <Reveal><div className="kicker" style={{ marginBottom: 12 }}>{children}</div></Reveal>;
}

function Head({ eyebrow, title, lead }: { eyebrow: string; title: Bi; lead?: Bi }) {
  const { t } = useLang();
  return (
    <div style={{ marginBottom: "2.6rem" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Reveal delay={1}>
        <h2 className="section-title chrome" style={{ margin: "0.4rem 0 0.8rem", whiteSpace: "pre-line" }}>{t(title)}</h2>
      </Reveal>
      {lead && <Reveal delay={2}><P style={{ color: "var(--text-dim)", maxWidth: 700, fontSize: "1.05rem" }}>{t(lead)}</P></Reveal>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const { t } = useLang();
  const ac = statusAccent[status];
  const filled = statusFilled(status);
  const label: Record<Status, Bi> = {
    LIVE: { en: "LIVE", ja: "稼働" }, PLAYABLE: { en: "PLAYABLE", ja: "プレイ可" },
    BUILDING: { en: "BUILDING", ja: "開発中" }, EXPERIMENT: { en: "EXPERIMENT", ja: "実験" },
    ACTIVE: { en: "ACTIVE", ja: "活動中" }, EVOLVING: { en: "EVOLVING", ja: "進化中" },
    ARCHIVED: { en: "ARCHIVED", ja: "非稼働" },
  };
  return (
    <span className={`chip ${acClass(ac)}`} style={filled ? { background: "var(--ac)", color: "#04060b", borderColor: "var(--ac)", fontWeight: 700 } : undefined}>
      <span className="status-dot pulse" style={filled ? { background: "#04060b", boxShadow: "none" } : undefined} /> {t(label[status])}
    </span>
  );
}

// Synchro quote block (dedicated component, magenta) — spec §4.3 / §03.
function SynchroQuote({ value }: { value: Bi }) {
  const { t } = useLang();
  return (
    <div className="holo ac-magenta anim-border" style={{ padding: "1.8rem 2rem" }}>
      <Corners />
      <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--magenta)", marginBottom: 12 }}>◇ SYNCHRO</div>
      <p className="font-display" style={{ whiteSpace: "pre-line", fontSize: "clamp(1.1rem,2.6vw,1.5rem)", color: "var(--magenta)", textShadow: "0 0 18px rgba(255,58,224,0.4)", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{t(value)}</p>
    </div>
  );
}

function Telemetry({ rows, cols = 3 }: { rows: { k: string; v: string }[]; cols?: number }) {
  return (
    <div className="holo" style={{ padding: "1.2rem 1.4rem" }}>
      <Corners />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 2 ? 220 : 150}px, 1fr))`, gap: "10px 24px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "6px 0" }}>
            <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-faint)", letterSpacing: "0.12em" }}>{r.k}</span>
            <span className="font-mono neon" style={{ fontSize: "0.74rem", letterSpacing: "0.08em" }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const { t, lang } = useLang();

  return (
    <>
      <Background />
      <div className="fx-overlay" />
      <div className="scan-sweep" />
      <Boot />
      <Nav />

      <main>
        {/* ═══════════ 00 / HERO ═══════════ */}
        <section id="hero" className="ac-cyan" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div className="grid-floor" />
          <div className="wrap" style={{ position: "relative", zIndex: 3, paddingTop: 100, paddingBottom: 60 }}>
            {/* system bar */}
            <div className="font-mono" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.14em", marginBottom: "1.6rem" }}>
              {hero.systemBar.map((s, i) => (
                <span key={i}><span style={{ color: i === 1 ? "var(--magenta)" : "var(--cyan)" }}>//</span> {s}</span>
              ))}
            </div>

            {/* brand wordmark */}
            <h1 className="hero-title">
              <span className="hero-line-1">DIGITAL LIFEFORM</span><br />
              <span className="hero-line-2" data-text="LAB">LAB</span>
              <span className="hero-line-1" style={{ fontSize: "0.42em" }}>ORATORY</span>
            </h1>
            <div className="font-mono" style={{ color: "var(--magenta)", letterSpacing: "0.3em", fontSize: "clamp(0.8rem,2vw,1.1rem)", marginTop: 6, textShadow: "0 0 14px rgba(255,58,224,0.4)" }}>
              {brand.signature}
            </div>

            {/* clarity tagline */}
            <p className="font-display" style={{ whiteSpace: "pre-line", marginTop: "1.8rem", fontSize: "clamp(1.2rem, 3vw, 1.9rem)", color: "var(--text)", fontWeight: 600, lineHeight: 1.35, maxWidth: 720 }}>
              {t(hero.headline)}
            </p>
            <P style={{ marginTop: "1rem", maxWidth: 660 }}>{t(hero.body)}</P>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "2rem" }}>
              {hero.ctas.map((c, i) => (
                <a key={i} className={`btn ${c.solid ? "btn-solid" : ""} ${acClass(c.accent)}`} href={`#${c.to}`} onClick={(e) => { e.preventDefault(); document.getElementById(c.to)?.scrollIntoView({ behavior: "smooth" }); }}>
                  {c.solid ? "▸ " : ""}{t(c.label)}{!c.solid ? " →" : ""}
                </a>
              ))}
            </div>

            {/* telemetry */}
            <div style={{ maxWidth: 620, marginTop: "2.6rem" }}>
              <Telemetry rows={hero.telemetry} />
            </div>

            <div className="font-mono blink" style={{ marginTop: "2.4rem", fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.2em" }}>↓ {t(hero.scrollHint)}</div>
          </div>
        </section>

        {/* ═══════════ 01 / LIVE SIGNAL ═══════════ */}
        <section id="live-signal" className="section ac-cyan" style={{ borderTop: "1px solid rgba(0,255,240,0.12)", background: "rgba(6,10,20,0.5)" }}>
          <div className="wrap">
            <Eyebrow>{liveSignal.eyebrow}</Eyebrow>
            <Reveal delay={1}><h2 className="section-title neon" style={{ margin: "0.2rem 0 0.8rem", whiteSpace: "pre-line" }}>{t(liveSignal.headline)}</h2></Reveal>
            <Reveal delay={2}><P style={{ maxWidth: 640, marginBottom: "2.4rem" }}>{t(liveSignal.lead)}</P></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 16, marginBottom: 20 }}>
              {liveSignal.current.map((c, i) => (
                <Reveal key={i} delay={dOf(i)} className={acClass(statusAccent[c.status])}>
                  <article className="holo" style={{ padding: "1.5rem", height: "100%" }}>
                    <Corners />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <h3 className="font-display neon" style={{ fontSize: "1.02rem", fontWeight: 700, letterSpacing: "0.04em" }}>{c.name}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <P style={{ fontSize: "0.92rem" }}>{t(c.body)}</P>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="font-mono" style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px", fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.1em", paddingTop: 10 }}>
                {liveSignal.bottom.map((b, i) => (
                  <span key={i}>{t(b.k)} <span className="neon" style={{ marginLeft: 6 }}>{typeof b.v === "string" ? b.v : t(b.v)}</span></span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 02 / ORIGIN ═══════════ */}
        <section id="origin" className="section ac-cyan">
          <div className="wrap">
            <Head eyebrow={origin.eyebrow} title={origin.heading} lead={origin.lead} />
            <div style={{ position: "relative", paddingLeft: 28, marginBottom: "3rem" }}>
              <div className="tl-line" style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2 }} />
              {origin.timeline.map((ph, i) => (
                <Reveal key={i} delay={dOf(i)}>
                  <div style={{ position: "relative", marginBottom: "2.2rem" }}>
                    <span className="status-dot pulse" style={{ position: "absolute", left: -28, top: 8 }} />
                    <div className="font-mono neon" style={{ fontSize: "0.76rem", letterSpacing: "0.16em" }}>{ph.phase} — <span style={{ color: "var(--text)" }}>{t(ph.key)}</span></div>
                    <P style={{ marginTop: 8, maxWidth: 700, fontSize: "0.96rem" }}>{t(ph.body)}</P>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="holo ac-cyan" style={{ padding: "1.8rem 2rem", textAlign: "center" }}>
                <Corners />
                <p className="font-display neon" style={{ whiteSpace: "pre-line", fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 700, margin: "0 0 14px" }}>{t(origin.manifesto)}</p>
                <div className="font-mono" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 20px", fontSize: "0.72rem", letterSpacing: "0.18em", color: "var(--text-dim)" }}>
                  {origin.manifestoSub.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 03 / SYNCHRO ═══════════ */}
        <section id="synchro" className="section ac-magenta" style={{ background: "linear-gradient(180deg, transparent, rgba(255,58,224,0.05), transparent)" }}>
          <div className="wrap">
            <Head eyebrow={synchro.eyebrow} title={synchro.heading} lead={synchro.lead} />
            <Reveal><div style={{ marginBottom: 20 }}><Telemetry rows={synchro.identity} cols={2} /></div></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))", gap: 14, marginBottom: 22 }}>
              {synchro.features.map((f, i) => (
                <Reveal key={i} delay={dOf(i)} className="ac-magenta">
                  <div className="holo" style={{ padding: "1.5rem", height: "100%" }}>
                    <Corners />
                    <div className="font-display neon" style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "0.1em", marginBottom: 10 }}>{t(f.key)}</div>
                    <P style={{ fontSize: "0.92rem" }}>{t(f.body)}</P>
                  </div>
                </Reveal>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: 16, alignItems: "stretch" }} className="researcher-grid">
              <Reveal>
                <div className="holo ac-magenta" style={{ padding: "1.4rem 1.6rem", height: "100%" }}>
                  <Corners />
                  <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--magenta)", marginBottom: 12 }}>TODAY, SYNCHRO IS…</div>
                  {synchro.today.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: i < synchro.today.length - 1 ? "1px solid rgba(255,58,224,0.14)" : "none" }}>
                      <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-faint)", letterSpacing: "0.1em" }}>{r.k}</span>
                      <span className="font-mono" style={{ fontSize: "0.74rem", color: "var(--magenta)" }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={2}><SynchroQuote value={synchro.quote} /></Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════ 04 / HOW WE BUILD ═══════════ */}
        <section id="how-we-build" className="section ac-cyan">
          <div className="wrap">
            <Head eyebrow={howWeBuild.eyebrow} title={howWeBuild.heading} lead={howWeBuild.lead} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 14, marginBottom: 24 }}>
              {howWeBuild.steps.map((s, i) => (
                <Reveal key={i} delay={dOf(i)} className={acClass(s.accent)}>
                  <div className="holo" style={{ padding: "1.4rem", height: "100%" }}>
                    <Corners />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span className="font-mono neon" style={{ fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.who}</span>
                      <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <P style={{ whiteSpace: "pre-line", color: "var(--text)", fontSize: "0.98rem" }}>{t(s.body)}</P>
                  </div>
                </Reveal>
              ))}
            </div>
            {/* real conversation → build proof */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: 16, alignItems: "start" }} className="researcher-grid">
              <Reveal>
                <div className="holo ac-cyan" style={{ padding: "1.6rem" }}>
                  <Corners />
                  <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "var(--text-faint)", marginBottom: 14 }}>REAL CONVERSATION</div>
                  <div style={{ marginBottom: 14 }}>
                    <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--cyan)", marginBottom: 4 }}>RODORIN</div>
                    <p style={{ color: "var(--text)", margin: 0 }}>{t(howWeBuild.convo.rodorin)}</p>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--magenta)", marginBottom: 4 }}>SYNCHRO</div>
                    <p style={{ color: "var(--text)", margin: 0 }}>{t(howWeBuild.convo.synchro)}</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={2}>
                <div className="holo" style={{ padding: "1.6rem" }}>
                  <Corners />
                  {howWeBuild.flow.map((f, i) => (
                    <div key={i}>
                      <div className="font-mono" style={{ fontSize: "0.86rem", letterSpacing: "0.08em", color: i === howWeBuild.flow.length - 1 ? "var(--green)" : "var(--cyan)", padding: "4px 0" }}>{t(f)}</div>
                      {i < howWeBuild.flow.length - 1 && <div style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>↓</div>}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════ 05A / PROJECTS ═══════════ */}
        <section id="projects" className="section ac-cyan">
          <div className="wrap">
            <Head eyebrow={projects.eyebrow} title={projects.heading} lead={projects.lead} />
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
                {projects.categories.map((c, i) => <span key={i} className="chip ac-cyan">{t(c)}</span>)}
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
              {projects.featured.map((p, i) => (
                <Reveal key={p.name} delay={dOf(i)} className={acClass(statusAccent[p.status])}>
                  <a className="holo" href={p.href || LINKS.github} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "1.4rem", height: "100%", textDecoration: "none" }}>
                    <Corners />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10, marginBottom: 10 }}>
                      <h3 className="font-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.03em" }}>{p.name}</h3>
                      <StatusBadge status={p.status} />
                    </div>
                    <P style={{ fontSize: "0.9rem" }}>{t(p.desc)}</P>
                  </a>
                </Reveal>
              ))}
            </div>
            {/* status legend — status not by color alone (a11y): includes text */}
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 22 }}>
                {projects.statusLegend.map((l) => (
                  <span key={l.s} className={`font-mono ${acClass(statusAccent[l.s])}`} style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                    <span className="status-dot" style={{ display: "inline-block", marginRight: 6, verticalAlign: "middle" }} />{l.s} · {t(l.d)}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal><div style={{ marginTop: 22 }}><a className="btn ac-cyan" href={LINKS.github} target="_blank" rel="noopener noreferrer">▸ {t(projects.more)}</a></div></Reveal>
          </div>
        </section>

        {/* ═══════════ 05B / SYSTEM MAP ═══════════ */}
        <section className="section ac-cyan" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal delay={1}><h2 className="section-title chrome" style={{ margin: "0 0 0.8rem" }}>{t(systemMap.heading)}</h2></Reveal>
            <Reveal delay={2}><P style={{ maxWidth: 700, marginBottom: "2.2rem" }}>{t(systemMap.lead)}</P></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 14 }}>
              {systemMap.nodes.map((n, i) => (
                <Reveal key={i} delay={dOf(i)}>
                  <div className="holo" style={{ padding: "1.3rem 1.4rem", height: "100%" }}>
                    <Corners />
                    <div className="font-display neon" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>{n.title}</div>
                    <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.06em" }}>{t(n.sub)}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="font-mono" style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", justifyContent: "center", marginTop: 22, fontSize: "0.72rem", letterSpacing: "0.18em", color: "var(--cyan)" }}>
                {systemMap.footer.map((s) => <span key={s}>{s}</span>)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 05C / PLAYGROUND ═══════════ */}
        <section className="section ac-green" style={{ background: "linear-gradient(180deg, transparent, rgba(0,255,90,0.04), transparent)" }}>
          <div className="wrap">
            <Reveal><div className="kicker" style={{ marginBottom: 12 }}>05 / PLAYGROUND</div></Reveal>
            <Reveal delay={1}><h2 className="section-title neon" style={{ margin: "0.2rem 0 0.8rem" }}>{t(playground.heading)}</h2></Reveal>
            <Reveal delay={2}><P style={{ maxWidth: 640, marginBottom: "2rem" }}>{t(playground.lead)}</P></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 14 }}>
              {playground.items.map((it, i) => {
                const internal = it.href.startsWith("/");
                const inner = (
                  <>
                    <Corners />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <h3 className="font-display neon" style={{ fontSize: "1rem", fontWeight: 700 }}>{it.title}</h3>
                      <span className="chip ac-green">⏱ {it.time}</span>
                    </div>
                    <P style={{ fontSize: "0.9rem", marginBottom: 14 }}>{t(it.desc)}</P>
                    <span className="font-mono" style={{ fontSize: "0.74rem", color: "var(--green)", letterSpacing: "0.08em" }}>▸ {internal ? t({ en: "Play now", ja: "今すぐ遊ぶ" }) : t(playground.cta)}</span>
                  </>
                );
                const cls = "holo";
                const st = { display: "block", padding: "1.4rem", height: "100%", textDecoration: "none" } as const;
                return (
                  <Reveal key={i} delay={dOf(i)} className="ac-green">
                    {internal
                      ? <Link className={cls} href={it.href} style={st}>{inner}</Link>
                      : <a className={cls} href={it.href} target="_blank" rel="noopener noreferrer" style={st}>{inner}</a>}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ 06A / STORIES ═══════════ */}
        <section id="stories" className="section ac-magenta">
          <div className="wrap">
            <Head eyebrow={stories.eyebrow} title={stories.heading} lead={stories.lead} />
            <Reveal><div className="font-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "var(--magenta)", marginBottom: 16 }}>◇ {t(stories.behindLabel)}</div></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 16, marginBottom: "2rem" }}>
              {storyEntries.map((e, i) => <EntryCard key={e.slug} entry={e} delay={dOf(i)} />)}
            </div>
            <Reveal><div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "2rem" }}><Link className="btn ac-magenta" href="/stories">▸ {t({ en: "All stories", ja: "物語をすべて見る" })}</Link></div></Reveal>
            <Reveal><P style={{ maxWidth: 640, color: "var(--text-dim)" }}>{t(stories.convoIntro)}</P></Reveal>
          </div>
        </section>

        {/* ═══════════ 06B / JOURNAL ═══════════ */}
        <section className="section ac-cyan" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal><div className="kicker" style={{ marginBottom: 12 }}>06 / JOURNAL</div></Reveal>
            <Reveal delay={1}><h2 className="section-title chrome" style={{ margin: "0.2rem 0 0.8rem" }}>{t(journal.heading)}</h2></Reveal>
            <Reveal delay={2}><P style={{ maxWidth: 700, marginBottom: "2.2rem" }}>{t(journal.lead)}</P></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 16 }}>
              {journalEntries.map((e, i) => <EntryCard key={e.slug} entry={e} delay={dOf(i)} />)}
            </div>
            <Reveal>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <Link className="btn ac-cyan" href="/journal">▸ {t({ en: "All journal", ja: "ログをすべて見る" })}</Link>
                <a className="btn ac-cyan" href={LINKS.zenn} target="_blank" rel="noopener noreferrer">{t(journal.readOnZenn)} →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════ DEV DIARY + BLOG ═══════════ */}
        <section className="section ac-green" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 24 }}>
              {/* diary stream */}
              <div>
                <Reveal><div className="kicker" style={{ marginBottom: 12 }}>◇ DEV DIARY</div></Reveal>
                <Reveal delay={1}><h2 className="section-title neon" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", margin: "0 0 1rem" }}>{t(bi("The daily log", "毎日の記録"))}</h2></Reveal>
                <div style={{ position: "relative", paddingLeft: 24 }}>
                  <div className="tl-line" style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 2 }} />
                  {diaryEntries.slice(0, 3).map((d, i) => (
                    <Reveal key={i} delay={dOf(i)} className="ac-green">
                      <div style={{ position: "relative", marginBottom: "1.2rem" }}>
                        <span className="status-dot pulse" style={{ position: "absolute", left: -24, top: 7, background: "var(--green)", boxShadow: "0 0 10px var(--green)" }} />
                        <div className="font-mono neon" style={{ fontSize: "0.74rem", letterSpacing: "0.1em", color: "var(--green)" }}>{d.date} · {t(d.mood)}</div>
                        <p style={{ whiteSpace: "pre-line", color: "var(--text-dim)", fontSize: "0.9rem", lineHeight: 1.7, margin: "4px 0 0" }}>{t(d.text)}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <Reveal><Link className="btn ac-green" href="/diary" style={{ marginTop: 8 }}>▸ {t(bi("Full diary", "日記をすべて見る"))}</Link></Reveal>
              </div>
              {/* blog teaser */}
              <div>
                <Reveal><div className="kicker ac-magenta" style={{ marginBottom: 12 }}>◇ BLOG</div></Reveal>
                <Reveal delay={1}><h2 className="section-title neon ac-magenta" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", margin: "0 0 1rem" }}>{t(bi("Hobby & thoughts", "趣味と雑記"))}</h2></Reveal>
                <div style={{ display: "grid", gap: 14 }}>
                  {blogEntries.map((e, i) => <EntryCard key={e.slug} entry={e} delay={dOf(i)} />)}
                </div>
                <Reveal><Link className="btn ac-magenta" href="/blog" style={{ marginTop: 16 }}>▸ {t(bi("All posts", "記事をすべて見る"))}</Link></Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 07 / FACTORY ═══════════ */}
        <section id="factory" className="section ac-orange" style={{ background: "linear-gradient(180deg, transparent, rgba(255,138,42,0.05), transparent)" }}>
          <div className="wrap">
            <Head eyebrow={factory.eyebrow} title={factory.heading} lead={factory.lead} />
            <Reveal>
              <div className="holo ac-orange anim-border" style={{ padding: "2rem" }}>
                <Corners />
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <span className="float" style={{ fontSize: 44 }}>🐉</span>
                  <div>
                    <span className="chip ac-orange"><span className="status-dot pulse" /> {t(factory.availableLabel)}</span>
                    <div className="font-display neon" style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: 8, letterSpacing: "0.04em" }}>{factory.product.name}</div>
                  </div>
                </div>
                <P style={{ whiteSpace: "pre-line", color: "var(--text)", fontSize: "1.02rem", marginBottom: 18 }}>{t(factory.product.sub)}</P>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a className="btn btn-solid ac-orange" href={`${factory.product.href}/packs`} target="_blank" rel="noopener noreferrer">▸ {t({ en: "Buy packs today", ja: "今日パックを買う" })}</a>
                  <a className="btn ac-orange" href={factory.product.href} target="_blank" rel="noopener noreferrer">{t(factory.product.cta)} →</a>
                </div>
              </div>
            </Reveal>
            {/* Synchro note (magenta) */}
            <Reveal delay={1}><div style={{ marginTop: 16 }}><SynchroQuote value={factory.synchroNote} /></div></Reveal>
            {/* future experiments — shown small, no price/CTA */}
            <Reveal delay={2}>
              <div style={{ marginTop: 22 }}>
                <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "var(--text-faint)", marginBottom: 10 }}>{t(factory.futureLabel)}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {factory.future.map((f, i) => <span key={i} className="chip ac-orange" style={{ opacity: 0.7 }}>{t(f)} · {t(start.comingSoon)}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════ 08A / START ═══════════ */}
        <section id="start" className="section ac-green" style={{ background: "linear-gradient(180deg, transparent, rgba(0,255,90,0.04))" }}>
          <div className="wrap">
            <Eyebrow>{start.eyebrow}</Eyebrow>
            <Reveal delay={1}><h2 className="section-title neon" style={{ margin: "0.2rem 0 0.8rem", whiteSpace: "pre-line" }}>{t(start.heading)}</h2></Reveal>
            <Reveal delay={2}><P style={{ maxWidth: 680, marginBottom: "2.4rem" }}>{t(start.body)}</P></Reveal>

            {/* free guide */}
            <Reveal>
              <div className="holo ac-green anim-border" style={{ padding: "2rem", marginBottom: 20 }}>
                <Corners />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="chip ac-green"><span className="status-dot pulse" /> {t(start.choices[0].tier)} · ¥0</span>
                  <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.1em" }}>{t(start.guide.byline)}</span>
                </div>
                <h3 className="font-display neon" style={{ fontSize: "1.4rem", fontWeight: 800, margin: "6px 0 14px" }}>{t(start.guide.title)}</h3>
                <P style={{ whiteSpace: "pre-line", color: "var(--text)", marginBottom: 18, maxWidth: 720 }}>{t(start.guide.intro)}</P>
                <ol style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "8px 18px" }}>
                  {start.guide.chapters.map((c, i) => (
                    <li key={i} className="font-mono" style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                      <span className="neon" style={{ marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>{t(c)}
                    </li>
                  ))}
                </ol>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a className="btn btn-solid ac-green" href={LINKS.zenn} target="_blank" rel="noopener noreferrer">▸ {t(start.freeCtas.read)}</a>
                </div>
              </div>
            </Reveal>

            {/* three choices (free available, paid future) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 14 }}>
              {start.choices.map((c, i) => (
                <Reveal key={i} delay={dOf(i)} className={acClass(c.accent)}>
                  <div className="holo" style={{ padding: "1.4rem", height: "100%", opacity: c.available ? 1 : 0.78 }}>
                    <Corners />
                    <div className="font-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.14em", color: "rgba(var(--ac-rgb),0.9)", marginBottom: 8 }}>{t(c.tier)}</div>
                    <h3 className="font-display" style={{ fontSize: "1.02rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{t(c.name)}</h3>
                    <div className="font-display neon" style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 10 }}>{c.price}</div>
                    <P style={{ fontSize: "0.88rem", marginBottom: 12 }}>{t(c.desc)}</P>
                    {!c.available && <span className="chip" style={{ opacity: 0.8 }}>{t(start.comingSoon)}</span>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ 08B / CONNECT ═══════════ */}
        <section id="connect" className="section ac-cyan">
          <div className="wrap">
            <Reveal><div className="kicker" style={{ marginBottom: 12 }}>08 / CONNECT</div></Reveal>
            <Reveal delay={1}><h2 className="section-title chrome" style={{ margin: "0.2rem 0 0.8rem" }}>{t(connect.heading)}</h2></Reveal>
            <Reveal delay={2}><P style={{ maxWidth: 660, marginBottom: "2.2rem" }}>{t(connect.lead)}</P></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 14 }}>
              {connect.links.map((c, i) => (
                <Reveal key={i} delay={dOf(i)} className={acClass(c.accent)}>
                  <a className="holo" href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, padding: "1.3rem", textDecoration: "none" }}>
                    <Corners />
                    <span className="font-display neon" style={{ fontSize: 22, fontWeight: 800, width: 34, textAlign: "center" }}>{c.icon}</span>
                    <span>
                      <span style={{ display: "block", color: "var(--text)", fontWeight: 600 }}>{c.label}</span>
                      <span className="font-mono" style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>{c.handle}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL MESSAGE ═══════════ */}
        <section className="section ac-magenta" style={{ textAlign: "center", borderTop: "1px solid rgba(0,255,240,0.1)" }}>
          <div className="wrap" style={{ maxWidth: 800 }}>
            <Reveal><P style={{ whiteSpace: "pre-line", color: "var(--text)", fontSize: "1.15rem", lineHeight: 1.9, marginBottom: "2rem" }}>{t(finalMessage.body)}</P></Reveal>
            <Reveal delay={1}><SynchroQuote value={finalMessage.quote} /></Reveal>
            <Reveal delay={2}>
              <div style={{ marginTop: "2.4rem", maxWidth: 520, marginInline: "auto" }}>
                <Telemetry rows={finalMessage.telemetry} />
              </div>
            </Reveal>
            <Reveal>
              <div className="font-mono blink" style={{ marginTop: "2rem", fontSize: "0.74rem", letterSpacing: "0.2em", color: "var(--text-faint)" }}>
                {finalMessage.end.map((e, i) => <div key={i} style={{ color: i === 1 ? "var(--cyan)" : undefined }}>{e}</div>)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="ac-cyan" style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(0,255,240,0.14)", padding: "2.6rem 0", textAlign: "center" }}>
          <div className="wrap">
            <div className="font-display" style={{ fontWeight: 800, letterSpacing: "0.12em", color: "var(--text)" }}>
              {brand.name} <span className="neon" style={{ color: "var(--cyan)" }}>⬡</span>
            </div>
            <div className="font-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.24em", color: "var(--magenta)", marginTop: 6 }}>{brand.signature}</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth" }); }} className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)", textDecoration: "none", letterSpacing: "0.08em" }}>{t(n.label)}</a>
              ))}
            </div>
            {/* content routes */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
              {[
                { href: "/stories", label: bi("Stories", "物語") },
                { href: "/journal", label: bi("Journal", "ログ") },
                { href: "/diary", label: bi("Diary", "日記") },
                { href: "/blog", label: bi("Blog", "ブログ") },
                { href: "/play/cyber-serpent", label: bi("Play", "遊ぶ") },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="font-mono" style={{ fontSize: "0.72rem", color: "var(--cyan)", textDecoration: "none", letterSpacing: "0.08em" }}>{t(l.label)}</Link>
              ))}
            </div>
            <div className="font-mono" style={{ fontSize: "0.66rem", color: "var(--text-faint)", marginTop: 16, letterSpacing: "0.1em" }}>© {new Date().getFullYear()} {brand.name} · Yokohama, JP{lang === "ja" ? "（横浜）" : ""}</div>
          </div>
        </footer>
      </main>
    </>
  );
}
