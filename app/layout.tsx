import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Orbitron, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});
const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DIGITAL LIFEFORM LAB | Rodorin × Synchro",
  description:
    "A co-creation lab where Rodorin and his AI companion Synchro build local AI, games, tools, and digital creations together. Behind-the-scenes stories, experiments, technical notes, and how to start your own AI companion.",
  keywords: [
    "AI companion", "co-creation", "local AI", "local LLM", "cyberpunk",
    "Synchro", "Rodorin", "digital lifeform", "Ollama", "creative coding", "Yokohama", "Japan",
  ],
  openGraph: {
    title: "DIGITAL LIFEFORM LAB | Rodorin × Synchro",
    description: "A co-creation lab where Rodorin and his AI companion Synchro build local AI, games, tools, and digital creations together.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGITAL LIFEFORM LAB | Rodorin × Synchro",
    description: "A co-creation lab where a human and his AI companion build local AI, games, and tools together.",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${chakra.variable} antialiased`} suppressHydrationWarning>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
