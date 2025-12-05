import { keyframes, style, styleVariants } from "@vanilla-extract/css";

// Shared fade-in keyframes
export const fadeIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(20px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(40px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const fadeInScale = keyframes({
  from: {
    opacity: 0,
    transform: "scale(0.95)",
  },
  to: {
    opacity: 1,
    transform: "scale(1)",
  },
});

// Base animation style
const baseAnimation = style({
  opacity: 0,
  willChange: "opacity, transform",
});

// Visible state when animation triggers
export const fadeInVisible = style({
  animation: `${fadeIn} 600ms ease-out forwards`,
});

export const fadeInUpVisible = style({
  animation: `${fadeInUp} 700ms ease-out forwards`,
});

export const fadeInScaleVisible = style({
  animation: `${fadeInScale} 500ms ease-out forwards`,
});

// Combined hidden states (initial)
export const fadeInHidden = style({
  opacity: 0,
  transform: "translateY(20px)",
});

export const fadeInUpHidden = style({
  opacity: 0,
  transform: "translateY(40px)",
});

export const fadeInScaleHidden = style({
  opacity: 0,
  transform: "scale(0.95)",
});

// Stagger delay variants for child elements
export const staggerDelay = styleVariants({
  0: { animationDelay: "0ms" },
  1: { animationDelay: "100ms" },
  2: { animationDelay: "200ms" },
  3: { animationDelay: "300ms" },
  4: { animationDelay: "400ms" },
  5: { animationDelay: "500ms" },
});
