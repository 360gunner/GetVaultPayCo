"use client";
import React, { useEffect, useState } from "react";
import * as s from "./Navbar.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";
import ImageButton from "@/components/ImageButton/ImageButton";
import { vars } from "@/styles/theme.css";
import MegaMenu from "@/components/MegaMenu/MegaMenu";
import { hideOnSmallScreen } from "@/styles/hide-on-small-screen.css";
import { fluidUnit } from "@/styles/fluid-unit";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  noBg?: boolean;
  // When true, navbar has no background and UI controls appear as white/outlined on dark backgrounds
  darkGhost?: boolean;
}

const BgShape: React.FC = () => (
  <div className={s.bgShape} aria-hidden>
    <svg
      width="1440"
      height="135"
      viewBox="0 0 1440 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMax slice"
      style={{
        width: "103%",
        height: "100%",
        display: "block",
        transform: "translateX(-2%)",
      }}
    >
      <path
        d="M1442 -5.99994L1.00001 -5.99994C-12.5515 -5.99994 -15.7217 17.146 -20 30.0001L-28.5 59.5001L-39.3663 93.6082C-46.1454 113.977 -30.9796 135 -9.5061 135L1372.65 135C1386.2 135 1398.23 126.326 1402.51 113.472L1442 -5.99994Z"
        fill="url(#paint0_linear_1_799)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_799"
          x1="251.216"
          y1="-6.38991"
          x2="-35.2109"
          y2="117.275"
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
    ? "/logo_horizontal_white.svg"
    : "/logo_horizontal.svg";

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
              <Link href="/" style={{ display: "inline-block" }}>
                <Image
                  unoptimized
                  src={logoSrc}
                  alt="Vault Logo"
                  width={203 / 1.05}
                  height={40 / 1.05}
                  priority
                />
              </Link>
            </div>
            <div className={s.right} style={{ gap: fluidUnit(20, 12) }}>
              <Link
                href="/signup"
                style={{ textDecoration: "none" }}
                className={hideOnSmallScreen}
              >
                <Button
                  variant={
                    darkGhost ? "ghost" : menuOpen ? "ghost" : "secondary"
                  }
                  size="large"
                  label="Signup"
                  textStyle={{ fontSize: fluidUnit(20, 20 * 0.8) }}
                  style={{
                    padding: `${fluidUnit(18, 18 * 0.8)} ${fluidUnit(
                      21,
                      21 * 0.8
                    )}`,
                    boxShadow: !menuOpen ? "none" : undefined,
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
              </Link>
              <Link
                href="/signin"
                style={{ textDecoration: "none" }}
                className={hideOnSmallScreen}
              >
                <Button
                  variant={darkGhost ? "ghost" : menuOpen ? "ghost" : "primary"}
                  size="large"
                  label="Login"
                  textStyle={{ fontSize: fluidUnit(20, 20 * 0.8) }}
                  style={{
                    padding: `${fluidUnit(18, 18 * 0.8)} ${fluidUnit(
                      21,
                      21 * 0.8
                    )}`,
                    ...(darkGhost
                      ? {
                          color: "#fff",
                          border: "1px solid #fff",
                          backgroundColor: "transparent",
                        }
                      : {}),
                  }}
                />
              </Link>
              <ImageButton
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-pressed={menuOpen}
                size="lg"
                variant={darkGhost ? "ghost" : "filled"}
                shape="pill"
                style={{
                  width: fluidUnit(58, 58 * 0.8),
                  height: fluidUnit(58, 58 * 0.8),
                  ...(darkGhost
                    ? {
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.9)",
                        color: "#fff",
                      }
                    : {}),
                }}
                icon={
                  menuOpen
                    ? {
                        size: "lg",
                        alt: "Close",
                        children: (
                          <svg
                            width="36"
                            height="36"
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
                        size: "lg",

                        alt: "Menu",
                        // White outlined hamburger for dark ghost mode
                        children: (
                          <svg
                            width="36"
                            height="36"
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
                    : {
                        size: "lg",
                        variant: "menu",
                      }
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
