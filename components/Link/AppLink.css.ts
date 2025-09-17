import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const base = style({
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 120ms ease, text-decoration-color 120ms ease',
});

export const variant = styleVariants({
  default: {
    color: vars.color.foreground,
    selectors: {
      '&:hover': { textDecoration: 'underline', textDecorationColor: 'currentColor' },
      '&:focus-visible': { outline: '2px solid currentColor', outlineOffset: 2 },
    },
  },
  subtle: {
    color: vars.color.muted,
    selectors: {
      '&:hover': { color: vars.color.foreground, textDecoration: 'underline' },
    },
  },
  primary: {
    color: vars.color.primary,
    selectors: {
      '&:hover': { textDecoration: 'underline' },
    },
  },
  button: {
    background: vars.color.primary,
    color: vars.color.background,
    borderRadius: 8,
    padding: '8px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
});
