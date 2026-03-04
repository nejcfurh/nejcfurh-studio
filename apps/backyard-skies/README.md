# Backyard Skies

A mobile-only 3D survival game where you control a bird navigating between bird feeders in a suburban backyard. Features resource management, predator threats, and a scoring system.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei, React Three PostProcessing
- **State:** Zustand
- **Styling:** Tailwind CSS 4

## Getting Started

```bash
pnpm install
pnpm dev
```

Open on a **mobile device** or mobile emulator — the game shows a warning on desktop.

## Features

- 3D bird flight mechanics with physics simulation
- Multiple bird species
- Dynamic feeder placement and resource management
- Threat system (predators, environmental hazards)
- Procedural terrain generation with collision detection
- Scoring and leaderboard
- Audio management
- Mobile-optimized UI (HUD, menus, settings)

## Environment Variables

None required.

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start development server       |
| `pnpm build`      | Production build               |
| `pnpm start`      | Start production server        |
| `pnpm lint`       | Run ESLint and Prettier checks |
| `pnpm format`     | Format code                    |
| `pnpm type:check` | TypeScript type checking       |
