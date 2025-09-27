import { style, styleVariants } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
});

export const gap = styleVariants({
  none: { gap: 0 },
  xs: { gap: 4 },
  sm: { gap: 8 },
  md: { gap: 12 },
  lg: { gap: 16 },
  xl: { gap: 24 },
  xxl: { gap: 32 },
  xxxl: { gap: 48 },
  "4xl": { gap: 64 },
  "5xl": { gap: 80 },
});
