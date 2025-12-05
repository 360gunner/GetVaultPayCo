import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

const baseAnimation = {
  opacity: 0,
  willChange: 'opacity, transform',
  transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
  selectors: {
    '&.visible': {
      opacity: 1,
      transform: 'none',
    },
  },
};

export const fadeIn = style({
  ...baseAnimation,
  transform: 'translateY(20px)',
  selectors: {
    ...baseAnimation.selectors,
    '&.visible': {
      ...baseAnimation.selectors['&.visible'],
      transform: 'translateY(0)',
    },
  },
});

export const fadeInUp = style({
  ...baseAnimation,
  transform: 'translateY(30px)',
  selectors: {
    ...baseAnimation.selectors,
    '&.visible': {
      ...baseAnimation.selectors['&.visible'],
      transform: 'translateY(0)',
    },
  },
});

export const fadeInLeft = style({
  ...baseAnimation,
  transform: 'translateX(-30px)',
  selectors: {
    ...baseAnimation.selectors,
    '&.visible': {
      ...baseAnimation.selectors['&.visible'],
      transform: 'translateX(0)',
    },
  },
});

export const fadeInRight = style({
  ...baseAnimation,
  transform: 'translateX(30px)',
  selectors: {
    ...baseAnimation.selectors,
    '&.visible': {
      ...baseAnimation.selectors['&.visible'],
      transform: 'translateX(0)',
    },
  },
});

export const fadeInScale = style({
  ...baseAnimation,
  transform: 'scale(0.95)',
  selectors: {
    ...baseAnimation.selectors,
    '&.visible': {
      ...baseAnimation.selectors['&.visible'],
      transform: 'scale(1)',
    },
  },
});
