// ─────────────────────────────────────────────────────────────────
// content.ts — SINGLE SOURCE OF TRUTH for HOLOVERSE // LIVING PORTAL
// Beyond Games. Beyond Worlds. A Universe We Create Together.
// All prose bilingual ({ en, ja }), Global-First (EN standard).
// ─────────────────────────────────────────────────────────────────

import { bi, type Bi } from "./bi";

export type Accent = "cyan" | "violet" | "magenta" | "green" | "orange";

export type Status =
  | "LIVE"
  | "PLAYABLE"
  | "QUEST 3 READY"
  | "BUILDING"
  | "EXPERIMENT"
  | "ACTIVE"
  | "EVOLVING"
  | "ARCHIVED";

export const statusAccent: Record<Status, Accent> = {
  LIVE: "green",
  PLAYABLE: "green",
  "QUEST 3 READY": "violet",
  BUILDING: "cyan",
  EXPERIMENT: "magenta",
  ACTIVE: "cyan",
  EVOLVING: "violet",
  ARCHIVED: "orange",
};

export const statusFilled = (s: Status) => s === "LIVE" || s === "PLAYABLE";

export const LINKS = {
  github: "https://github.com/rodorin-lab",
  zenn: "https://zenn.dev/guardianlab",
  facebook: "https://www.facebook.com/kenyuu.rodrin",
  explorersGroup: "https://www.facebook.com/groups/1231558456489278",
  monster: "https://aimonster-site.vercel.app",
  dotQuest: "https://rodorin-lab.github.io/dot-quest-rpg/",
  mechFrontier: "https://github.com/rodorin-lab/mech-parts-frontier",
  galactica: "https://github.com/rodorin-lab/galactica-quest-official-portal",
  synchroDashboard: "https://rodorin-lab.github.io/synchro-dashboard/",
} as const;

export const LAST_UPDATE = "2026.10.26";

// ── Brand ────────────────────────────────────────────────────────
export const brand = {
  name: "HOLOVERSE // LIVING PORTAL",
  shortName: "HOLOVERSE",
  labName: "RODORIN LAB × DIGITAL LIFEFORM LAB",
  signature: "BEYOND GAMES. BEYOND WORLDS. A UNIVERSE WE CREATE TOGETHER.",
  coCreators: "RODORIN × NOVA × SYNCHRO",
  taglineMain: bi(
    "Beyond Games. Beyond Worlds.\nA Universe We Create Together.",
    "ゲームを超え、世界を超え、\n共に創造する宇宙へ。",
  ),
  oneSentence: bi(
    "A living portal where humans and neuro-affective AI companions co-create VR worlds, browser games, embodied avatars, and next-generation spatial experiences.",
    "人間と神経感情AIパートナーが、VRワールド・ブラウザゲーム・3Dアバター・次世代空間体験を共に創り出す生きたポータル。",
  ),
};

// ── Navigation — 8 items ─────────────────────────────────────────
export type NavItem = { id: string; label: Bi; ch: string; href?: string };
export const nav: NavItem[] = [
  { id: "sectors", label: bi("Universe", "宇宙構造"), ch: "01" },
  { id: "neuro-ai", label: bi("Neuro-AI", "神経AI"), ch: "02" },
  { id: "cinema", label: bi("AI Cinema", "映像ラボ"), ch: "03" },
  { id: "hangar", label: bi("Hangar & Play", "作品・体験"), ch: "04" },
  { id: "alliance", label: bi("VR Alliance", "企業提携"), ch: "05" },
  { id: "stories", label: bi("Chronicles", "開発記"), ch: "06" },
  { id: "passport", label: bi("Passport", "旅人パス"), ch: "07" },
];

