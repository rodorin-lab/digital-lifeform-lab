import type { Metadata } from "next";
import ExplorerTerminal from "./terminal";

export const metadata: Metadata = {
  title: "HOLOVERSE // DIGITAL EXPLORER — Rodorin's Links",
  description:
    "Step into Rodorin's HoloVerse terminal. Explore AI agents, VR development, Resonite, projects, streams, and communities.",
  alternates: { canonical: "https://digital-lifeform-lab.vercel.app/links" },
  openGraph: {
    title: "HOLOVERSE // DIGITAL EXPLORER",
    description: "Virtual worlds. Human × AI. Create together.",
    url: "https://digital-lifeform-lab.vercel.app/links",
    images: [
      {
        url: "https://digital-lifeform-lab.vercel.app/explorer/banner.png",
        alt: "HoloVerse digital explorer and orbital portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOLOVERSE // DIGITAL EXPLORER",
    images: ["https://digital-lifeform-lab.vercel.app/explorer/banner.png"],
  },
};

export default function LinksPage() {
  return <ExplorerTerminal />;
}
