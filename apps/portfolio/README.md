# Portfolio

Personal portfolio and professional showcase site — [nejcfurh.dev](https://nejcfurh.dev).

## Overview

A single-page portfolio built with Next.js, featuring a modern layout with smooth scroll, parallax-style sections, and responsive design. Sections include Hero, About, Experience, Projects, and Contact (with EmailJS integration).

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animation:** Motion (Framer Motion), react-parallax-tilt, maath
- **Icons:** Lucide React, React Icons
- **Contact:** EmailJS (browser), react-hot-toast
- **Runtime:** React 19

Part of the `nejcfurh-studio` monorepo, managed with pnpm workspaces and Turborepo.

## Project Structure

```
app/
├── page.tsx                    # Home (Navbar, Hero, About, Experience, Projects, Contact, Footer)
├── layout.tsx
├── globals.css
├── components/                 # Shared UI (ScrollProgress, GrainOverlay, ServiceCard, etc.)
└── features/
    └── homepage/               # Sections and homepage-specific components
        ├── components/         # Navbar, Hero, About, Experience, Projects, Contact, Footer
        └── constants/          # Nav links, services, experience, projects data
public/
├── images/                     # Icons, logos, project thumbnails, experience assets
└── ...
```

## Getting Started

From the monorepo root:

```bash
pnpm portfolio
```

Or from this directory:

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
pnpm start
```

## Environment

Optional: create `.env.local` if using EmailJS or other env-based config (see `.env.example` if present).

## Deployment

Live site: **[https://nejcfurh.dev](https://nejcfurh.dev)**
