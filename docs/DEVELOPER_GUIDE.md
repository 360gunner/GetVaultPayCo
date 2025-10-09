# VaultPay Developer Guide

A concise, practical guide to work effectively in the VaultPay codebase.

## 1. Quick Start
- Install: `npm install`
- Dev: `npm run dev` → http://localhost:3000
- Build: `npm run build`
- Start (prod build): `npm run start`
- Lint: `npm run lint`

## 2. Tech Stack
- Next.js 15 (App Router) + TypeScript (strict)
- Styling: vanilla-extract theme + Tailwind CSS v4 utilities (via PostCSS)
- Fonts: `Space_Grotesk`, `Instrument_Sans` via `next/font/google`
- Linting: ESLint flat config (`eslint.config.mjs`)
- Testing: Vitest configured (no sample tests yet)

## 3. Project Structure
- `app/` routes (App Router). `app/layout.tsx` provides fonts, theme, and viewport.
- `components/` shared UI primitives and `sections/` (page building blocks)
- `styles/` theme and utilities
- `hooks/` shared hooks (e.g., viewport units sync)
- `public/` static assets
- Root configs: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`

## 4. Styling System
- Theme in `styles/theme.css.ts`
  - Contract `vars` and `themeClass` applied on `<body>` in `app/layout.tsx`
- Utilities
  - `styles/fluid-unit.ts`: `fluidUnit()` returns `clamp()` with `var(--vw)` for responsive sizing
  - `styles/hide-on-small-screen.css.ts`: hide elements below 550px
  - `components/ViewportUnitsUpdater.tsx` + `hooks/use-viewport-units.ts`: keep `--vw`/`--vh` accurate
- Tailwind v4 utilities are available for layout and quick tweaks

## 5. Conventions
- Use TypeScript everywhere; explicit prop types/interfaces for components
- Prefer composition of primitives into `components/sections/*`
- Use theme tokens from `styles/theme.css.ts` instead of hard-coded values
- Keep imports ordered: libs → next → components → styles/assets
- Named exports preferred for components

## 6. Environment & Config Notes
- Versions: Next 15.5.3, React 19.1.0, TS ^5, ESLint ^9, Tailwind ^4
- `next.config.ts` wraps with `@vanilla-extract/next-plugin`; ESLint is ignored during builds
- Env vars: none required. Add to `.env.local`; expose to browser with `NEXT_PUBLIC_*`
- Viewport: `app/layout.tsx` sets a fixed viewport (1440x900, scaling). Validate this matches your target devices

## 7. Common Tasks
- Add a route: create `app/<route>/page.tsx` and compose sections
- Add a section: create `components/sections/MySection.tsx` with typed props and theme tokens
- Theming: adjust tokens in `styles/theme.css.ts`

## 8. Scripts
- `dev`, `build`, `start`, `lint` in `package.json`

## 9. Troubleshooting
- Responsive text off? Ensure `ViewportUnitsUpdater` is mounted and `--vw` updates
- Styles missing? Ensure vanilla-extract classes are imported and `themeClass` wraps `<body>`
- Tailwind utilities missing? Check `@tailwindcss/postcss` plugin in `postcss.config.mjs`

## 10. Fluid Design Deep Dive

This project implements fluid sizing using custom viewport CSS variables and a utility that returns `clamp()` expressions.

For a complete walkthrough with code snippets and guidance, see `docs/FLUID_DESIGN.md`.

- **Viewport variables provider**
  - `components/ViewportUnitsUpdater.tsx` mounts a client component that calls `useViewportUnits()` on the client.
  - `hooks/use-viewport-units.ts` computes and sets:
    - `--vw` = `window.innerWidth * 0.01` in px
    - `--vh` = `window.innerHeight * 0.01` in px
    - On very small widths (`< 450px`), width is coerced to `1440` to preserve a desktop baseline scale on tiny screens:
      ```ts
      if (width < 450) width = 1440; // DEFAULT_VIEWPORT_WIDTH
      ```
    - Updates are scheduled with `requestAnimationFrame` and react to `resize`, `orientationchange`, `pageshow`, and `visualViewport` events when available.

- **Viewport meta**
  - `app/layout.tsx` exports `viewport` with a fixed width/height and scaling:
    - `width: "1440"`, `height: "900"`, `initialScale: 0.2`, `minimumScale: 0.2`, `maximumScale: 1.2`.
    - This pairs with the coerced width in the hook to keep a consistent design baseline that scales.
    - If you want fully responsive behavior, consider switching to the default responsive meta and removing the width coercion.

- **Fluid unit utility** (`styles/fluid-unit.ts`)
  - `fluidUnit(maxPx, minPx?, minWidth=500, maxWidth=1280)` returns a CSS string:
    ```css
    clamp(minPx, calc(intercept + slope * var(--vw)), maxPx)
    ```
    where `slope = (max - min) / (maxWidth - minWidth)` and `intercept = min - slope * minWidth`.
  - It builds the inner `calc()` using `var(--vw)` so sizes scale linearly with the viewport variable you control.
  - If `minPx` is omitted, it derives a minimum from `maxPx` and `minWidth` (`~75%` of proportional scale) with guard-rails to keep `minPx <= maxPx`.
  - `windowScaledUnit(px, minWidth=500, maxWidth=1280)` returns a number scaled to `minWidth` as a simple fallback/measurement helper.

- **Usage patterns**
  - Font sizes: `style={{ fontSize: fluidUnit(40) }}`
  - Spacing: `gap: fluidUnit(16)`, `padding: fluidUnit(24)`
  - Radii: `borderRadius: fluidUnit(30)`
  - Constraining widths/heights with the custom vw: e.g. `maxWidth: "calc(100 * var(--vw))"`

- **Design implications**
  - By coercing widths below 450px to 1440, very small screens render with a desktop scale rather than shrinking further. This helps preserve visual proportions but may require additional tweaks for touch targets and readability.
  - The fixed `viewport` export in `app/layout.tsx` can affect zoom and pinch behavior; validate against target devices.

- **Modifying behavior**
  - To make the app fully responsive:
    - Remove or adjust the width coercion in `use-viewport-units.ts`.
    - Use a standard responsive meta in `app/layout.tsx` or remove custom `viewport` export.
    - Re-tune `minWidth`/`maxWidth` defaults in `fluidUnit()` or per-usage for desired scaling ranges.
