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
  title: "HOLOVERSE // LIVING PORTAL | Beyond Games. Beyond Worlds.",
  description:
    "Official Living Portal of HOLOVERSE (Rodorin Lab × Digital Lifeform Lab). Explore neuro-affective AI companions (Nova & Synchro), VR worlds across Meta Quest 3, Resonite, Roblox & WebXR, playable browser games, AI Monster Factory, and global VR Studio Alliances.",
  keywords: [
    "HOLOVERSE",
    "AI companion",
    "Neuro-Affective AI",
    "Nova Cortex",
    "Synchro",
    "Meta Quest 3",
    "WebXR",
    "Resonite",
    "VR Studio Alliance",
    "Rodorin Lab",
    "Digital Lifeform Lab",
  ],
  openGraph: {
    title: "HOLOVERSE // LIVING PORTAL | Beyond Games. Beyond Worlds.",
    description:
      "A Universe We Create Together — where humans and neuro-affective AI companions co-create VR worlds, games, and spatial experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOLOVERSE // LIVING PORTAL | Beyond Games. Beyond Worlds.",
    description:
      "Explore neuro-affective AI companions, playable browser games, VR worlds, and global studio alliances.",
  },
};

export const viewport: Viewport = {
  themeColor: "#03040a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${chakra.variable} antialiased`}
        suppressHydrationWarning
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
