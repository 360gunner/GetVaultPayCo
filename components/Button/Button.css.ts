import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const wave = keyframes({
  '0%': { 
    transform: 'translateX(-100%)',
  },
  '100%': { 
    transform: 'translateX(100%)',
  },
});

const waterFill = keyframes({
  '0%': {
    transform: 'translateY(100%)',
  },
  '100%': {
    transform: 'translateY(0%)',
  },
});

const waterWave = keyframes({
  '0%': {
    backgroundPosition: '200% 0',
  },
  '100%': {
    backgroundPosition: '-200% 0',
  },
});

export const button = style({
  display: "inline-block",
  cursor: "pointer",
  border: 0,
  borderRadius: vars.radius.pill,
  fontWeight: 700,
  lineHeight: 1,
  fontFamily: vars.font.body,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.2s ease",
  boxShadow: "6px 6px 0px 0px #06FF89",
  "::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: "translateY(100%)",
    transition: "transform 0.35s ease-out",
    zIndex: -1,
    borderRadius: vars.radius.pill,
  },
  "::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    transform: "translateY(100%)",
    transition: "transform 0.35s ease-out, opacity 0.2s ease",
    zIndex: -1,
    borderRadius: vars.radius.pill,
  },
  ":hover": {
    transform: "translate(0px, 0px)",
    boxShadow: "none",
  },
  ":active": {
    transform: "translate(6px, 6px)",
    boxShadow: "0px 0px 0px 0px #06FF89",
  },
  selectors: {
    "&:hover::before": {
      transform: "translateY(0%)",
    },
    "&:hover::after": {
      transform: "translateY(0%)",
      opacity: 0.5,
    },
  },
});

export const primary = style({
  backgroundColor: vars.color.vaultWhite,
  color: vars.color.vaultBlack,
  border: `2px solid ${vars.color.vaultBlack}`,
  "::before": {
    backgroundColor: vars.color.neonMint,
  },
  "::after": {
    background: 'repeating-linear-gradient(90deg, rgba(6, 255, 137, 0.6) 0px, rgba(6, 255, 137, 0.3) 15px, rgba(6, 255, 137, 0.6) 30px)',
    backgroundSize: '200% 100%',
  },
  selectors: {
    "&:hover::after": {
      animation: `${waterWave} 3s linear infinite`,
    },
  },
});

export const colored = style({
  backgroundColor: vars.color.vaultWhite,
  color: vars.color.vaultBlack,
  border: `2px solid ${vars.color.vaultBlack}`,
  "::before": {
    backgroundColor: vars.color.vpGreen,
  },
  "::after": {
    background: 'repeating-linear-gradient(90deg, rgba(184, 255, 159, 0.6) 0px, rgba(184, 255, 159, 0.3) 15px, rgba(184, 255, 159, 0.6) 30px)',
    backgroundSize: '200% 100%',
  },
  selectors: {
    "&:hover::after": {
      animation: `${waterWave} 3s linear infinite`,
    },
  },
});

export const secondary = style({
  backgroundColor: vars.color.vaultWhite,
  color: vars.color.vaultBlack,
  border: `2px solid ${vars.color.vaultBlack}`,
  "::before": {
    backgroundColor: vars.color.neonMint,
  },
  "::after": {
    background: 'repeating-linear-gradient(90deg, rgba(6, 255, 137, 0.6) 0px, rgba(6, 255, 137, 0.3) 15px, rgba(6, 255, 137, 0.6) 30px)',
    backgroundSize: '200% 100%',
  },
  selectors: {
    "&:hover::after": {
      animation: `${waterWave} 3s linear infinite`,
    },
  },
});

export const ghost = style({
  backgroundColor: "transparent",
  color: vars.color.vaultBlack,
  border: `2px solid ${vars.color.vaultBlack}`,
  "::before": {
    backgroundColor: vars.color.vpGreen,
  },
  "::after": {
    background: 'repeating-linear-gradient(90deg, rgba(184, 255, 159, 0.6) 0px, rgba(184, 255, 159, 0.3) 15px, rgba(184, 255, 159, 0.6) 30px)',
    backgroundSize: '200% 100%',
  },
  selectors: {
    "&:hover::after": {
      animation: `${waterWave} 3s linear infinite`,
    },
  },
});

export const small = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: "12px",
});
export const paddingEqual = style({
  padding: `${vars.space.sm} ${vars.space.sm}`,
});

export const medium = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  fontSize: "14px",
});

export const large = style({
  padding: `${vars.space.xl} ${vars.space.xxl}`,
  fontSize: "16px",
});
