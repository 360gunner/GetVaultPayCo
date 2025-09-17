import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
});

export const gap = styleVariants({
  none: { gap: 0 },
  xs: { gap: 4 },
  sm: { gap: 8 },
  md: { gap: 12 },
  lg: { gap: 16 },
  xl: { gap: 24 },
});

export const align = styleVariants({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  stretch: { alignItems: 'stretch' },
});

export const justify = styleVariants({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
});
