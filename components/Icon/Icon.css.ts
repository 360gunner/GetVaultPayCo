import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const size = styleVariants({
  xs: { width: 16, height: 16 },
  sm: { width: 20, height: 20 },
  md: { width: 24, height: 24 },
  lg: { width: 32, height: 32 },
  xl: { width: 40, height: 40 },
});

export const tone = styleVariants({
  default: { color: vars.color.foreground },
  muted: { color: vars.color.muted },
  primary: { color: vars.color.primary },
});

export const shape = styleVariants({
  none: {},
  rounded: { borderRadius: 8, background: 'transparent' },
  pill: { borderRadius: 9999, background: 'transparent' },
  soft: { borderRadius: 8, background: 'rgba(0,0,0,0.04)' },
});
