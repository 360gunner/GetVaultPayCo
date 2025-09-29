"use client";
import React, { useEffect, useState } from "react";
import * as s from "./Navbar.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import Button from "@/components/Button/Button";
import ImageButton from "@/components/ImageButton/ImageButton";
import { vars } from "@/styles/theme.css";
import MegaMenu from "@/components/MegaMenu/MegaMenu";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  noBg?: boolean;
  // When true, navbar has no background and UI controls appear as white/outlined on dark backgrounds
  darkGhost?: boolean;
}

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

export const Navbar: React.FC<NavbarProps> = ({ className, noBg, ...rest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkGhost, setDarkGhost] = useState(rest.darkGhost || false);
  const toggleDarkGhostOnMenuToggle = () => {
    if (menuOpen) {
      setDarkGhost(false);
    } else {
      setDarkGhost(rest.darkGhost || false);
    }
  };
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
  useEffect(() => {
    toggleDarkGhostOnMenuToggle();
  }, [menuOpen]);
  const showBg = !noBg && !darkGhost;
  const logoSrc = darkGhost
    ? "/logo_horizontal_white.png"
    : "/logo_horizontal.png";

  return (
    <nav className={[s.root, className].filter(Boolean).join(" ")} {...rest}>
      {showBg && <BgShape />}
      <div className={s.content}>
        <Container
          size="full"
          style={{ paddingRight: vars.space.xl, paddingLeft: vars.space.lg }}
        >
          <div className={s.inner}>
            <div className={s.left}>
              <Image
                src={logoSrc}
                alt="Vault Logo"
                width={203 / 1.1}
                height={40 / 1.1}
                priority
              />
            </div>
            <div className={s.right}>
              <Button
                variant={darkGhost ? "ghost" : menuOpen ? "ghost" : "secondary"}
                size="medium"
                label="Sign up"
                style={{
                  boxShadow: !menuOpen ? "none" : undefined,
                  fontSize: 20,
                  ...(darkGhost
                    ? {
                        color: "#fff",
                        border: "1px solid #fff",
                        backgroundColor: "transparent",
                      }
                    : menuOpen
                    ? {}
                    : { backgroundColor: vars.color.vaultWhite }),
                }}
              />
              <Button
                variant={darkGhost ? "ghost" : menuOpen ? "ghost" : "primary"}
                size="medium"
                label="Sign in"
                style={{
                  fontSize: 20,
                  ...(darkGhost
                    ? {
                        color: "#fff",
                        border: "1px solid #fff",
                        backgroundColor: "transparent",
                      }
                    : {}),
                }}
              />
              <ImageButton
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-pressed={menuOpen}
                variant={darkGhost ? "ghost" : "filled"}
                shape="pill"
                style={
                  darkGhost
                    ? {
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.9)",
                        color: "#fff",
                      }
                    : undefined
                }
                icon={
                  menuOpen
                    ? {
                        alt: "Close",
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
                              stroke={darkGhost ? "white" : "white"}
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                      }
                    : darkGhost
                    ? {
                        alt: "Menu",
                        // White outlined hamburger for dark ghost mode
                        children: (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 7h16"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
                            <path
                              d="M4 12h16"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
                            <path
                              d="M4 17h16"
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
