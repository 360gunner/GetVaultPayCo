import { createTheme, createThemeContract } from "@vanilla-extract/css";

export const vars = createThemeContract({
  color: {
    foreground: null,
    background: null,
    primary: null,
    muted: null,
    vpGreen: "#B8FF9F",
    neonMint: "#06FF89",
    utilityOlive: "#697B66",
    signalBlue: "#0100FE",
    vaultNavie: "#07232F",
    vaultBlack: "#000000",
    vaultWhite: "#FFFFFF",
    cloudSilver: "#DBE2EA",
    slateGray: "#9CA9B9",
    plumCurrent: "#5C023D",
    digitalLilac: "#DEC5E2",
    footerGray: "#686A6C",
  },
  font: {
    body: "var(--font-instrument-sans)",
  },
  gradients: {
    vpGradient:
      "linear-gradient(45deg, #06FF89 11.42%, #4DFF91 37.59%, #99FF9B 67.99%, #B8FF9F 82.13%)",
  },
  space: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "12px",
    xxl: "24px",
    xxxl: "32px",
    "4xl": "48px",
    "5xl": "64px",
  },
  radius: {
    pill: null,
  },
});

export const themeClass = createTheme(vars, {
  color: {
    foreground: "#111",
    background: "#ffffff",
    primary: "#000000",
    muted: "#333333",
    vpGreen: "#B8FF9F",
    neonMint: "#06FF89",
    utilityOlive: "#697B66",
    signalBlue: "#0100FE",
    vaultNavie: "#07232F",
    vaultBlack: "#000000",
    vaultWhite: "#FFFFFF",
    cloudSilver: "#DBE2EA",
    slateGray: "#9CA9B9",
    plumCurrent: "#5C023D",
    digitalLilac: "#DEC5E2",
    footerGray: "#686A6C",
  },
  gradients: {
    vpGradient:
      "linear-gradient(45deg, #06FF89 11.42%, #4DFF91 37.59%, #99FF9B 67.99%, #B8FF9F 82.13%)",
  },
  font: {
    body: "var(--font-instrument-sans)",
  },
  space: {
    xs: "8px",
    sm: "10px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "24px",
    xxxl: "32px",
    "4xl": "48px",
    "5xl": "64px",
  },
  radius: {
    pill: "3em",
  },
});
