import React from "react";
import * as s from "./MegaMenu.css";
import Image from "next/image";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import { vars } from "@/styles/theme.css";

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
  { label: "Send money internationally", variant: "globe", alt: "Globe" },
  { label: "Pay bills", src: "/drop_icon.png", alt: "Pay bills" },
  { label: "Order a Card", src: "/card_icon.png", alt: "Order a Card" },
  {
    label: "Share with friends & family",
    src: "/friend_icon.png",
    alt: "Share",
  },
  { label: "Set up your shop", src: "/shop_icon.png", alt: "Shop" },
  { label: "Refill your Wallet", src: "/dollar_icon.png", alt: "Wallet" },
];

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
    items: ["Ways to Pay", "Online & In-App", "In Stores", "Cards"],
  },
  {
    title: "Social",
    items: ["How it Works", "Share with a Friend"],
  },
];

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
            <div
              key={a.label}
              className={s.actionCard}
              role="button"
              tabIndex={0}
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
            </div>
          ))}
        </div>

        {/* Right: Navigation columns */}
        <div className={s.navCols}>
          {nav.map((group) => (
            <div key={group.title} className={s.navGroup}>
              <Typography
                as="h4"
                font="Space Grotesk"
                weight={700}
                className={s.navTitle}
              >
                {group.title}
              </Typography>
              {group.items.map((it) => (
                <div key={it} className={s.navItem} role="link" tabIndex={0}>
                  <Typography as="span">{it}</Typography>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="#111"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom banner */}
      <div style={{ padding: 16 }}>
        <div className={s.bottomBanner}>
          <Image
            src="/image 96.png"
            alt="Start your vault"
            fill
            style={{ objectFit: "cover" }}
          />
          <div className={s.bannerOverlay}>
            <Typography
              as="h2"
              font="Space Grotesk"
              weight={800}
              style={{ color: "#fff", fontSize: 28 }}
            >
              Start your vault
            </Typography>
            <Button
              variant="colored"
              size="medium"
              backgroundColor={vars.color.neonMint}
            >
              <Typography as="span" style={{ margin: 0, fontWeight: 700 }}>
                Signup for Free
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
