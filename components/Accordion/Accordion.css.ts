import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const root = style({
  width: "100%",
});

export const item = style({
  borderTop: "1px solid rgba(0,0,0,0.08)",
  display: "grid",
  gridTemplateColumns: "1fr 0.8fr auto",
  columnGap: vars.space.lg,
  alignItems: "center",
  padding: "8px 0",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  background: "transparent",
  border: "none",
  padding: "12px 0",
  cursor: "pointer",
  color: vars.color.foreground,
  fontSize: 28,
  gridColumn: "1",
});

export const chevron = style({
  transition: "transform 150ms ease",
});

export const chevronOpen = style({
  transform: "none",
});

export const panel = style({
  padding: "12px 12px 16px",
  color: vars.color.muted,
  fontSize: 16,
  gridColumn: "2",
});

export const icon = style({
  gridColumn: "3",
  justifySelf: "end",
  alignSelf: "center",
  padding: "12px 0",
});
