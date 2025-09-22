import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const root = style({
  backgroundColor: vars.color.vaultNavie,
  color: vars.color.vaultWhite,
});

export const inner = style({
  paddingTop: 80,
  paddingBottom: 40,
});

export const columns = style({
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gap: 24,
  "@media": {
    "screen and (max-width: 960px)": {
      gridTemplateColumns: "1fr",
      rowGap: 24,
    },
  },
});

export const logo = style({
  marginBottom: 16,
});

export const muted = style({
  color: vars.color.slateGray,
});

export const sectionTitle = style({
  marginBottom: 12,
  fontWeight: 700,
  color: vars.color.slateGray,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const linksRow = style({
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  gap: 12,
});

export const bottom = style({
  borderTop: `1px solid rgba(255,255,255,0.08)`,
  marginTop: 24,
  paddingTop: 16,
  fontSize: 12,
  color: vars.color.cloudSilver,
});

export const topRule = style({
  height: 1,
  background: "#fff",
  marginBottom: 32,
  marginTop: 8,
});
