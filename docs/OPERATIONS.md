# Operations

Practical reference for running, testing, and deploying locally.

## 1. Run and Build
- Dev: `npm run dev` → http://localhost:3000
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`

## 2. Environment
- No required env vars currently
- Use `.env.local` for local-only values
- Expose client-safe vars with `NEXT_PUBLIC_`

## 3. Viewport and Performance
- `app/layout.tsx` sets a fixed viewport (1440x900, scaling). Confirm this matches product goals
- Prefer optimized images in `public/`; consider Next Image where appropriate

## 4. Testing
- Vitest configured in `vitest.config.ts`
- Add tests with `*.test.ts(x)` and run `npx vitest`
- Suggested: `@testing-library/react` for component tests

## 5. Common Tasks
- Add page: `app/<route>/page.tsx`
- Add section: `components/sections/MySection.tsx`
- Theming: edit tokens in `styles/theme.css.ts`

## 6. Troubleshooting
- Responsive text off → ensure `ViewportUnitsUpdater` is mounted and `--vw` updates
- Styles missing → import vanilla-extract classes; verify `themeClass` on `<body>`
- Tailwind utilities missing → check `@tailwindcss/postcss` plugin in `postcss.config.mjs`
