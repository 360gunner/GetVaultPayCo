import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { themeClass } from "@/styles/theme.css";
import type { Viewport } from "next";

import "./globals.css";
import ViewportUnitsUpdater from "@/components/ViewportUnitsUpdater";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VaultPay",
  description: "Vaultpay website",
};

export const viewport: Viewport = {
  width: "1440",
  initialScale: 1,
  height: "900",
  colorScheme: "only light",
  viewportFit: "cover",
  maximumScale: 4,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Keep CSS custom properties --vw and --vh in sync with the viewport via client component

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${instrumentSans.variable} antialiased ${themeClass}`}
      >
        <ViewportUnitsUpdater />
        {children}
      </body>
    </html>
  );
}
