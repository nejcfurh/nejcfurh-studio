# Domera

A real estate listing platform for browsing and publishing properties for rent or sale. Find a house. Make it your home.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Runtime:** React 19
- **Auth:** Firebase Authentication (email/password, Google OAuth)
- **Database:** Firebase Firestore
- **Storage:** Supabase Storage (listing and profile images)
- **Maps:** Leaflet, React Leaflet
- **Forms:** React Hook Form, Zod
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Embla Carousel
- **Analytics:** PostHog via `@analytics`
- **Geocoding:** LocationIQ

Part of the `nejcfurh-studio` monorepo, managed with pnpm workspaces and Turborepo.

## Getting Started

```bash
# From monorepo root
pnpm install

# Set up environment variables (see below)
# Create apps/domera/.env with the required values

# Run dev server
pnpm domera
# or from this directory:
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

### Public Site

- Homepage with featured listings carousel
- Browse listings by category (`/category/rent`, `/category/sell`)
- Special offers page with paginated grid (`/offers`)
- Listing detail pages with image gallery, map, and share button
- Contact landlord dialog on listing pages

### Authenticated Users

- Register, login, and password reset via Firebase Auth
- Google OAuth sign-in
- User profile with editable details and avatar upload
- Create, edit, and delete own listings (`/create-listing`, `/profile`)
- Automatic geocoding of listing addresses via LocationIQ

## Environment Variables

Create a `.env` file in the app root. All public env vars are validated at startup in `config/app.config.ts`.

| Variable                                   | Description                                                         |
| ------------------------------------------ | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_ENV`                          | App environment (`development`, `staging`, `preview`, `production`) |
| `NEXT_PUBLIC_VERSION`                      | Build/version label sent to analytics                               |
| `NEXT_PUBLIC_ROOT_URL`                     | Public URL of the app                                               |
| `NEXT_PUBLIC_POSTHOG_HOST`                 | PostHog ingest host                                                 |
| `NEXT_PUBLIC_POSTHOG_KEY`                  | PostHog project API key                                             |
| `NEXT_PUBLIC_SUPABASE_URL`                 | Supabase project URL                                                |
| `SUPABASE_SERVICE_ROLE_KEY`                | Supabase service role key (server-side image uploads)               |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase client API key                                             |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain                                                |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID                                                 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket                                             |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                                        |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID                                                     |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`      | Firebase measurement ID                                             |
| `FIREBASE_PROJECT_ID`                      | Firebase Admin project ID                                           |
| `FIREBASE_CLIENT_EMAIL`                    | Firebase Admin service account email                                |
| `FIREBASE_PRIVATE_KEY`                     | Firebase Admin service account private key                          |
| `LOCATIONIQ_GEOCODE_API_KEY`               | LocationIQ API key for address geocoding                            |

## Project Structure

```
domera/
├── app/                          # Next.js App Router pages and layouts
│   ├── auth/                     # Login, register, password reset
│   ├── category/[categoryName]/  # Category listing grids + detail pages
│   ├── create-listing/           # New listing form
│   ├── offers/                   # Special offers page
│   └── profile/                  # User profile and my listings
├── components/                   # Shared UI (Header, Footer, shadcn/ui)
├── config/                       # Validated app configuration
├── features/
│   ├── analytics/                # PostHog page event types
│   ├── auth/                     # Auth actions, hooks, and components
│   └── listings/                 # Listing CRUD, grid, gallery, map
├── hooks/                        # Custom React hooks
├── lib/                          # Firebase and Supabase clients
├── public/                       # Static assets
└── utils/                        # Helpers, enums, and validation
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
