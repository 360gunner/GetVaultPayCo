import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  background: 'transparent',
});

export const size = styleVariants({
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
});

export const variant = styleVariants({
  filled: { background: vars.color.primary, color: vars.color.background },
  outline: { boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', background: 'transparent' },
  ghost: { background: 'transparent' },
});

export const shape = styleVariants({
  square: { borderRadius: 8 },
  rounded: { borderRadius: 12 },
  pill: { borderRadius: 9999 },
});
