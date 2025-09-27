import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  // Reserve space for the navbar so it acts as the top bar of the mega menu
  paddingTop: 72,
  paddingRight: vars.space.xl,
  background: vars.gradients.vpGradient,
  backdropFilter: "blur(6px)",
  overflow: "hidden",
  willChange: "opacity",
  selectors: {
    '&[data-state="open"]': { animation: `${fadeIn} 260ms ease-out both` },
    '&[data-state="closed"]': {
      animation: `${fadeOut} 200ms ease-in both`,
      pointerEvents: "none",
    },
  },
});

export const topBar = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: `${vars.space.md} ${vars.space.lg} 0`,
});

export const topLeft = style({
  display: "flex",
  alignItems: "center",
});

export const pillBtn = style({
  border: `1px solid ${vars.color.vaultBlack}`,
  color: vars.color.vaultBlack,
  background: "transparent",
  borderRadius: 999,
  padding: "10px 16px",
  fontWeight: 600,
  cursor: "pointer",
});

export const closeBtn = style({
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: vars.color.vaultBlack,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: `1px solid ${vars.color.vaultWhite}`,
});

export const content = style({
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: 16,
  padding: `${vars.space.lg}`,
  flex: 1,
  minHeight: 0,
  // Prevent internal scrolling; children must adapt to available space
  overflow: "hidden",
  "@media": {
    "screen and (max-width: 1024px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const cardsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
  gap: 12,
  "@media": {
    "screen and (max-width: 520px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const actionCard = style({
  position: "relative",
  background: "transparent",
  color: vars.color.vaultWhite,
  minHeight: 96,
  aspectRatio: "300 / 154",
  overflow: "hidden",
});

export const actionBg = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});

export const actionLabel = style({
  position: "absolute",
  left: 16,
  bottom: 12,
  fontWeight: 700,
});

export const actionIconTopRight = style({
  position: "absolute",
  right: 12,
  top: 12,
  width: 28,
  height: 28,
  borderRadius: 10,
  background: "rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
});

export const navCols = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
  gap: 12,
  "@media": {
    "screen and (max-width: 720px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const navGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const navTitle = style({
  fontWeight: 700,
});

export const navItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  ":last-child": { borderBottom: "none" },
});

export const bottomBanner = style({
  position: "relative",
  width: "100%",
  height: 160,
  borderRadius: 16,
  overflow: "hidden",
});

export const bannerOverlay = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 12,
  color: vars.color.vaultWhite,
  textAlign: "center",
  padding: 16,
});
