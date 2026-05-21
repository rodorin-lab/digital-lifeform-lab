import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AXI Space Station — Local Neural Core",
  description:
    "Official portal for AXI, SCORPION BRAIN, Crystal Lab, Local AI, and AIOS. No cloud. No credits. Pure local power.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
