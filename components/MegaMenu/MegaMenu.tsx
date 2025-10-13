import React from "react";
import * as s from "./MegaMenu.css";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";

export type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

type ActionItem = {
  label: string;
  variant?: Parameters<typeof Icon>[0]["variant"];
  src?: string;
  alt?: string;
};
const actions: ActionItem[] = [
  {
    label: "Send money internationally",
    src: "/globe_green_icon.svg",
    alt: "Globe",
  },
  { label: "Pay bills", src: "/drop_green_icon.svg", alt: "Pay bills" },
  { label: "Order a Card", src: "/heart_green_icon.svg", alt: "Order a Card" },
  {
    label: "Share with friends & family",
    src: "/gift_green_icon.svg",
    alt: "Share",
  },
  { label: "Set up your shop", src: "/bag_green_icon.svg", alt: "Shop" },
  { label: "Refill your Wallet", src: "/dollar_green_icon.svg", alt: "Wallet" },
];

// Map action labels to routes used in Link wrappers
const actionRouteMap: Record<string, string> = {
  "Send money internationally": "/borderless-transfers",
  "Pay bills": "/ways-to-pay",
  "Order a Card": "/cards",
  "Share with friends & family": "/social",
  "Set up your shop": "/business-overview",
  "Refill your Wallet": "/manage-your-wallet",
};

const nav = [
  {
    title: "Send & Receive",
    items: [
      "How it Works",
      "Manage your wallet",
      "Borderless transfers",
      "Security & Protection",
    ],
  },
  {
    title: "Get Paid",
    items: ["Business Accounts", "Online & In-App", "In Stores", "Advantages"],
  },
  {
    title: "Use to Pay",
    items: ["Ways to Pay", "Online & In App", "In Stores ", "Cards"],
  },
  {
    title: "Social",
    items: ["How it Works ", "Share with a Friend "],
  },
];

// Map nav item labels to routes used in Link wrappers
const navRouteMap: Record<string, string> = {
  "How it Works": "/send-and-receive",
  "Manage your wallet": "/manage-your-wallet",
  "Borderless transfers": "/borderless-transfers",
  "Security & Protection": "/security-and-protection",
  "Business Accounts": "/business-overview",
  "Online & In-App": "/business-online",
  "In Stores": "/business-in-store",
  Advantages: "/advantages",
  "Ways to Pay": "/ways-to-pay",
  Cards: "/cards",
  "Share with a Friend": "/social",
  "Ways To Pay": "/ways-to-pay",
  "Online & In App": "/pay-online",
  "In Stores ": "/pay-online",
  "How it Works ": "/social",
  "Share with a Friend ": "/social",
};

const MegaMenu: React.FC<MegaMenuProps> = ({ open, onClose }) => {
  return (
    <div
      className={s.overlay}
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
    >
      {/* Main content */}
      <div className={s.content}>
        {/* Left: Action cards */}
        <div className={s.cardsGrid}>
          {actions.map((a) => (
            <Link
              key={a.label}
              className={s.actionCard}
              href={actionRouteMap[a.label] || "/"}
              onClick={onClose}
            >
              {/* SVG black background with slight slant */}
              <svg
                className={s.actionBg}
                viewBox="0 0 300 154"
                // preserveAspectRatio="none"
              >
                <path
                  d="M0 154H238.249C251.294 154 262.84 145.638 266.954 133.286L279.871 95.6236L298.434 39.8325C304.94 20.2354 290.365 0 269.697 0H73.3885C60.3438 0 48.7981 8.36228 44.6837 20.7142L0 154Z"
                  fill="black"
                />
              </svg>

              {/* Top-right icon (png/svg via Icon component) */}
              <Icon
                className={s.actionIconTopRight}
                variant={a.variant as any}
                src={a.src}
                alt={a.alt}
              />

              {/* Bottom-left label */}
              <Typography
                as="span"
                className={s.actionLabel}
                color={vars.color.vpGreen}
              >
                {a.label}
              </Typography>
            </Link>
          ))}
        </div>

        {/* Right: Navigation columns */}
        <div className={s.navCols}>
          {nav.map((group) => (
            <div key={group.title} className={s.navGroup}>
              <Typography
                as="h4"
                font="Space Grotesk"
                weight={400}
                style={{ fontSize: fluidUnit(30, 22) }}
                className={s.navTitle}
              >
                {group.title}
              </Typography>
              {group.items.map((it) => (
                <Link
                  key={it}
                  className={s.navItem}
                  href={navRouteMap[it] || "/"}
                  onClick={onClose}
                >
                  <Typography
                    as="span"
                    className={s.navItemText}
                    style={{ fontSize: fluidUnit(20, 16) }}
                  >
                    {it}
                  </Typography>
                  <Typography
                    as="span"
                    className={s.navItemArrow}
                    font="Instrument Sans"
                  >
                    →
                  </Typography>{" "}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom banner */}
      <div style={{ padding: 16, paddingTop: 8 }}>
        <div className={s.bottomBanner}>
          <Image
            unoptimized
            src="/image 96.png"
            alt="Start your vault"
            fill
            style={{ objectFit: "cover", objectPosition: "10% 25%" }}
          />
          <div className={s.bannerOverlay}>
            <div className={s.bannerContent}>
              <Typography
                as="h1"
                font="Space Grotesk"
                style={{
                  color: "#fff",
                  fontWeight: 400,
                  marginBottom: fluidUnit(8),
                  fontSize: fluidUnit(76, 38),
                }}
              >
                Start your vault
              </Typography>
              <Button
                variant="colored"
                size="large"
                style={{
                  padding: `${fluidUnit(14, 12)} ${fluidUnit(20, 12)}`,
                }}
                backgroundColor={vars.color.neonMint}
              >
                <Typography
                  as="span"
                  style={{
                    margin: 0,
                    fontWeight: 400,
                    fontSize: fluidUnit(22, 12),
                  }}
                >
                  Download The App
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
