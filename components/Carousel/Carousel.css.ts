import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
});

export const track = style({
  display: 'flex',
  transition: 'transform 400ms ease',
  willChange: 'transform',
});

export const slide = style({
  flex: '0 0 100%',
  position: 'relative',
});

export const controls = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  pointerEvents: 'none',
});

export const controlBtn = style({
  pointerEvents: 'auto',
  background: 'rgba(0,0,0,0.4)',
  color: '#fff',
  border: 'none',
  borderRadius: 9999,
  width: 36,
  height: 36,
  display: 'grid',
  placeItems: 'center',
  margin: 8,
  cursor: 'pointer',
});

export const dots = style({
  position: 'absolute',
  left: '50%',
  bottom: 8,
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 8,
});

export const dot = styleVariants({
  off: { width: 8, height: 8, borderRadius: 9999, background: 'rgba(0,0,0,0.3)' },
  on: { width: 8, height: 8, borderRadius: 9999, background: 'rgba(0,0,0,0.8)' },
});
