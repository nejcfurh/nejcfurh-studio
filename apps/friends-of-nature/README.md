# Friends of Nature

A modern conservation initiative website promoting environmental action. Features animated UI, carousels, parallax effects, and analytics integration.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Animation:** Framer Motion, Flubber
- **Carousels:** Swiper, Embla Carousel
- **UI:** Headless UI
- **Forms:** React Hook Form, Zod
- **Styling:** Tailwind CSS 4, clsx, tailwind-merge
- **Analytics:** @repo/shared (workspace package)
- **Icons:** Lucide React

## Getting Started

```bash
pnpm install
pnpm dev
```

## Features

- Full-screen animated hero section
- Parallax text animations
- Interactive stacked cards
- Campaign and testimonial carousels
- Yard makeover program showcase
- Manifesto page with animations
- Image gallery
- Social media integration (Instagram, Facebook, TikTok)
- Page visit tracking analytics
- Responsive design with separate mobile/desktop layouts

## Environment Variables

Create a `.env` file in the app root:

```env
NEXT_PUBLIC_ENV=                    # Environment type (e.g. production)
NEXT_PUBLIC_VERSION=                # App version string
NEXT_PUBLIC_ROOT_URL=               # Root URL of the app
GOOGLE_GENERATIVE_AI_API_KEY=       # Google AI API key
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start development server       |
| `pnpm build`      | Production build               |
| `pnpm start`      | Start production server        |
| `pnpm clean`      | Clean .next and .turbo         |
| `pnpm lint`       | Run ESLint and Prettier checks |
| `pnpm format`     | Format code                    |
| `pnpm type:check` | TypeScript type checking       |
