import React from "react";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { themeClass } from "@/styles/theme.css";
import ViewportUnitsUpdater from "@/components/ViewportUnitsUpdater";
import { ImageAnimationWrapper } from "@/components/ImageAnimationWrapper";
import { AuthProvider } from "@/lib/auth-context";

import "./globals.css";

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
  description:
    "VaultPay is your borderless social wallet. Pay, transfer, and save across currencies with ease, community, and control. Join 2M+ users worldwide.",
  keywords: [
    "digital wallet",
    "payment app",
    "money transfer",
    "borderless payments",
    "social wallet",
  ],
  authors: [{ name: "VaultPay" }],

  // ✅ Use vaultpay-icon.png as favicon
  icons: {
    icon: [
      { url: "/vaultpay-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/vaultpay-icon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/vaultpay-icon.png",
    shortcut: "/vaultpay-icon.png",
  },

  metadataBase: new URL("https://getvaultpay.co"),

  openGraph: {
    title: "VaultPay - The Human Way to Money",
    description:
      "VaultPay is your borderless social wallet. Pay, transfer, and save across currencies with ease.",
    url: "https://getvaultpay.co",
    siteName: "VaultPay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/vaultpay-icon.png",
        width: 1200,
        height: 630,
        alt: "VaultPay Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VaultPay - The Human Way to Money",
    description:
      "VaultPay is your borderless social wallet. Pay, transfer, and save across currencies with ease.",
    images: ["/vaultpay-icon.png"],
  },
};

export const viewport: Viewport = {
  width: "1440",
  height: "900",
  initialScale: 0.2,
  maximumScale: 1.2,
  minimumScale: 0.2,
  userScalable: true,
  colorScheme: "only light",
  viewportFit: "auto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Favicon links */}
        <link rel="icon" href="/vaultpay-icon.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/vaultpay-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/vaultpay-icon.png" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${instrumentSans.variable} antialiased ${themeClass}`}
      >
        <AuthProvider>
          <ViewportUnitsUpdater />
          <ImageAnimationWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
