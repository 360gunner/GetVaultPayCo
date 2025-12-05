import { keyframes, style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";

// Menu slides down from top
const slideDown = keyframes({
  from: { 
    transform: "translateY(-100%)",
    opacity: 0,
  },
  to: { 
    transform: "translateY(0)",
    opacity: 1,
  },
});

const slideUp = keyframes({
  from: { 
    transform: "translateY(0)",
    opacity: 1,
  },
  to: { 
    transform: "translateY(-100%)",
    opacity: 0,
  },
});

// Content fades in after menu drops
const contentFadeIn = keyframes({
  from: { 
    opacity: 0,
    transform: "translateY(-20px)",
  },
  to: { 
    opacity: 1,
    transform: "translateY(0)",
  },
});

const contentFadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 899,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  // Reserve space for the navbar so it acts as the top bar of the mega menu
  paddingTop: 80,
  paddingRight: 0,
  background: vars.gradients.vpGradient,
  backdropFilter: "blur(6px)",
  overflow: "hidden",
  willChange: "transform, opacity",
  selectors: {
    '&[data-state="open"]': { 
      animation: `${slideDown} 350ms cubic-bezier(0.16, 1, 0.3, 1) both`,
    },
    '&[data-state="closed"]': {
      animation: `${slideUp} 280ms ease-in both`,
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
  gridTemplateColumns: "0.7fr 1fr",
  gap: 8,
  columnGap: 32,
  padding: `${vars.space.lg}`,
  paddingTop: 0,
  paddingBottom: 0,
  flex: "0 0 auto",
  overflow: "visible",
  // Content fades in after menu slides down
  opacity: 0,
  animation: `${contentFadeIn} 400ms ease-out 200ms forwards`,
  "@media": {
    "screen and (max-width: 1024px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

// Hide scrollbars for WebKit browsers
globalStyle(`${content}::-webkit-scrollbar`, {
  display: "none",
});

export const cardsGrid = style({
  display: "grid",
  // make max width of cards smaller to fit
  gridTemplateColumns: "repeat(2, minmax(0, 240px))",
  columnGap: -20,
  rowGap: 4,
  justifyContent: "center",
});

export const actionCard = style({
  position: "relative",
  background: "transparent",
  color: vars.color.vaultWhite,
  cursor: "pointer",
  padding: vars.space.lg,
  minHeight: 70,
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
  paddingBottom: 0,
  fontWeight: 400,
  fontSize: 18,
  maxWidth: "90%",
});

export const actionIconTopRight = style({
  position: "absolute",
  right: 12,
  top: 12,
  width: 20,
  height: 20,
  borderRadius: 10,
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
});

export const navCols = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
  rowGap: 4,
  columnGap: 16,
  "@media": {
    "screen and (max-width: 720px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const navGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginBottom: 0,
});

export const navTitle = style({
  fontWeight: 700,
});

export const navItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "2px 0",
  paddingRight: vars.space["4xl"],
  borderBottom: "none",
  cursor: "pointer",
});

export const navItemText = style({
  color: vars.color.vaultBlack,
  fontWeight: 400,
  marginBottom: 0,
});

export const navItemArrow = style({
  color: vars.color.vaultBlack,
  fontSize: 20,
  marginBottom: 0,
});

export const bottomBannerWrapper = style({
  marginLeft: "3%",
  marginRight: "3%",
  marginTop: 16,
  paddingBottom: 12,
  // Banner fades in with slight delay after content
  opacity: 0,
  animation: `${contentFadeIn} 400ms ease-out 350ms forwards`,
});

export const bottomBanner = style({
  position: "relative",
  width: "100%",
  aspectRatio: "1360 / 200",
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

export const bannerContent = style({
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  // padding: " 0 16px",
  gap: 12,
});

export const bannerTitle = style({
  fontSize: fluidUnit(76),
  lineHeight: 1,
  fontWeight: 800,
  marginBottom: 0,
  textShadow: "0 4px 16.7px rgba(0, 0, 0, 0.69)",
});
