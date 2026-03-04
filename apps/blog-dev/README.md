# Blog.dev

A personal development blog platform with MongoDB backend, admin authentication, and full CRUD operations for blog posts.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** NextAuth v5 (Credentials provider)
- **Forms:** React Hook Form, Zod
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React

## Getting Started

```bash
pnpm install
pnpm dev
```

## Features

- Admin authentication (login/logout)
- Create, read, and delete blog posts
- MongoDB persistent storage
- Posts sorted by date with image support
- Auth-guarded compose page and server actions
- Responsive card-based post listing

## Environment Variables

Create a `.env` file in the app root:

```env
MONGODB_URI=           # MongoDB connection string
NEXTAUTH_SECRET=       # Random secret (run: openssl rand -base64 32)
ADMIN_USERNAME=        # Admin login username
ADMIN_PASSWORD=        # Admin login password
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
