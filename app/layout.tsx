import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { themeClass } from "@/styles/theme.css";
import type { Viewport } from "next";

import "./globals.css";
import ViewportUnitsUpdater from "@/components/ViewportUnitsUpdater";
import { ImageAnimationWrapper } from "@/components/ImageAnimationWrapper";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VaultPay - The Human Way to Money",
  description: "VaultPay is your borderless social wallet. Pay, transfer, and save across currencies with ease, community, and control. Join 2M+ users worldwide.",
  keywords: ["digital wallet", "payment app", "money transfer", "borderless payments", "social wallet"],
  authors: [{ name: "VaultPay" }],
  icons: {
    icon: "/icon?v=4",
  },
  metadataBase: new URL("https://getvaultpay.co"),
  openGraph: {
    title: "VaultPay - The Human Way to Money",
    description: "VaultPay is your borderless social wallet. Pay, transfer, and save across currencies with ease.",
    url: "https://getvaultpay.co",
    siteName: "VaultPay",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VaultPay - The Human Way to Money",
    description: "VaultPay is your borderless social wallet. Pay, transfer, and save across currencies with ease.",
  },
};

export const viewport: Viewport = {
  width: "1440",
  initialScale: 0.2,
  height: "900",
  colorScheme: "only light",
  viewportFit: "auto",
  userScalable: true,
  maximumScale: 1.2,
  minimumScale: 0.2,
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
        <ImageAnimationWrapper />
        {children}
      </body>
    </html>
  );
}