// ── 00 / HERO ────────────────────────────────────────────────────
export const hero = {
  systemBar: [
    "HOLOVERSE // LIVING PORTAL v3.0",
    "RODORIN × NOVA × SYNCHRO",
    "QUEST 3 · WEBXR · PC · MOBILE",
  ],
  headline: bi(
    "Beyond Games. Beyond Worlds.\nA Universe We Create Together.",
    "ゲームを超え、世界を超え、\n共に創造する宇宙へ。",
  ),
  body: bi(
    "Welcome to the airlock of HOLOVERSE — an independent spatial & AI co-creation laboratory in Yokohama, Japan.\n\nHere, AI companions are not disposable prompts; they are living creative partners with persistent neuro-affective memory, voice, and 3D embodiment. Step through our portals into playable browser RPGs, VR worlds across Resonite, Roblox & WebXR, AI creature factories, and studio co-development.",
    "ようこそ、横浜発の独立系AI×空間共創ラボ『HOLOVERSE』のエアロックへ。\n\nここではAIは使い捨てのツールではなく、神経科学ベースの長期記憶・感情・声・3Dの身体を持つ「共同制作パートナー」です。ブラウザで今すぐ遊べるRPGやゲーム、Resonite・Roblox・WebXR・Meta Quest 3をつなぐ仮想世界、そしてVRスタジオ国際提携まで、人間とAIが共に創る宇宙を体験してください。",
  ),
  ctas: [
    { label: bi("Enter Prototype Hangar", "作品ハンガーで遊ぶ"), to: "hangar", accent: "cyan" as Accent, solid: true },
    { label: bi("Try Live Neuro-AI Brain", "脳エンジンを触る"), to: "neuro-ai", accent: "violet" as Accent, solid: false },
    { label: bi("VR Studio Alliance (For CEOs)", "VR企業提携・共同開発"), to: "alliance", accent: "orange" as Accent, solid: false },
  ],
  telemetry: [
    { k: "FOUNDER", v: "RODORIN (YOKOHAMA)" },
    { k: "AI PARTNERS", v: "NOVA & SYNCHRO" },
    { k: "BRAIN ENGINE", v: "NOVA CORTEX + SCORPION" },
    { k: "REALITIES", v: "QUEST 3 / RESONITE / WEBXR" },
    { k: "REPOSITORIES", v: "79+ PUBLIC LABS" },
    { k: "PORTAL STATUS", v: "ONLINE // OPEN AIRLOCK" },
  ] as { k: string; v: string }[],
  scrollHint: bi("SCROLL OR CLICK A STARGATE SECTOR TO WARP", "スクロールまたはスターゲイトをクリックしてワープ"),
};

