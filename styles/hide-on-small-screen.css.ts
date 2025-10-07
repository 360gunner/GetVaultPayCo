import { style } from "@vanilla-extract/css";

export const hideOnSmallScreen = style({
  "@media": {
    "(max-width: 550px)": {
      display: "none",
    },
  },
});
