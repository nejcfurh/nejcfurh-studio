# nejcfurh-studio

A monorepo powering multiple web applications, built with [Turborepo](https://turbo.build/repo), [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/).

## Apps

| App                                             | Description                                                                | Deployment                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| [reusable-components](apps/reusable-components) | Showcase of reusable UI components with 3D effects and animations          | [LINK](https://reusable-components-nf.vercel.app/) |
| [n-drive](apps/n-drive)                         | Cloud storage and file sharing platform with Convex backend and Clerk auth | [LINK](https://n-drive.vercel.app/)                |
| [backyard-skies](apps/backyard-skies)           | Interactive 3D weather visualization using Three.js and React Three Fiber  | [LINK](https://backyard-skies.vercel.app/)         |
| [desktop-weather](apps/desktop-weather)         | Progressive Web App for weather information                                | [LINK](https://desktop-weather.vercel.app/)        |
| [reviews-analyser](apps/reviews-analyser)       | AI-powered review analysis tool using Vercel AI SDK                        | [LINK](https://reviews-analyser-nf.vercel.app/)    |
| [friends-of-nature](apps/friends-of-nature)     | Community platform for nature enthusiasts with rich animations             | [LINK](https://friends-of-nature.vercel.app/)      |

## Shared Packages

| Package                                                     | Description                                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [shared](packages/shared)                                   | Shared utilities, AI SDK integrations, and analytics helpers (`@repo/shared`) |
| [tsconfig](packages/tsconfig)                               | TypeScript configurations for Next.js, libraries, and base projects           |
| [eslint-config-web](packages/eslint-config-web)             | ESLint flat config presets (base, React, React library, Node)                 |
| [prettier-config-web](packages/prettier-config-web)         | Prettier config with Tailwind CSS and import sorting plugins                  |
| [tailwind-config](packages/tailwind-config)                 | Shared Tailwind CSS theme and custom breakpoints                              |
| [browserslist-config-web](packages/browserslist-config-web) | Shared browser targets for build tools                                        |

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
pnpm reusable-components
pnpm n-drive
pnpm backyard-skies
pnpm desktop-weather
pnpm reviews-analyser
pnpm friends-of-nature
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
- **Linting:** ESLint 9 (flat config), Prettier
- **Git Hooks:** Husky (pre-commit: type check + format, commit-msg: commitlint)
- **CI/CD:** GitHub Actions (code quality, auto-release PRs, semantic versioning)

## Project Structure

```
nejcfurh-studio/
├── apps/
│   ├── reusable-components/   # Component showcase
│   ├── n-drive/               # File sharing platform
│   ├── backyard-skies/        # 3D weather visualization
│   ├── desktop-weather/       # PWA weather app
│   ├── reviews-analyser/      # AI review analysis
│   └── friends-of-nature/     # Nature community platform
├── packages/
│   ├── shared/                # Shared utils, AI SDK, analytics
│   ├── tsconfig/              # TypeScript configs
│   ├── eslint-config-web/     # ESLint presets
│   ├── prettier-config-web/   # Prettier config
│   ├── tailwind-config/       # Tailwind theme
│   └── browserslist-config-web/ # Browser targets
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
