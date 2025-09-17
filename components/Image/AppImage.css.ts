import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({
  display: 'inline-block',
  overflow: 'hidden',
});

export const shape = styleVariants({
  square: { borderRadius: 0 },
  rounded: { borderRadius: 12 },
  circle: { borderRadius: '9999px' },
});
