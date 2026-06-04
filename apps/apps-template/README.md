# Apps Template

Starter template for new Next.js apps in the monorepo. Copy this folder when scaffolding a new app — it includes the standard tooling, analytics wiring, and project layout used across the workspace.

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with the React Compiler
- **TypeScript 5**
- **Tailwind CSS v4**
- **Zod** for runtime config validation
- **PostHog** analytics via `@analytics` (`packages/analytics`)
- **@repo/ui** shared component library

## Getting Started

From the monorepo root:

```bash
pnpm install
pnpm --filter apps-template dev
```

Or from this directory:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Creating a New App

1. Copy the folder:

   ```bash
   cp -R apps/apps-template apps/my-new-app
   ```

2. Update `package.json` — set `"name"` to `my-new-app`.

3. Update branding and metadata:
   - `config/app.config.ts` — change `serviceName`
   - `utils/constants/page.data.ts` — page titles, descriptions, and `PageName` enum
   - `app/layout.tsx` — metadata and Open Graph values

4. Copy `.env` and set values for the new app (see below).

5. Run `pnpm install` from the monorepo root so the workspace picks up the new package.

6. Optionally add a root script in the repo `package.json`:

   ```json
   "my-new-app": "turbo dev --filter=my-new-app"
   ```

## Environment Variables

| Variable                   | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_ENV`          | App environment (`development`, `staging`, `preview`, `production`) |
| `NEXT_PUBLIC_VERSION`      | Build/version label sent to analytics                               |
| `NEXT_PUBLIC_ROOT_URL`     | Public URL of the app                                               |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingest host                                                 |
| `NEXT_PUBLIC_POSTHOG_KEY`  | PostHog project API key                                             |

All public env vars are validated at startup in `config/app.config.ts`.

## Project Structure

```
apps-template/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Shared UI components
├── config/               # Validated app configuration
├── constants/            # Global constants
├── features/             # Feature-specific logic (e.g. analytics types)
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── utils/                # Helpers, enums, and validation
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start development server       |
| `pnpm build`      | Production build               |
| `pnpm start`      | Start production server        |
| `pnpm lint`       | Run Prettier and ESLint checks |
| `pnpm format`     | Auto-fix formatting and lint   |
| `pnpm type:check` | TypeScript type checking       |

## What's Included

- **Analytics** — `AnalyticsProvider` in the root layout and `PageVisitTracker` on pages
- **Path aliases** — `@/*`, `@utils/*`, and `@analytics/*` configured in `tsconfig.json`
- **Linting & formatting** — ESLint (Next.js config) and shared Prettier config
- **Minimal home page** — placeholder using `@repo/ui` `AnimatedTitle`
