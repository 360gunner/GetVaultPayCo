import { style, styleVariants, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const wave = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' },
});

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
    background: vars.color.vaultWhite,
    color: vars.color.vaultBlack,
    border: `2px solid ${vars.color.vaultBlack}`,
    borderRadius: 8,
    padding: '8px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    selectors: {
      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#06FF89',
        transform: 'scaleY(0)',
        transformOrigin: 'bottom',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: -1,
        borderRadius: 8,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '-100%',
        width: '200%',
        height: '100%',
        opacity: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
        transform: 'scaleY(0)',
        transformOrigin: 'bottom',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        zIndex: -1,
        borderRadius: 8,
      },
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 20px rgba(6, 255, 137, 0.3)',
      },
      '&:hover::before': {
        transform: 'scaleY(1)',
      },
      '&:hover::after': {
        transform: 'scaleY(1)',
        opacity: 1,
        animation: `${wave} 2s ease-in-out infinite`,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
  },
});