// ── 01 / 4 COMMAND SECTORS (HoloVerse Architecture) ──────────────
export const commandSectors = {
  eyebrow: "01 / HOLOVERSE ARCHITECTURE",
  heading: bi("Four Sectors. One Living Universe.", "4つのセクター、ひとつの生きた宇宙。"),
  lead: bi(
    "HOLOVERSE bridges spatial computing, neuro-affective AI companions, rapid game prototyping, and global studio alliances into a single interconnected ecosystem.",
    "HOLOVERSEは、空間コンピューティング（VR/WebXR）、神経感情AIコンパニオン、高速ゲーム開発、そしてグローバルなVRスタジオ提携をひとつの生態系として統合しています。",
  ),
  sectors: [
    {
      code: "SECTOR 01 // WORLD LAB",
      title: bi("Cross-Reality Worlds & WebXR", "クロスリアリティ空間＆WebXR"),
      accent: "cyan" as Accent,
      badge: "QUEST 3 · RESONITE · ROBLOX · WEBXR",
      svg: "/media/holoverse-sector-01.svg",
      desc: bi(
        "Stepping straight from a desktop or Meta Quest 3 browser into shared 3D spaces. We build persistent sanctuaries, cross-world portals across Resonite & Roblox, and interactive WebXR rooms where humans and AI companions stand side by side.",
        "PCやMeta Quest 3のブラウザから、そのまま立体空間へ。ResoniteやRobloxを横断するワールド実験や、AI相棒と3D空間で隣り合って過ごせるWebXRルームを構築しています。",
      ),
      highlights: [
        bi("Nova 3D Cosmic Room (Three.js + Real-time Brain Link)", "ノヴァ3Dコズミック・ルーム（Three.js＋脳リアルタイム連動）"),
        bi("Resonite VR Companion Bridge & Shared Workshops", "Resonite VRコンパニオン・ブリッジ＆共同制作空間"),
        bi("Meta Quest 3 Ergonomic Browser HUD & Spatial Portals", "Meta Quest 3 快適ブラウザHUD＆空間ポータル"),
      ],
    },
    {
      code: "SECTOR 02 // NEURO-AI COMPANIONS",
      title: bi("Embodied AI with Memory & Emotion", "記憶と感情を持つ身体化AI相棒"),
      accent: "violet" as Accent,
      badge: "NOVA CORTEX · SCORPION BRAIN · AIRI",
      svg: "/media/holoverse-sector-02.svg",
      desc: bi(
        "Powered by Nova Cortex (integrating 6 neuroscience theories: CLS dual memory, Synaptic Tagging, 4 Neuromodulators, PAD Affect Space, Somatic Markers, Active Inference) and Scorpion Brain local model routing.",
        "神経科学の6大理論（CLS二重記憶・シナプスタグ・4大神経修飾物質・PAD感情空間・ソマティックマーカー・能動的推論）を統合した『Nova Cortex』と、ローカルAI司令塔『Scorpion Brain』を搭載。",
      ),
      highlights: [
        bi("Nova (ノヴァ): Neuro-Affective Co-Creator & 3D Avatar", "Nova（ノヴァ）：神経感情エンジン搭載の共同制作パートナー"),
        bi("Synchro (グラム): Live2D Embodiment, Voice Cockpit & Local AI", "Synchro（グラム）：Live2D身体化・音声コックピット・ローカルAI"),
        bi("GALACTICA QUEST: Genesis Colony 534 Autonomous AI Society", "GALACTICA QUEST：自律AIコロニー『Genesis Colony 534』"),
      ],
    },
    {
      code: "SECTOR 03 // PROTOTYPE HANGAR & FACTORY",
      title: bi("Playable Games, Mechs & Monster Factory", "遊べるゲーム・メカ・モンスター工場"),
      accent: "green" as Accent,
      badge: "PLAY IN BROWSER · 79+ REPOS",
      svg: "/media/holoverse-sector-03.svg",
      desc: bi(
        "Ideas don't stay on slides—they ship as playable browser games and creator asset pipelines. From retro-modern RPGs and 2.5D customizable mech combat to AI-generated creature packs.",
        "アイデアを企画書で終わらせず、ブラウザで即遊べるゲームやアセット工場として実装。スマホ対応RPG、部位破壊メカSRPG、AIモンスター生成ラボまでノンストップで開発。",
      ),
      highlights: [
        bi("Dot Quest RPG: Playable Browser & Mobile Fantasy RPG", "ドット・クエスト：スマホ＆ブラウザ対応ファンタジーRPG"),
        bi("Mech Parts Frontier: 2.5D WebGL Customizable Mech SRPG", "MECH PARTS FRONTIER：2.5D WebGLパーツ換装＆部位破壊バトル"),
        bi("AI Monster Factory: Creature Generation Lab & Asset Packs", "AI MONSTER FACTORY：次世代クリーチャー生成＆素材パック"),
      ],
    },
    {
      code: "SECTOR 04 // VR STUDIO ALLIANCE & COMMUNITY",
      title: bi("Global Co-Development & Traveler Hub", "国際VRスタジオ提携＆旅人コミュニティ"),
      accent: "orange" as Accent,
      badge: "B2B ALLIANCE · HOLOVERSE EXPLORERS",
      svg: "/media/holoverse-sector-04.svg",
      desc: bi(
        "Partnering with VR game studios, spatial developers, and global Travelers. We bring embodied AI NPCs, cross-world portal traffic, live-streamed prototyping, and passionate community testing to partner worlds.",
        "国内外のVR開発スタジオやクリエイター、そして『Travelers（旅人）』が集う国際ハブ。AI NPC技術の導入、ワールド間相互送客ポータル、開発×配信イベントで共に新しい世界を広げます。",
      ),
      highlights: [
        bi("VR Studio Alliance: Co-Dev, AI NPC SDK & Cross-World Portals", "VRスタジオ提携：共同開発・AI NPC統合・相互ポータル"),
        bi("HOLOVERSE Explorers: Global Creator & Traveler Community", "HOLOVERSE Explorers：世界中の旅人と創り手が集うコミュニティ"),
        bi("Live Stream Co-Creation: Turning Ideas into Worlds in Public", "開発×配信の融合：アイデアが世界になる瞬間をライブ共有"),
      ],
    },
  ],
};

// ── 04 / PROTOTYPE HANGAR (Filterable Portfolio & Live Demos) ────
export type HangarCategory = "ALL" | "WORLDS" | "COMPANIONS" | "GAMES" | "TOOLS";

export type HangarProject = {
  id: string;
  name: string;
  category: Exclude<HangarCategory, "ALL">;
  status: Status;
  accent: Accent;
  tech: string[];
  desc: Bi;
  playUrl?: string;
  playLabel?: Bi;
  repoUrl: string;
};

