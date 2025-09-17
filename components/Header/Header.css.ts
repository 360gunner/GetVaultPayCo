import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const headerRoot = style({
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 20px',
  fontFamily: vars.font.body,
});

export const brand = style({
  selectors: {
    '& svg': {
      display: 'inline-block',
      verticalAlign: 'top',
    },
    '& h1': {
      display: 'inline-block',
      verticalAlign: 'top',
      margin: '6px 0 6px 10px',
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: 1,
    },
  },
});

export const actions = style({
  selectors: {
    '& button + button': {
      marginLeft: '10px',
    },
  },
});

export const welcome = style({
  marginRight: '10px',
  color: vars.color.muted,
  fontSize: '14px',
});
