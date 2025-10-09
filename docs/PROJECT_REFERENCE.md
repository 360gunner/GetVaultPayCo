# Project Reference

Concise reference for routes, components, and styling primitives.

## 1. Routes (App Router)
Each folder under `app/` with `page.tsx` maps to a route:
- `/` → `app/page.tsx`
- `/advantages`
- `/borderless-transfers`
- `/business-in-store`
- `/business-online`
- `/business-overview`
- `/cards`
- `/help-center`
- `/manage-your-wallet`
- `/pay-in-store`
- `/pay-online`
- `/privacy`
- `/security-and-protection`
- `/send-and-receive`
- `/signin`
- `/signup`
- `/social`
- `/ways-to-pay`

Notes:
- Nested layouts: add `layout.tsx` inside the route segment.
- Dynamic routes: use `[param]` folder names.

## 2. Components
- `components/*` primitives: `Button/`, `Navbar/`, `Typography/`, `Image/`, etc.
- `components/sections/*` prebuilt sections for landing pages:
  - BigImageBanner, SplitHero, CardGridWithCentralImageSection, FeatureGridSection,
    BigImageOverlaySection, GrayShapeBackgroundGridSection, StepsWithImageSection,
    BorderlessFeatureSection, BottomCallToActionBanner, ImageLeftEyebrowRightSection,
    WaysToUseGridSection

Conventions:
- TypeScript `.tsx` with explicit prop types
- Prefer composition of primitives into `sections/*`
- Images in `public/`; use Next Image where applicable

## 3. Styling Primitives
- Theme: `styles/theme.css.ts`
  - `vars` (colors, fonts, gradients, space, radius)
  - `themeClass` applied on `<body>` in `app/layout.tsx`
- Responsive utilities:
  - `styles/fluid-unit.ts` → `fluidUnit()` returns `clamp()` using `var(--vw)`
  - `styles/hide-on-small-screen.css.ts` → `hideOnSmallScreen` below 550px
  - `components/ViewportUnitsUpdater.tsx` + `hooks/use-viewport-units.ts` keep `--vw`/`--vh` updated
- Tailwind v4 utilities available for layout tweaks (via PostCSS plugin)
