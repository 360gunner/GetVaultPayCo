import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const base = style({
  color: vars.color.foreground,
  fontFamily: vars.font.body,
  margin: 0,
});

export const asStyles = styleVariants({
  h1: {
    fontSize: "48px",
    lineHeight: "1.1",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: "0.5em",
  },
  h2: {
    fontSize: "36px",
    lineHeight: "1.15",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    marginBottom: "0.5em",
  },
  h3: {
    fontSize: "28px",
    lineHeight: "1.2",
    fontWeight: 700,
    marginBottom: "0.5em",
  },
  h4: {
    fontSize: "22px",
    lineHeight: "1.3",
    fontWeight: 700,
    marginBottom: "0.5em",
  },
  h5: {
    fontSize: "18px",
    lineHeight: "1.35",
    fontWeight: 600,
    marginBottom: "0.5em",
  },
  h6: {
    fontSize: "16px",
    lineHeight: "1.4",
    fontWeight: 600,
    marginBottom: "0.5em",
  },
  p: {
    fontSize: "14px",
    lineHeight: "24px",
    marginBottom: "1em",
    color: vars.color.muted,
  },
  span: {
    fontSize: "14px",
    lineHeight: "24px",
    marginBottom: "1em",
    color: "inherit",
  },
});

export const fontStyles = styleVariants({
  "Space Grotesk": {
    fontFamily:
      "'Space Grotesk', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  "Instrument Sans": {
    fontFamily:
      "'Instrument Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
});
