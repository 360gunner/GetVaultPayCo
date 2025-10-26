import { keyframes, style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";

const slideDown = keyframes({
  from: { 
    opacity: 0,
    transform: 'translateY(-100%)',
  },
  to: { 
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const slideUp = keyframes({
  from: { 
    opacity: 1,
    transform: 'translateY(0)',
  },
  to: { 
    opacity: 0,
    transform: 'translateY(-100%)',
  },
});

const fadeInContent = keyframes({
  from: { 
    opacity: 0,
    transform: 'translateY(20px)',
  },
  to: { 
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 899,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  // Reserve space for the navbar so it acts as the top bar of the mega menu
  paddingTop: 88,
  paddingRight: 0,
  background: vars.gradients.vpGradient,
  backdropFilter: "blur(6px)",
  overflow: "auto",
  willChange: "opacity, transform",
  selectors: {
    '&[data-state="open"]': { animation: `${slideDown} 400ms cubic-bezier(0.16, 1, 0.3, 1) both` },
    '&[data-state="closed"]': {
      animation: `${slideUp} 300ms cubic-bezier(0.16, 1, 0.3, 1) both`,
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
  gap: 16,
  columnGap: 64,
  padding: `${vars.space.lg}`,
  paddingTop: 0,
  paddingBottom: 0,
  overflow: "visible",
  opacity: 0,
  animation: `${fadeInContent} 500ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both`,
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
  // make max width of cards 300 px in gridTemplateColumns
  gridTemplateColumns: "repeat(2, minmax(0,300px))",
  // set horizontal and vertical gap
  columnGap: -12,

  //center stuff
  rowGap: 10,
  justifyContent: "center",
  // alignItems: "center",

  // "@media": {
  //   "screen and (max-width: 520px)": {

  //     gridTemplateColumns: "1fr",
  //   },
  // },
});

export const actionCard = style({
  position: "relative",
  background: "transparent",
  color: vars.color.vaultWhite,
  cursor: "pointer",
  padding: vars.space.xl,
  minHeight: 96,
  aspectRatio: "300 / 154",
  overflow: "hidden",
  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
  ":hover": {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  },
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
  transition: "color 0.3s ease",
  selectors: {
    [`${actionCard}:hover &`]: {
      color: vars.color.neonMint,
    },
  },
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
  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  selectors: {
    [`${actionCard}:hover &`]: {
      transform: "rotate(12deg) scale(1.1)",
    },
  },
});

export const navCols = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
  rowGap: 8,
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
  gap: 4,
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
  transition: "transform 0.2s ease, padding-left 0.2s ease",
  ":hover": {
    transform: "translateX(4px)",
    paddingLeft: "8px",
  },
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
  transition: "transform 0.2s ease",
  selectors: {
    [`${navItem}:hover &`]: {
      transform: "translateX(4px)",
    },
  },
});

export const bottomBanner = style({
  position: "relative",
  width: "100%",
  borderRadius: fluidUnit(16),
  overflow: "hidden",
  opacity: 0,
  animation: `${fadeInContent} 500ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both`,
});

export const bannerOverlay = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: fluidUnit(24),
});

export const bannerContent = style({
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: fluidUnit(12),
  textAlign: "center",
  color: "#fff",
});

export const bannerTitle = style({
  fontSize: fluidUnit(76),
  lineHeight: 1,
  fontWeight: 800,
  marginBottom: 0,
  textShadow: "0 4px 16.7px rgba(0, 0, 0, 0.69)",
});
