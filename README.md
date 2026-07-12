# nejcfurh-studio

A monorepo powering multiple web applications, built with [Turborepo](https://turbo.build/repo), [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/).

Created by [Nejc Furh](https://nejcfurh.dev)

## Apps

| App                                         | Description                                                                | Deployment                                    |
| ------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------- |
| [design-lab](apps/design-lab)               | Animations, reusable components, UI clones & AI tools showcase             | [LINK](https://design-lab.nejcfurh.dev/)      |
| [n-drive](apps/n-drive)                     | Cloud storage and file sharing platform with Convex backend and Clerk auth | [LINK](https://n-drive.nejcfurh.dev/)         |
| [backyard-skies](apps/backyard-skies)       | Interactive 3D weather visualization using Three.js and React Three Fiber  | [LINK](https://backyard-skies.nejcfurh.dev/)  |
| [desktop-weather](apps/desktop-weather)     | Progressive Web App for weather information                                | [LINK](https://weather.nejcfurh.dev/)         |
| [friends-of-nature](apps/friends-of-nature) | Community platform for nature enthusiasts with rich animations             | [LINK](https://friends-of-nature.vercel.app/) |
| [blog-dev](apps/blog-dev)                   | Personal dev blog with MongoDB backend and admin authentication            | [LINK](https://blog.nejcfurh.dev/)            |
| [to-do-cards](apps/to-do-cards)             | Card-based task manager with NextAuth, MongoDB, and Supabase storage       | [LINK](https://to-do-cards.nejcfurh.dev/)     |
| [twabblr](apps/twabblr)                     | Social / messaging app with NextAuth, Prisma, and real-time (Pusher)       | [LINK](https://twabblr.nejcfurh.dev)          |
| [elysantium](apps/elysantium)               | Luxury hotel site with admin panel (bookings, cabins, Supabase)            | [LINK](https://elysantium.nejcfurh.dev)       |
| [domavia](apps/domavia)                     | Real estate listing platform with Firebase Auth, Firestore, and maps       | [LINK](https://domavia.nejcfurh.dev)          |

New apps start from [apps-template](apps/apps-template), a preconfigured Next.js starter wired to the shared packages and tooling.

## Packages

| Package                             | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| [ai-sdk](packages/ai-sdk)           | AI SDK integrations (Google Gemini)             |
| [analytics](packages/analytics)     | PostHog analytics (provider, hooks, components) |
| [auth](packages/auth)               | Shared NextAuth configuration and helpers       |
| [database](packages/database)       | Database utilities                              |
| [react-query](packages/react-query) | React Query configuration                       |
| [ui](packages/ui)                   | Shared UI components, animations, and icons     |
| [utils](packages/utils)             | Shared utility functions                        |

### Icons

Icons are centralized in `@repo/ui` — apps don't install icon libraries directly. Both [lucide-react](https://lucide.dev/) and [react-icons](https://react-icons.github.io/react-icons/) are re-exported per set, so bundlers only compile the sets an app actually imports:

```tsx
import { ArrowRight } from "@repo/ui/icons/lucide";
import { FaHome } from "@repo/ui/icons/react-icons/fa6";
import { HiOutlineSparkles } from "@repo/ui/icons/react-icons/hi2";
import type { IconType } from "@repo/ui/icons";
```

All 31 react-icons sets are available under `@repo/ui/icons/react-icons/<set>`. Note: lucide 1.x removed brand/social icons (GitHub, Instagram, …) — use the Feather set (`react-icons/fi`) for those.

## Tooling

| Package                                                    | Description                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| [tsconfig](tooling/tsconfig)                               | TypeScript configurations for Next.js, libraries, and base    |
| [eslint-config-web](tooling/eslint-config-web)             | ESLint flat config presets (base, React, React library, Node) |
| [prettier-config-web](tooling/prettier-config-web)         | Prettier config with Tailwind CSS and import sorting plugins  |
| [tailwind-config](tooling/tailwind-config)                 | Shared Tailwind CSS theme and custom breakpoints              |
| [browserslist-config-web](tooling/browserslist-config-web) | Shared browser targets for build tools                        |

## Requirements

- **Node.js** `v24.13.1` (see [.nvmrc](.nvmrc))
- **pnpm** `10.30.3` (enforced via `packageManager` field)

## Getting Started

```bash
# Use the correct Node.js version
nvm use

# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Start a specific app
pnpm run design-lab
pnpm run n-drive
pnpm run backyard-skies
pnpm run desktop-weather
pnpm run friends-of-nature
pnpm run blog-dev
pnpm run to-do-cards
pnpm run twabblr
pnpm run elysantium
pnpm run domavia
pnpm run jobs-react-native
```

## Commands

### Development

| Command      | Description                                        |
| ------------ | -------------------------------------------------- |
| `pnpm dev`   | Start all apps in development mode                 |
| `pnpm build` | Build all apps and packages                        |
| `pnpm start` | Start all apps in production mode (requires build) |
| `pnpm clean` | Remove all build artifacts (`dist/`, `.next/`)     |

### Code Quality

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm lint`          | Run Prettier and ESLint checks |
| `pnpm lint:prettier` | Check formatting with Prettier |
| `pnpm lint:eslint`   | Check code quality with ESLint |
| `pnpm type:check`    | Run TypeScript type checking   |

### Formatting

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `pnpm format`          | Auto-fix Prettier and ESLint issues      |
| `pnpm format:prettier` | Auto-fix formatting with Prettier        |
| `pnpm format:eslint`   | Auto-fix code quality issues with ESLint |

## Tech Stack

- **Framework:** Next.js 16 with Turbopack
- **UI:** React 19, Tailwind CSS 4
- **Language:** TypeScript 5
- **Monorepo:** Turborepo 2.8, pnpm workspaces
- **Analytics:** PostHog (via `@repo/analytics`)
- **Linting:** ESLint 9 (flat config), Prettier
- **Git Hooks:** Husky (pre-commit: type check + format, commit-msg: commitlint)
- **CI/CD:** GitHub Actions (code quality, auto-release PRs, semantic versioning)

## Project Structure

```
nejcfurh-studio/
├── apps/
│   ├── apps-template/         # Starter template for new apps
│   ├── backyard-skies/        # 3D Bird Survival Game
│   ├── blog-dev/              # Personal dev blog
│   ├── design-lab/            # Animations, components, clones & tools
│   ├── desktop-weather/       # PWA weather app
│   ├── domavia/               # Real estate listing platform
│   ├── elysantium/            # Hotel site + admin panel
│   ├── friends-of-nature/     # Nature community platform
│   ├── jobs-react-native/     # React Native job search app
│   ├── n-drive/               # File sharing platform
│   ├── to-do-cards/           # Card-based Task Manager
│   └── twabblr/               # Social / Messaging app
├── packages/
│   ├── ai-sdk/                # AI SDK integrations (Google Gemini)
│   ├── analytics/             # PostHog analytics
│   ├── auth/                  # Shared NextAuth configuration
│   ├── database/              # Database utilities
│   ├── react-query/           # React Query configuration
│   ├── ui/                    # Shared UI components, animations & icons
│   └── utils/                 # Shared utility functions
├── tooling/
│   ├── browserslist-config-web/ # Browser targets
│   ├── eslint-config-web/     # ESLint presets
│   ├── prettier-config-web/   # Prettier config
│   ├── tailwind-config/       # Tailwind theme
│   └── tsconfig/              # TypeScript configs
├── turbo.json                 # Turborepo pipeline config
├── pnpm-workspace.yaml        # Workspace definition
└── package.json               # Root scripts and dependencies
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint. A scope is required.

```
feat(app-name): Add new feature
fix(shared): Resolve utility bug
chore(ci): Update workflow
```

**Allowed types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`, `improvement`

## Release Process

Releases are fully automated via GitHub Actions:

1. Create PR from `feature-branch` to `develop`
2. A release PR is auto-created targeting `main` with a changelog
3. Merging the PR triggers version bump, git tag, and GitHub Release creation
4. `main` is synced back to `develop`
