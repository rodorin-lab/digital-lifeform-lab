"use client";

const orbitNodes = [
  { id: "SCORPION", label: "SCORPION BRAIN", meta: "LOCAL COMMAND CENTER", angle: "node-a" },
  { id: "AIOS", label: "AXI / AIOS", meta: "LIVING SPACE OS", angle: "node-b" },
  { id: "CRYSTAL", label: "CRYSTAL LAB", meta: "RESEARCH PORTAL", angle: "node-c" },
  { id: "HERMES", label: "HERMES ROUTER", meta: "FAST | CODE | DEEP", angle: "node-d" },
  { id: "TUI", label: "CYBERPUNK TUI", meta: "TERMINAL EXPERIMENTS", angle: "node-e" },
  { id: "LOCAL", label: "LOCAL AI", meta: "NO CLOUD / NO CREDITS", angle: "node-f" },
];

const liveLogs = [
  "SCORPION BRAIN ONLINE",
  "LOCAL NEURAL CORE ACTIVE",
  "AXI_PRESENCE: breathing",
  "ROUTING: fast | code | deep | coder9",
  "OLLAMA: linked",
  "HERMES_AGENT: listening",
  "MODEL_STREAM: 42 tok/s",
  "LATENCY_DROP: 24s -> 0.3s",
  "CLOUD_CREDITS: 0",
  "WARNING: orbital interface unstable",
];

const windows = [
  {
    className: "win-command",
    eyebrow: "NEURAL TERMINAL",
    title: "SCORPION BRAIN",
    lines: ["automatic model routing", "Ollama / Hermes Agent", "Qwen / Gemma", "No cloud. No credits."],
  },
  {
    className: "win-lab",
    eyebrow: "LAB SIGNAL",
    title: "CRYSTAL LAB",
    lines: ["official portal layer", "作品ポートフォリオ", "AI research base", "海外向け access node"],
  },
  {
    className: "win-service",
    eyebrow: "SERVICE PORT",
    title: "LOCAL AI WORK",
    lines: ["workflow setup", "local LLM consultation", "cyberpunk TUI prototype", "Fiverr route active"],
  },
  {
    className: "win-logs",
    eyebrow: "EXTERNAL LOGS",
    title: "FIELD RECORDS",
    lines: ["X realtime signals", "note development logs", "Zenn engineering notes", "GitHub repositories"],
  },
];

const links = [
  { label: "GitHub", href: "https://github.com/scorpionbrain" },
  { label: "X", href: "https://x.com/YokohamaLab" },
  { label: "note", href: "https://note.com/scorpionbrain" },
  { label: "Zenn", href: "https://zenn.dev/scorpionbrain" },
  { label: "Fiverr", href: "https://www.fiverr.com/" },
];

function AxiCore() {
  return (
    <div className="axi-core" aria-label="AXI central entity">
      <div className="core-aura" />
      <div className="core-orbit orbit-x" />
      <div className="core-orbit orbit-y" />
      <div className="core-orbit orbit-z" />
      <div className="core-entity">
        <span>AXI</span>
        <small>living core</small>
      </div>
      {orbitNodes.map((node) => (
        <div className={`orbit-node ${node.angle}`} key={node.id}>
          <strong>{node.id}</strong>
          <span>{node.meta}</span>
        </div>
      ))}
    </div>
  );
}

function HologramWindow({
  className,
  eyebrow,
  title,
  lines,
}: {
  className: string;
  eyebrow: string;
  title: string;
  lines: string[];
}) {
  return (
    <section className={`holo-window ${className}`}>
      <div className="window-topline">
        <span>{eyebrow}</span>
        <span>live</span>
      </div>
      <h2>{title}</h2>
      <div className="window-lines">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}

function LiveConsole() {
  return (
    <aside className="live-console">
      <div className="console-head">
        <span>AIOS://BOOT_STREAM</span>
        <span>unstable</span>
      </div>
      <div className="console-feed">
        {liveLogs.map((line, index) => (
          <p key={line} style={{ animationDelay: `${index * 0.28}s` }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {line}
          </p>
        ))}
      </div>
    </aside>
  );
}

function SignalBands() {
  return (
    <>
      <div className="signal-band signal-band-left" aria-hidden="true">
        <span>LOCAL_NEURAL_CORE</span>
        <span>SYNC 87%</span>
        <span>NO CLOUD</span>
      </div>
      <div className="signal-band signal-band-right" aria-hidden="true">
        <span>AXI_PRESENCE</span>
        <span>ORBITAL NOISE 13.8%</span>
        <span>ROUTER ACTIVE</span>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="station-shell">
      <div className="space-background" aria-hidden="true">
        <div className="nebula nebula-a" />
        <div className="nebula nebula-b" />
        <div className="starfield starfield-a" />
        <div className="starfield starfield-b" />
        <div className="scanlines" />
        <div className="noise-field" />
      </div>

      <SignalBands />

      <header className="station-header">
        <div>
          <span>AXI SPACE STATION</span>
          <strong>LOCAL NEURAL CORE</strong>
        </div>
        <nav>
          {links.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="station-frame" aria-hidden="true" />

      <section className="station-interface" aria-label="AXI Space Station interface">
        <div className="mission-copy">
          <p>ACCESSING AI SPACE INTERFACE</p>
          <h1>AXI Space Station</h1>
          <h2>No cloud. No credits. Pure local power.</h2>
        </div>

        <AxiCore />

        {windows.map((window) => (
          <HologramWindow key={window.title} {...window} />
        ))}

        <LiveConsole />

        <a className="enter-port" href="https://www.fiverr.com/">
          OPEN SERVICE PORT
        </a>
      </section>

      <footer className="station-footer">
        <span>YOKOHAMA_LOCAL_AI_ORBITAL_PORT</span>
        <span>SCORPION BRAIN / AXI / AIOS / CRYSTAL LAB</span>
      </footer>
    </main>
  );
}
