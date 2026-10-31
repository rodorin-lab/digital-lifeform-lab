"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { explorerLinks } from "@/lib/explorer-links";
import styles from "./terminal.module.css";

type Channel = "all" | "projects" | "signals" | "community";
const filters: { id: Channel; label: string; ja: string }[] = [
  { id: "all", label: "All channels", ja: "すべて" },
  { id: "projects", label: "Projects", ja: "プロジェクト" },
  { id: "signals", label: "Watch & listen", ja: "動画・配信" },
  { id: "community", label: "Connect", ja: "つながる" },
];

export default function ExplorerTerminal() {
  const [channel, setChannel] = useState<Channel>("all");
  const [ja, setJa] = useState(false);
  const [copyState, setCopyState] = useState("");
  const links = explorerLinks.filter(
    (link) => channel === "all" || link.category === channel,
  );
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        "https://digital-lifeform-lab.vercel.app/links",
      );
      setCopyState(ja ? "リンクをコピーしました" : "Link copied");
    } catch {
      setCopyState(
        ja
          ? "ブラウザーのアドレス欄からコピーしてください"
          : "Copy the address from your browser",
      );
    }
  }

  return (
    <div className={styles.shell} lang={ja ? "ja" : "en"}>
      <a href="#channels" className={styles.skip}>
        {ja ? "リンクへ移動" : "Skip to links"}
      </a>
      <header className={styles.topbar}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Digital Lifeform Lab home"
        >
          <span className={styles.mark}>◈</span>
          <span>
            DIGITAL LIFEFORM LAB<small>HOLOVERSE EXPLORATION DIVISION</small>
          </span>
        </Link>
        <div className={styles.topControls}>
          <span className={styles.coordinate}>JAPAN / EARTH</span>
          <button
            type="button"
            onClick={() => setJa(!ja)}
            aria-label={ja ? "Switch to English" : "日本語に切り替え"}
          >
            {ja ? "EN / 日本語 ●" : "EN ● / 日本語"}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="explorer-title">
          <Image
            className={styles.heroImage}
            src="/explorer/hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1360px"
            quality={75}
          />
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroLabel}>
            <span /> EXPLORER TERMINAL{" "}
            <span className={styles.serial}>HV—001</span>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              BEYOND THE SCREEN. INTO THE SHARED WORLD.
            </p>
            <h1 id="explorer-title">
              HOLOVERSE<span>{"// DIGITAL EXPLORER"}</span>
            </h1>
            <p className={styles.heroLine}>
              {ja
                ? "AIと人間が、ともに旅し、創る仮想世界へ。"
                : "Virtual worlds. Human × AI. Create together."}
            </p>
            <a className={styles.heroButton} href="#channels">
              {ja ? "通信チャンネルを開く" : "Open communication channels"}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className={styles.heroFoot}>
            <span>RESONITE / VRCHAT / WEBXR</span>
            <span>EXPLORATION IS BETTER TOGETHER</span>
          </div>
        </section>

        <div className={styles.console}>
          <aside
            className={styles.identity}
            aria-label={ja ? "探検家プロフィール" : "Explorer profile"}
          >
            <div className={styles.identityHeader}>
              <span>01 / EXPLORER ID</span>
              <span aria-hidden="true">⌁</span>
            </div>
            <Image
              className={styles.portrait}
              src="/explorer/icon.png"
              width={112}
              height={112}
              sizes="112px"
              alt="Silver-haired HoloVerse explorer with an AI robotic cat"
            />
            <h2>
              rodorin<span>JAPAN · DIGITAL EXPLORER</span>
            </h2>
            <p className={styles.roles}>
              <span>VR explorer</span>
              <span>World builder</span>
              <span>AI agent creator</span>
            </p>
            <p className={styles.about}>
              {ja
                ? "Resonite、VRChat、WebXR、AIエージェント。仮想世界を探検しながら、新しい体験をつくっています。"
                : "Exploring Resonite, VRChat, WebXR, and AI agents. Building new experiences at the edges of virtual worlds."}
            </p>
            <div className={styles.tags}>
              <span>Resonite</span>
              <span>VRChat</span>
              <span>WebXR</span>
              <span>AI agents</span>
            </div>
            <div className={styles.note}>
              <span>MISSION NOTE</span>
              <p>
                {ja
                  ? "面白い世界や、つくりたいアイデアがあれば、ぜひ話そう。"
                  : "Found a strange world? Have something you want to build? Let's exchange ideas."}
              </p>
            </div>
            <p className={styles.language}>JP native / EN learning</p>
            <p className={styles.afk}>
              {ja
                ? "家庭の都合で急に離席することがあります。ご理解ありがとう。"
                : "May go AFK for family responsibilities. Thanks for understanding."}
            </p>
          </aside>

          <section
            id="channels"
            className={styles.channels}
            aria-labelledby="channel-title"
          >
            <div className={styles.channelHeading}>
              <div>
                <p className={styles.eyebrow}>02 / COMMUNICATION ARRAY</p>
                <h2 id="channel-title">
                  {ja ? "次の世界へ、接続。" : "Choose your next connection."}
                </h2>
              </div>
              <span className={styles.count}>
                {String(explorerLinks.length).padStart(2, "0")} CHANNELS
              </span>
            </div>
            <p className={styles.channelIntro}>
              {ja
                ? "研究室、プロジェクト、配信、そして新しい仲間へ。"
                : "A home base for experiments, stories, and the people we meet along the way."}
            </p>
            <div
              className={styles.filters}
              role="group"
              aria-label={ja ? "チャンネルの種類" : "Filter channels"}
            >
              {filters.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  aria-pressed={channel === f.id}
                  onClick={() => setChannel(f.id)}
                >
                  {ja ? f.ja : f.label}
                </button>
              ))}
            </div>
            <div className={styles.linkList}>
              {links.map((link) => (
                <a
                  key={link.id}
                  className={`${styles.link} ${link.id === "lab" ? styles.featured : ""}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.glyph} aria-hidden="true">
                    {link.glyph}
                  </span>
                  <span className={styles.linkBody}>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <strong>{link.title}</strong>
                    <span className={styles.linkDescription}>
                      {ja ? link.ja : link.description}
                    </span>
                    <span className={styles.linkDomain}>
                      {new URL(link.url).hostname}
                    </span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                  <span className={styles.srOnly}>
                    {ja ? "（新しいタブで開く）" : " (opens in a new tab)"}
                  </span>
                </a>
              ))}
            </div>
            <p className={styles.results} aria-live="polite">
              {ja
                ? `${links.length}件のチャンネルを表示`
                : `${links.length} channels displayed`}
            </p>
            <div className={styles.share}>
              <div>
                <span className={styles.eyebrow}>KEEP THE CONNECTION</span>
                <p>
                  {ja
                    ? "この座標を、次の仲間へ。"
                    : "Pass these coordinates to your next crewmate."}
                </p>
              </div>
              <button type="button" onClick={copyLink}>
                {ja ? "リンクをコピー" : "Copy hub link"}
                <span aria-hidden="true"> ⧉</span>
              </button>
            </div>
            <p className={styles.copyStatus} role="status">
              {copyState}
            </p>
          </section>
        </div>
        <footer className={styles.footer}>
          <Link href="/">← DIGITAL LIFEFORM LAB</Link>
          <span>{"HOLOVERSE // BUILT TO EXPLORE TOGETHER"}</span>
          <span>人間とAIが、ともに創る。</span>
        </footer>
      </main>
    </div>
  );
}
