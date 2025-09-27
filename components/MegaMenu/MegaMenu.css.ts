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
  gridTemplateColumns: "1fr 1fr",
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
  padding: vars.space.xl,
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
  padding: `${vars.space.sm} ${vars.space.xxxl}`,
  left: 0,
  bottom: 0,
  fontWeight: 400,
  fontSize: 20,
  maxWidth: "80%",
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
  gap: 8,
  "@media": {
    "screen and (max-width: 720px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const navGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginBottom: 0,
});

export const navTitle = style({
  fontWeight: 700,
  fontSize: 14,
});

export const navItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "2px 0",
  borderBottom: "none",
});

export const navItemText = style({
  fontSize: 13,
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
  // Push content to the bottom of the image (cross-axis in a row)
  alignItems: "flex-end",
  // Keep content starting from the left; inner row will handle spacing
  justifyContent: "flex-start",
  gap: 12,
  color: vars.color.vaultWhite,
  textAlign: "left",
  padding: 16,
});

export const bannerRow = style({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  width: "100%",
  gap: 12,
});

export const bannerTitle = style({
  fontSize: 36,
  lineHeight: 1,
  fontWeight: 800,
});