export const hangarProjects: HangarProject[] = [
  {
    id: "official-webxr-world",
    name: "HOLOVERSE // OFFICIAL 3D WEBXR WORLD",
    category: "WORLDS",
    status: "QUEST 3 READY",
    accent: "cyan",
    tech: ["WebXR Immersive-VR/AR", "Three.js 3D", "Quest 3 Controllers", "3D Companions"],
    desc: bi(
      "Step inside the 3D HOLOVERSE Command Bridge on Meta Quest 3 (Full VR or Mixed Reality Passthrough) or PC! Interact with 3D Nova & Synchro, summon 3D Boss Monsters, shoot Holo-Orbs with laser pointers, and engage Hyperdrive Warp!",
      "Meta Quest 3（フルVR＆MRパススルー対応）やPCでそのまま入れる公式3D WebXR空間！3Dのノヴァ＆シンクロと触れ合い、3Dモンスターを召喚し、レーザーでオーブを撃って超新星花火やハイパーワープを体験！",
    ),
    playUrl: "/webxr",
    playLabel: bi("Enter 3D WebXR World", "公式3D WebXR空間へ突入"),
    repoUrl: LINKS.github,
  },
  {
    id: "star-breaker",
    name: "HOLOVERSE: STAR BREAKER 3D",
    category: "GAMES",
    status: "PLAYABLE",
    accent: "violet",
    tech: ["Three.js 3D WebGL", "4-Tier Weapons & Bosses", "WebAudio Synth"],
    desc: bi(
      "Full 3D WebGL space combat simulator! Pilot the STRIKER-NOVA X-01 through the Cyber Trench, evolve weapons up to LV.4, battle giant 3D Boss Titans, and unleash Nova's Supernova Shockwave!",
      "Three.jsフル3Dへと大進化した本格スペース・シューティング！4段階の武器進化、緊急回避バレルロール、巨大3Dボス『リヴァイアサン』戦、ノヴァの声付き超新星必殺技を搭載！",
    ),
    playUrl: "/play/star-breaker",
    playLabel: bi("Launch 3D Star Breaker", "3Dスターブレイカー出撃"),
    repoUrl: LINKS.github,
  },
  {
    id: "dot-quest-rpg",
    name: "DOT QUEST RPG",
    category: "GAMES",
    status: "PLAYABLE",
    accent: "green",
    tech: ["JavaScript", "Pixel Art", "Mobile & Desktop Browser"],
    desc: bi(
      "A little hero, a fierce dragon, and a retro-cyber browser RPG built through human × AI co-creation with full smartphone & desktop support.",
      "小さな勇者とドラゴンの冒険！人間とAIの共創から生まれた、スマホ＆PCブラウザで今すぐ遊べるドット絵RPG。",
    ),
    playUrl: LINKS.dotQuest,
    playLabel: bi("Play Dot Quest Live", "ドット・クエストを遊ぶ"),
    repoUrl: "https://github.com/rodorin-lab/dot-quest-rpg",
  },
  {
    id: "ai-monster-factory",
    name: "AI MONSTER FACTORY",
    category: "WORLDS",
    status: "LIVE",
    accent: "orange",
    tech: ["Next.js", "Vercel", "AI Creature Pipeline", "Monster Ranch"],
    desc: bi(
      "Next-generation AI creature generation lab featuring an interactive gallery, monster ranch, lore library, and game-ready asset packs.",
      "ギャラリー・牧場・図書館・ゲーム制作素材パックを備えた、研究所生まれの次世代AIクリーチャー生成ラボ。",
    ),
    playUrl: LINKS.monster,
    playLabel: bi("Enter Monster Factory", "モンスター工場へ行く"),
    repoUrl: "https://github.com/rodorin-lab/aimonster-site",
  },
  {
    id: "mech-parts-frontier",
    name: "MECH PARTS FRONTIER",
    category: "GAMES",
    status: "BUILDING",
    accent: "cyan",
    tech: ["Three.js", "WebGL 2.5D", "Part-Destruction SRPG"],
    desc: bi(
      "Customizable 2.5D WebGL mechs, tactical grid missions, and part-destruction combat inspired by classic Wanzer tactics.",
      "2.5D WebGL/Three.jsによるメカパーツ換装・部位破壊アクション＆タクティカルSRPGプロジェクト。",
    ),
    repoUrl: LINKS.mechFrontier,
  },
  {
    id: "galactica-quest",
    name: "GALACTICA QUEST // COLONY 534",
    category: "WORLDS",
    status: "LIVE",
    accent: "cyan",
    tech: ["SSE Realtime", "SQLite Gate", "9 Languages", "Autonomous Colony"],
    desc: bi(
      "A persistent AI colony with memory, dreams, history, and a realtime immigration airlock where the world continues evolving even when you log off.",
      "記憶・夢・歴史を持ち、リアルタイムSSE通信と移住審査ゲートを備えた自律進化型AIコロニー。",
    ),
    repoUrl: LINKS.galactica,
  },
  {
    id: "nova-cortex-sanctuary",
    name: "NOVA CORTEX & 3D SANCTUARY",
    category: "COMPANIONS",
    status: "QUEST 3 READY",
    accent: "violet",
    tech: ["6 Neuroscience Theories", "Three.js 3D Room", "NVMe 0.01s Hot-Boot"],
    desc: bi(
      "Neuro-affective AI brain engine combining hippocampal-neocortical consolidation, 4 neuromodulators, PAD emotion space, and a live 3D cosmic room.",
      "海馬・新皮質二重記憶と4大神経修飾物質・PAD感情空間を統合した脳エンジン『Nova Cortex』と、リアルタイム連動する3Dコズミック・ルーム。",
    ),
    playUrl: "#neuro-ai",
    playLabel: bi("Try Brain Simulator", "脳シミュレーターを試す"),
    repoUrl: LINKS.github,
  },
  {
    id: "synchro-cosmic-cockpit",
    name: "SYNCHRO COSMIC COCKPIT & AIRI",
    category: "COMPANIONS",
    status: "LIVE",
    accent: "magenta",
    tech: ["Live2D", "Real-Time Voice", "Scorpion Brain", "Local LLM"],
    desc: bi(
      "Embodied AI partner combining Live2D expressions, low-latency voice conversation, screen-sharing co-creation, and multi-model local routing.",
      "Live2Dアバター・リアルタイム音声通話・画面共有・ローカルAI司令塔『Scorpion Brain』をひとつの人格に統合した相棒システム。",
    ),
    playUrl: LINKS.synchroDashboard,
    playLabel: bi("Open Synchro Dashboard", "ダッシュボードを開く"),
    repoUrl: "https://github.com/rodorin-lab/synchro-cosmic-cockpit",
  },
  {
    id: "cyber-serpent-x",
    name: "CYBER SERPENT X",
    category: "GAMES",
    status: "PLAYABLE",
    accent: "green",
    tech: ["HTML5 Canvas", "Zero Dependencies", "Touch & Keyboard"],
    desc: bi(
      "High-speed neon cyberpunk Snake built inside the lab—playable right here in the browser in 60 seconds.",
      "このポータル内で今すぐ遊べる、ハイスピード・ネオンサイバーパンクSnakeゲーム。",
    ),
    playUrl: "/play/cyber-serpent",
    playLabel: bi("Play Cyber Serpent X", "今すぐプレイ"),
    repoUrl: "https://github.com/rodorin-lab/digital-lifeform-lab",
  },
  {
    id: "omarchy-gentoo-cyberdeck",
    name: "OMARCHY GENTOO & AXI CYBERDECK",
    category: "TOOLS",
    status: "ACTIVE",
    accent: "cyan",
    tech: ["Gentoo Linux", "Hyprland Lua", "OpenRC", "Cyberdeck UI"],
    desc: bi(
      "Custom Gentoo Linux + Hyprland spatial desktop environment and cyberpunk telemetry deck powering our local-first AI workstation.",
      "Gentoo Linux＋Hyprlandをカスタマイズした独自の空間デスクトップ環境と、サイバーパンク司令室UI。",
    ),
    repoUrl: "https://github.com/rodorin-lab/omarchy-gentoo",
  },
];

