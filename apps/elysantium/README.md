# Elysantium

A luxury hotel website with an integrated admin panel for managing bookings, cabins, guests, and settings.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **State/Data:** TanStack React Query v5, Supabase
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Runtime:** React 19.2.4

Part of the `nejcfurh-studio` monorepo, managed with pnpm workspaces and Turborepo.

## Project Structure

```
app/
├── page.tsx                  # Public hotel homepage
├── layout.tsx                # Root layout (Poppins font, global styles)
├── globals.css               # CSS custom properties, light/dark mode theming
├── not-found.tsx             # 404 page
├── admin-login/              # Staff login page
│   ├── layout.tsx
│   └── page.tsx
└── admin/                    # Protected admin panel
    ├── layout.tsx            # Admin shell (sidebar, header, providers)
    ├── page.tsx              # Redirects to /admin/dashboard
    ├── dashboard/            # Overview with charts and stats
    ├── bookings/             # Booking list + detail view
    │   └── [bookingId]/
    ├── checkin/
    │   └── [bookingId]/      # Check-in flow
    ├── cabins/               # Cabin management (CRUD)
    ├── guests/               # Guest records
    ├── users/                # Create new admin users
    ├── settings/             # Hotel settings (booking length, breakfast price, etc.)
    └── account/              # Update current user account

components/admin/
├── ui/                       # Reusable UI (Button, Modal, Table, Menus, Filter, etc.)
└── features/                 # Feature components (booking, cabin, dashboard, auth, etc.)

lib/
├── services/                 # Supabase client + API functions (bookings, cabins, auth, settings)
├── hooks/                    # Custom hooks (useOutsideClick, useLocalStorageState, useMoveBack)
├── context/                  # DarkModeContext
├── utils/                    # Helpers and constants
└── data/                     # Sample data + Uploader component for seeding
```

## Getting Started

```bash
# From monorepo root
pnpm install

# Set up environment variables
# Create apps/elysantium/.env with:
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_KEY=<your-supabase-anon-key>

# Run dev server
pnpm elysantium
# or from this directory:
pnpm dev
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `pnpm dev`        | Start development server     |
| `pnpm build`      | Production build             |
| `pnpm start`      | Start production server      |
| `pnpm type:check` | Run TypeScript type checking |
| `pnpm lint`       | Run Prettier + ESLint checks |
| `pnpm format`     | Auto-fix formatting + lint   |

## Features

### Public Site (`/`)

- Hero landing page with fixed background parallax effect
- Rooms preview, about section, and contact CTA
- Gold/dark luxury aesthetic

### Admin Panel (`/admin`)

- **Dashboard** — sales charts, occupancy stats, today's activity
- **Bookings** — filterable/sortable list, detail view, check-in/check-out
- **Cabins** — CRUD with image upload to Supabase Storage
- **Settings** — min/max booking length, max guests, breakfast price
- **Users** — create new staff accounts
- **Account** — update name, avatar, password
- **Dark mode** toggle with CSS custom property theming
- Protected routes with auth guard
