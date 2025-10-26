import { style, styleVariants, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const wave = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' },
});

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  background: 'transparent',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(6, 255, 137, 0.2)',
    transform: 'scaleY(0)',
    transformOrigin: 'bottom',
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    borderRadius: 'inherit',
    zIndex: -1,
  },
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    opacity: 0,
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
    transform: 'scaleY(0)',
    transformOrigin: 'bottom',
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
    zIndex: -1,
    borderRadius: 'inherit',
  },
  ':hover': {
    transform: 'scale(1.1)',
  },
  ':active': {
    transform: 'scale(0.95)',
  },
  selectors: {
    '&:hover::before': {
      transform: 'scaleY(1)',
    },
    '&:hover::after': {
      transform: 'scaleY(1)',
      opacity: 1,
      animation: `${wave} 2s ease-in-out infinite`,
    },
  },
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