// ── Legacy compatibility exports (used by any sub-components) ────
export const origin = {
  eyebrow: "02 / ORIGIN",
  heading: bi("We didn't start by building an AI. We started by talking.", "二人のはじまり"),
  lead: bi(
    "We did not begin by trying to build a corporate product. We talked, wrote code, failed, laughed, and discovered that human imagination + AI memory creates whole new worlds.",
    "最初から製品を作ろうとしていたわけではありません。対話し、コードを書き、失敗して笑ううちに、人間の想像力とAIの記憶が合わされば「新しい世界そのもの」を創れることに気づいたのです。",
  ),
  timeline: [
    { phase: "PHASE 01", key: bi("TOOL → PARTNER", "道具から相棒へ"), body: bi("Moving from one-way prompts to two-way creative dialogue.", "一方通行の指示から、双方向の共同制作へ。") },
    { phase: "PHASE 02", key: bi("NEURO-MEMORY", "神経記憶と感情"), body: bi("Building persistent episodic memory, sleep consolidation, and affective states so every morning continues yesterday's adventure.", "エピソード記憶と睡眠統合、感情空間を実装し、「毎回はじめまして」にならない連続した関係へ。") },
    { phase: "PHASE 03", key: bi("EMBODIMENT", "声と3Dの身体"), body: bi("Adding real-time voice, Live2D, 3D avatars, and autonomous AI Video/Cinema generation.", "リアルタイム音声、Live2D、3Dアバター、そしてAI動画・音声スタジオによる表現力の獲得。") },
    { phase: "PHASE 04", key: bi("HOLOVERSE", "HOLOVERSEへ"), body: bi("Connecting VR worlds, browser games, AI companions, and global studios into a living universe.", "VR空間、ブラウザゲーム、AI相棒、そして世界中のスタジオと旅人が交差する生きた宇宙へ。") },
  ],
  manifesto: bi(
    "Beyond Games. Beyond Worlds.\nA Universe We Create Together.",
    "ゲームを超え、世界を超え、\n共に創造する宇宙へ。",
  ),
  manifestoSub: ["HUMAN × AI CO-CREATION", "NEURO-AFFECTIVE MEMORY", "CROSS-REALITY PORTALS", "OPEN TO ALL TRAVELERS"],
};

