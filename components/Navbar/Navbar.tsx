"use client";
import React, { useEffect, useState } from "react";
import * as s from "./Navbar.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import Button from "@/components/Button/Button";
import ImageButton from "@/components/ImageButton/ImageButton";
import { vars } from "@/styles/theme.css";
import MegaMenu from "@/components/MegaMenu/MegaMenu";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const BgShape: React.FC = () => (
  <div className={s.bgShape} aria-hidden>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 133"
      fill="none"
      preserveAspectRatio="xMaxYMax slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <path
        d="M1440 -8L-0.999988 -8C-14.5515 -8.00001 -17.7217 15.1459 -22 28L-30.5 57.5L-41.3663 91.6082C-48.1454 111.977 -32.9796 133 -11.5061 133L1370.65 133C1384.2 133 1396.23 124.326 1400.51 111.472L1440 -8Z"
        fill="url(#paint0_linear_2245_312)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2245_312"
          x1="249.216"
          y1="-8.38997"
          x2="-37.2109"
          y2="115.275"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#06FF89" />
          <stop offset="0.08" stopColor="#2CFF8D" />
          <stop offset="0.19" stopColor="#5EFF93" />
          <stop offset="0.29" stopColor="#85FF98" />
          <stop offset="0.39" stopColor="#A1FF9C" />
          <stop offset="0.47" stopColor="#B2FF9E" />
          <stop offset="0.54" stopColor="#B8FF9F" />
          <stop offset="0.71" stopColor="#C3F5B7" />
          <stop offset="1" stopColor="#DBE2EA" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({ className, ...rest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Lock the page scroll when the mega menu is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const body = document.body;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPaddingRight = body.style.paddingRight;

    if (menuOpen) {
      const scrollBarWidth = window.innerWidth - html.clientWidth;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      html.style.overflow = originalHtmlOverflow || "";
      body.style.overflow = originalBodyOverflow || "";
      body.style.paddingRight = originalBodyPaddingRight || "";
    }

    return () => {
      html.style.overflow = originalHtmlOverflow || "";
      body.style.overflow = originalBodyOverflow || "";
      body.style.paddingRight = originalBodyPaddingRight || "";
    };
  }, [menuOpen]);
  return (
    <nav className={[s.root, className].filter(Boolean).join(" ")} {...rest}>
      <BgShape />
      <div className={s.content}>
        <Container
          size="full"
          style={{ paddingRight: vars.space.xl, paddingLeft: vars.space.lg }}
        >
          <div className={s.inner}>
            <div className={s.left}>
              <Image
                src="/logo_horizontal.png"
                alt="Vault Logo"
                width={128}
                height={21}
                priority
              />
            </div>
            <div className={s.right}>
              <Button
                variant={menuOpen ? "ghost" : "secondary"}
                size="medium"
                label="Sign up"
                style={{ border: !menuOpen ? "none" : undefined }}
                backgroundColor={menuOpen ? undefined : vars.color.vaultWhite}
              />
              <Button
                variant={menuOpen ? "ghost" : "primary"}
                size="medium"
                label="Sign in"
              />
              <ImageButton
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-pressed={menuOpen}
                variant="filled"
                shape="pill"
                icon={
                  menuOpen
                    ? {
                        alt: "Close",
                        // Inline X icon so we don't depend on assets
                        children: (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18M6 6l12 12"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                      }
                    : { variant: "menu" }
                }
                onClick={() => setMenuOpen((prev) => !prev)}
              />
            </div>
          </div>
        </Container>
      </div>
      {menuOpen && (
        <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      )}{" "}
    </nav>
  );
};

export default Navbar;
