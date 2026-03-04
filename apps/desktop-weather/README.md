# Desktop Weather

A lightweight Progressive Web App designed to display weather on a desktop Surface device in kiosk mode. Shows current weather and forecast with PWA caching for API calls.

To run in kiosk mode (without any status bars) use the `--kiosk` prefix in the shortcut.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack), React 19, TypeScript
- **PWA:** next-pwa
- **API:** Open-Meteo (weather data, 60-minute cache)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React

## Getting Started

```bash
pnpm install
pnpm dev
```

## Features

- Real-time weather display
- Weather forecast section
- PWA caching for Open-Meteo API (60-minute cache)
- Responsive split-view layout
- Kiosk mode support for Surface devices
- Service worker for offline capability
- Installable as a PWA

## Environment Variables

Create a `.env` file in the app root:

```env
NEXT_PUBLIC_BUILD_ID=       # Build identifier (auto-set on Vercel)
NEXT_PUBLIC_ENV=            # Environment type (e.g. production)
```

The following are auto-provided by Vercel and don't need to be set manually:

- `VERCEL_GIT_COMMIT_SHA` — deployment commit hash
- `VERCEL_URL` — deployment URL

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start development server (Turbopack) |
| `pnpm build`      | Production build                     |
| `pnpm start`      | Start production server              |
| `pnpm lint`       | Run ESLint and Prettier checks       |
| `pnpm format`     | Format code                          |
| `pnpm type:check` | TypeScript type checking             |
