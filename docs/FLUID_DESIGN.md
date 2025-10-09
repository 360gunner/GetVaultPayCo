# Fluid Design Deep Dive

This document explains how fluid sizing works in the codebase and how to use or modify it.

## Overview
- **Goal**: Achieve predictable, linear scaling of sizes with the viewport while preserving design proportions.
- **Core pieces**:
  - `hooks/use-viewport-units.ts` sets CSS variables `--vw` and `--vh` in pixels.
  - `components/ViewportUnitsUpdater.tsx` mounts the hook on the client.
  - `styles/fluid-unit.ts` provides `fluidUnit()` that returns a CSS `clamp()` using `var(--vw)`.
  - `app/layout.tsx` exports a fixed `viewport` to pair with the scaling approach.

## Viewport Units Provider
- File: `hooks/use-viewport-units.ts`
- On mount and on key viewport events, it computes:
  - `--vw = window.innerWidth * 0.01` (in px)
  - `--vh = window.innerHeight * 0.01` (in px)
- Behavior for very small screens:
  - If `window.innerWidth < 450`, width is coerced to `1440` (desktop baseline) prior to computing `--vw`.
- Events listened to: `resize`, `orientationchange`, `pageshow`, and `visualViewport` `resize`/`scroll` when supported.
- Updates scheduled with `requestAnimationFrame` to avoid layout thrash.
- Mounted via `components/ViewportUnitsUpdater.tsx` and included in `app/layout.tsx` body.

## Fixed Viewport Meta
- File: `app/layout.tsx`
- Exports `viewport` with:
  - `width: "1440"`, `height: "900"`, `initialScale: 0.2`, `minimumScale: 0.2`, `maximumScale: 1.2`.
- Intent: keep a consistent design baseline that can scale rather than shrink below a target width.
- Considerations:
  - Verify behavior on target devices. Fixed viewport can affect zoom and natural responsiveness.

## Fluid Unit Utility
- File: `styles/fluid-unit.ts`

```ts
export const fluidUnit = (
  maxPx: number,
  minPx?: number,
  minWidth = 500,
  maxWidth = 1280
): string => {
  const min_multiplier = 0.75;
  const _minPx = typeof minPx === "number" && !Number.isNaN(minPx)
    ? minPx
    : Math.max(0, Math.round((maxPx * minWidth * min_multiplier) / maxWidth));

  const _maxPx = Math.max(_minPx, maxPx);
  const _minWidth = Math.min(minWidth, maxWidth);
  const _maxWidth = Math.max(minWidth, maxWidth);

  const slope = (_maxPx - _minPx) / (_maxWidth - _minWidth);
  const intercept = _minPx - slope * _minWidth;

  const fluid = `calc(${intercept.toFixed(4)}px + ${(slope * 100).toFixed(6)}  * var(--vw))`;
  return `clamp(${_minPx}px, ${fluid}, ${_maxPx}px)`;
};
```

- Math:
  - `slope = (max - min) / (maxWidth - minWidth)` (px per px of width)
  - `intercept = min - slope * minWidth` (px)
  - Result: `clamp(min, calc(intercept + slope * 100vw-equivalent), max)` but driven by custom `--vw`.
- Defaults:
  - If `minPx` not provided, a proportional default (~75%) is derived and guard-railed.
- Companion helper:
  - `windowScaledUnit(px, minWidth=500, maxWidth=1280)` → number scaled to `minWidth`.

## Usage Patterns
- Typography
  ```tsx
  <h1 style={{ fontSize: fluidUnit(60, 42) }}>Title</h1>
  ```
- Spacing / Layout
  ```tsx
  <div style={{ gap: fluidUnit(16), padding: fluidUnit(24) }} />
  ```
- Shapes / Radius
  ```tsx
  <div style={{ borderRadius: fluidUnit(30) }} />
  ```
- Constraints
  ```tsx
  <div style={{ maxWidth: "calc(100 * var(--vw))" }} />
  ```

See real examples in `app/page.tsx` and `components/sections/*`.

## Design Implications
- The width coercion (<450px → 1440) maintains desktop-like proportions on tiny screens, reducing layout collapse.
- Trade-offs:
  - May reduce native responsiveness on very small devices.
  - Touch target sizes and readability still require careful checks.
- The fixed viewport export influences pinch/zoom and scaling behavior.

## Modifying the Behavior
- For conventional responsiveness:
  1. Remove or relax width coercion in `use-viewport-units.ts`.
  2. Remove the fixed `viewport` export in `app/layout.tsx` or switch to the default responsive meta.
  3. Adjust `minWidth`/`maxWidth` defaults in `fluidUnit()` to match your target breakpoints.
- For performance/noise:
  - Remove the `console.log("CalculateAndSet")` in `use-viewport-units.ts` for production builds.

## Checklist When Adding New UI
- Use `fluidUnit()` for font sizes, spacing, and radii where proportional scaling is desired.
- Prefer theme tokens from `styles/theme.css.ts` for colors and consistent spacing.
- Ensure `ViewportUnitsUpdater` is mounted (already in `app/layout.tsx`).
- Validate on small devices for readability and interaction.
