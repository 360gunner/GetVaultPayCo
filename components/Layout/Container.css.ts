import { vars } from "@/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

export const root = style({
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
  width: "100%",
});

export const size = styleVariants({
  sm: { maxWidth: 640 },
  md: { maxWidth: 768 },
  lg: { maxWidth: 1024 },
  xl: { maxWidth: 1280 },
  full: { maxWidth: "100%" },
});
