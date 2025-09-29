import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const button = style({
  display: "inline-block",
  cursor: "pointer",
  border: 0,
  borderRadius: vars.radius.pill,
  fontWeight: 700,
  lineHeight: 1,
  fontFamily: vars.font.body,
});

export const primary = style({
  backgroundColor: vars.color.vaultBlack,
  color: vars.color.vaultWhite,
});
export const colored = style({
  backgroundColor: vars.color.vaultBlack,
  color: vars.color.vaultBlack,
});

export const secondary = style({
  boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset",
  backgroundColor: "transparent",
  color: vars.color.muted,
});

export const ghost = style({
  backgroundColor: "transparent",
  color: vars.color.vaultBlack,
  border: `1px solid ${vars.color.vaultBlack}`,
  boxShadow: "none",
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
