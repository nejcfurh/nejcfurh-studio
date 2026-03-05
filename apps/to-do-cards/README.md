# To-Do Cards

A task management app with card-based lists, multiple sign-in options (credentials and OAuth), MongoDB persistence, and Supabase storage for card images and avatars.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** NextAuth v5 (Credentials, Google, Facebook, Twitter/X, GitHub)
- **Storage:** Supabase (card images, avatars)
- **Validation:** Zod
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Notifications:** Sonner

## Getting Started

```bash
pnpm install
pnpm dev
```

## Features

- Card-based to-do lists with custom list creation
- Credentials sign-in and OAuth (Google, Facebook, Twitter/X, GitHub)
- MongoDB for users and task data
- Supabase storage for card cover images and user avatars
- Create, edit, and delete lists and tasks
- Responsive UI with toasts and loading states

## Environment Variables

Create a `.env` file in the app root:

```env
# MongoDB
MONGODB_URI=              # MongoDB connection string

# NextAuth
AUTH_SECRET=              # Random secret (run: openssl rand -base64 32)

# OAuth providers (optional)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=
AUTH_TWITTER_ID=
AUTH_TWITTER_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Supabase (for image storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start development server       |
| `pnpm build`      | Production build               |
| `pnpm start`      | Start production server        |
| `pnpm lint`       | Run ESLint and Prettier checks |
| `pnpm format`     | Format code                    |
| `pnpm type:check` | TypeScript type checking       |
