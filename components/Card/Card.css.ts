import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const root = style({
  background: vars.color.background,
  borderRadius: 12,
  padding: 16,
  transition: 'box-shadow 120ms ease, transform 120ms ease',
});

export const variant = styleVariants({
  plain: { boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)' },
  elevated: { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  outline: { boxShadow: 'none', border: '1px solid rgba(0,0,0,0.12)' },
});

export const shape = styleVariants({
  square: { borderRadius: 0 },
  rounded: { borderRadius: 12 },
  pill: { borderRadius: 20 },
});

export const interactive = style({
  selectors: {
    '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' },
    '&:active': { transform: 'translateY(0)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  },
});

export const header = style({
  marginBottom: 8,
});

export const footer = style({
  marginTop: 12,
});

export const illustration = style({
  width: '100%',
  overflow: 'hidden',
  borderRadius: 8,
  marginBottom: 12,
});
