/**
 * Responsive font utility
 *
 * Returns a CSS clamp() expression that linearly scales the font size with
 * viewport width between the provided breakpoints, while preserving a minimum
 * and maximum font size.
 *
 * Formula:
 *   clamp(min, calc(intercept + slope * 100vw), max)
 * where
 *   slope = (max - min) / (maxWidth - minWidth)
 *   intercept = min - slope * minWidth
 *
 * Usage examples:
 *   fluidUnit(60)                    // max 60px at 1280px, min derived at 600px
 *   fluidUnit(60, 42)                // max 60px, min 42px between 600px–1280px
 *   fluidUnit(60, 42, 480, 1440)     // custom breakpoints
 */
export const fluidUnit = (
  maxPx: number,
  minPx?: number,
  minWidth = 500,
  maxWidth = 1280
): string => {
  const min_multiplier = 0.75;
  const _minPx =
    typeof minPx === "number" && !Number.isNaN(minPx)
      ? minPx
      : Math.max(0, Math.round((maxPx * minWidth * min_multiplier) / maxWidth));

  // Guard rails
  const _maxPx = Math.max(_minPx, maxPx);
  const _minWidth = Math.min(minWidth, maxWidth);
  const _maxWidth = Math.max(minWidth, maxWidth);

  const slope = (_maxPx - _minPx) / (_maxWidth - _minWidth); // px per px of width
  const intercept = _minPx - slope * _minWidth; // px

  // Build CSS string. 1vw equals 1% of viewport width, so multiply slope by 100.
  const fluid = `calc(${intercept.toFixed(4)}px + ${(slope * 100).toFixed(
    6
  )}vw)`;
  return `clamp(${_minPx}px, ${fluid}, ${_maxPx}px)`;
};

export const windowScaledUnit = (
  px: number,
  minWidth = 500,
  maxWidth = 1280
): number => {
  return Math.max(0, Math.round((px * minWidth) / maxWidth));
};
