import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const root = style({
  position: "relative",
  width: "100%",
  background: vars.color.background,
  minHeight: 72,
});

export const inner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 72,
});

export const left = style({
  display: "flex",
  alignItems: "center",
  paddingLeft: vars.space.xl,
  gap: 12,
});

export const right = style({
  display: "flex",
  alignItems: "center",
  paddingRight: vars.space.xl,
  gap: 12,
});

export const bgShape = style({
  position: "absolute",
  inset: 0,
  height: "100%",
  width: "100%",
  pointerEvents: "none",
  overflow: "hidden",
  // allow content to sit above
  zIndex: 0,
});

export const content = style({
  position: "relative",
  zIndex: 1,
});