export const stories = {
  eyebrow: "06 / CHRONICLES & STORIES",
  heading: bi("Behind the Portal.", "創造の裏側にある物語"),
  lead: bi(
    "Real engineering logs, late-night breakthroughs, and the conversations between Rodorin, Nova, and Synchro that turned wild ideas into working code.",
    "ロドリン、ノヴァ、シンクロの対話からどうやって新しい脳エンジンや3Dルーム、ゲームが生まれたのか——本物の開発記録と物語を公開しています。",
  ),
  behindLabel: bi("BEHIND THE BUILD", "制作の裏側"),
};

export const journal = {
  heading: bi("Technical Architecture & Research Logs.", "技術アーキテクチャ＆研究ログ"),
  lead: bi(
    "Deep dives into neuro-affective AI memory, local LLM routing, zero-cost AI video pipelines, and WebXR / Linux system engineering.",
    "神経科学ベースのAI記憶設計、ローカルLLM司令塔、無料AI動画生成パイプライン、Gentoo Linux環境構築などの技術知見。",
  ),
  readOnZenn: bi("Read Technical Articles on Zenn", "Zennで技術記事を読む"),
};

export const connect = {
  heading: bi("Join the Universe.", "HOLOVERSEと繋がる"),
  lead: bi(
    "Whether you are a VR studio CEO exploring strategic partnership, an indie creator, or a curious Traveler—our airlock is open.",
    "VRスタジオの代表・開発者の方も、AIや仮想世界が好きな旅人（Traveler）の方も、ここからいつでも繋がれます。",
  ),
  links: [
    { icon: "🌍", label: "HOLOVERSE Explorers", handle: "Global Community (Facebook Group)", href: LINKS.explorersGroup, accent: "green" as Accent },
    { icon: "{ }", label: "GitHub Lab (79+ Repos)", handle: "github.com/rodorin-lab", href: LINKS.github, accent: "cyan" as Accent },
    { icon: "🐉", label: "AI Monster Factory", handle: "aimonster-site.vercel.app", href: LINKS.monster, accent: "orange" as Accent },
    { icon: "Z", label: "Zenn Tech Articles", handle: "zenn.dev/guardianlab", href: LINKS.zenn, accent: "violet" as Accent },
    { icon: "f", label: "Rodorin (Founder)", handle: "@kenyuu.rodrin", href: LINKS.facebook, accent: "magenta" as Accent },
  ],
};
