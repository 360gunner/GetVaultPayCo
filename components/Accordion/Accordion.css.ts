import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const root = style({
  width: '100%',
});

export const item = style({
  borderBottom: '1px solid rgba(0,0,0,0.08)',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: '12px 0',
  cursor: 'pointer',
  color: vars.color.foreground,
});

export const chevron = style({
  transition: 'transform 150ms ease',
});

export const chevronOpen = style({
  transform: 'rotate(180deg)',
});

export const panel = style({
  padding: '8px 0 16px',
  color: vars.color.muted,
});
