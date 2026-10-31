/** Add future projects or crew channels here; rendering stays data driven. */
export type ExplorerLink = {
  id: string;
  title: string;
  category: "projects" | "signals" | "community";
  label: string;
  description: string;
  ja: string;
  url: string;
  glyph: string;
};

export const explorerLinks: ExplorerLink[] = [
  {
    id: "lab",
    title: "Digital Lifeform Lab",
    category: "projects",
    label: "THE HOME BASE",
    description: "Experiments in AI, virtual worlds, and creating together.",
    ja: "AIと仮想世界を、一緒につくる研究拠点。",
    url: "https://digital-lifeform-lab.vercel.app/",
    glyph: "◈",
  },
  {
    id: "github",
    title: "Rodorin Lab",
    category: "projects",
    label: "SOURCE CODE",
    description: "Explore the code. Find an experiment to build on.",
    ja: "コードをのぞいて、次の実験へ。",
    url: "https://github.com/rodorin-lab",
    glyph: "⌘",
  },
  {
    id: "monsters",
    title: "AI Monster Ranch",
    category: "projects",
    label: "ANOTHER WORLD",
    description: "Visit the AI Monster Ranch project.",
    ja: "AI Monster Ranchの世界へ。",
    url: "https://aimonster-site.vercel.app/",
    glyph: "✧",
  },
  {
    id: "youtube",
    title: "YouTube",
    category: "signals",
    label: "VIDEO LOG",
    description: "Follow the journey in video.",
    ja: "映像でたどる、創作と探検の記録。",
    url: "https://www.youtube.com/@kenyuu2143",
    glyph: "▷",
  },
  {
    id: "twitch",
    title: "Twitch",
    category: "signals",
    label: "STREAM CHANNEL",
    description: "A place to watch, explore, and hang out.",
    ja: "配信を見ながら、気軽にひと息。",
    url: "https://www.twitch.tv/kenyuu2143",
    glyph: "▥",
  },
  {
    id: "fb-group",
    title: "Facebook Group",
    category: "community",
    label: "COMMUNITY",
    description: "Join the conversation around our shared interests.",
    ja: "好きなことを持ち寄って、つながる場所。",
    url: "https://www.facebook.com/groups/1231558456489278",
    glyph: "◎",
  },
  {
    id: "fb-page",
    title: "Facebook Page",
    category: "community",
    label: "UPDATES",
    description: "Find project posts and updates.",
    ja: "プロジェクトの投稿や近況はこちら。",
    url: "https://www.facebook.com/profile.php?id=61590674551609",
    glyph: "▤",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    category: "community",
    label: "CREATOR NETWORK",
    description: "Connect around XR, AI, and future collaborations.",
    ja: "XR・AI・未来の共創についてつながろう。",
    url: "https://www.linkedin.com/in/kenyuu-nakama-7ba084140/",
    glyph: "↗",
  },
];

export const explorerBio = `HOLOVERSE // DIGITAL EXPLORER
VR explorer | World builder | AI agent creator

Building HoloVerse: virtual worlds where humans and AI create together.
Exploring Resonite, VRChat, WebXR & VR development.
Let's discover strange worlds and build new experiences!

JP native / EN learning
May go AFK for family responsibilities. Thanks for understanding.

AIと人間が一緒に旅し、創る仮想世界を開発中。
Resonite・VR開発の仲間も歓迎！気軽に話しかけてね。
家庭の都合で急に離席することがあります。`;

export const proposedProfileLinks = [
  "https://digital-lifeform-lab.vercel.app/",
  "https://github.com/rodorin-lab",
  "https://digital-lifeform-lab.vercel.app/links",
];
