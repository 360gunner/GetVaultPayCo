import { vars } from "@/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

export const root = style({
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  width: "100%",
});

export const size = styleVariants({
  sm: { maxWidth: 640 },
  md: { maxWidth: 768 },
  lg: { maxWidth: 1024 },
  xl: { maxWidth: 1280 },
  "2xl": { maxWidth: 1920 },
  full: { maxWidth: "100%" },
});
