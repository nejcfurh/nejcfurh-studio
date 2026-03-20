# Design Lab

A showcase of animations, reusable components, UI clones, and tools — built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Features

- **Next.js 16** with App Router
- **React 19** with the latest features
- **TypeScript** for type safety
- **Tailwind CSS v4** for modern styling
- **Dark mode** support
- **Responsive design** across all pages

## Sections

### Animations

| Animation                | Path                                   | Description                                                      |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| Scroll to Decrypt        | `/animations/scroll-to-decrypt`        | Text decrypts character-by-character as you scroll               |
| Scroll to Unblur         | `/animations/scroll-to-unblur`         | Text progressively unblurs on scroll (CSS Scroll-Timeline API)   |
| Transforming Cards       | `/animations/transforming-cards`       | Card scanner with particle systems and ASCII art transformations |
| Layered Parallax         | `/animations/layered-parallax`         | Multi-layer parallax scrolling with depth-based movement         |
| Tilt Card                | `/animations/tilt-card`                | 3D holographic card with mouse tracking and flip animation       |
| Staggered Animation      | `/animations/staggered-animation`      | Staggered list entrance animations                               |
| Infinite Scroll Carousel | `/animations/infinite-scroll-carousel` | Infinite looping carousel                                        |
| Mask Cursor Effect       | `/animations/mask-cursor-effect`       | Cursor-following mask reveal effect                              |
| Media Slider             | `/animations/media-slider`             | Angled image slider with hover transitions                       |

### Components

| Component       | Path                                 | Description                                       |
| --------------- | ------------------------------------ | ------------------------------------------------- |
| Drag & Drop     | `/components-showcase/drap-drop`     | Drag-and-drop interface with customizable widgets |
| File Upload     | `/components-showcase/file-upload`   | Dropzone with drag-and-drop and file preview      |
| Input Fields    | `/components-showcase/input-fields`  | Animated input variants with floating labels      |
| Buttons & Menus | `/components-showcase/buttons-menus` | Social share buttons and multi-option menus       |

### UI Clones

| Clone              | Path                | Description                                         |
| ------------------ | ------------------- | --------------------------------------------------- |
| Tesla UI Clone     | `/clones/tesla`     | Tesla homepage clone with scroll animations and nav |
| Instagram UI Clone | `/clones/instagram` | Instagram feed clone with stories, posts, sidebar   |

### Tools

| Tool             | Path                      | Description                                           |
| ---------------- | ------------------------- | ----------------------------------------------------- |
| Reviews Analyser | `/tools/reviews-analyser` | AI-powered review analysis with Google Gemini chatbot |

## Environment Variables

| Variable                       | Required For     |
| ------------------------------ | ---------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Reviews Analyser |

## Project Structure

```
design-lab/
├── app/
│   ├── animations/              # Animation showcase pages
│   ├── components-showcase/     # Reusable component pages
│   ├── clones/                  # UI clone pages (Tesla, Instagram)
│   ├── tools/                   # Tool pages (Reviews Analyser)
│   ├── api/                     # API routes (chat)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Landing page with sections
├── components/                  # Shared UI components
├── features/                    # Feature-specific logic and constants
├── hooks/                       # Custom React hooks
├── constants/                   # Global constants
├── utils/                       # Utility functions
└── public/                      # Static assets
```

## Technologies

- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **TypeScript 5** — Type safety
- **Tailwind CSS v4** — Utility-first styling
- **Three.js** — 3D graphics and particle systems
- **Framer Motion** — Animations and gestures
- **Google Generative AI** — Reviews Analyser AI backend
- **React Icons** — Icon library
