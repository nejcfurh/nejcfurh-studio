# nDrive - Secure File Sharing Platform

This mini project was inspired by WebDevCody on Youtube.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

nDrive is a modern, secure file sharing and cloud storage application built with Next.js, Convex, and Clerk. Upload, organize, and share files with your team with a beautiful, intuitive interface.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Convex (real-time database and backend)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: shadcnUI
- **Forms**: React Hook Form with Zod validation

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A [Clerk](https://clerk.com/) account for authentication
- A [Convex](https://convex.dev/) account for the backend

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd n-drive
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

**Getting your Clerk keys:**

1. Sign up at [clerk.com](https://clerk.com/)
2. Create a new application
3. Copy your publishable key from the dashboard
4. Set up webhooks and copy the webhook secret

**Getting your Convex URL:**

1. Sign up at [convex.dev](https://convex.dev/)
2. Create a new project
3. Run `npx convex dev` (see step 4) - this will create the deployment and provide the URL

### 4. Set Up Convex Backend

Start the Convex development server:

```bash
npx convex dev
```

This command will:

- Create a Convex deployment if you don't have one
- Generate the Convex URL (add it to your `.env.local` file)
- Watch for changes in the `convex/` directory
- Sync your schema and functions to the cloud

**Note**: Keep this terminal running while developing. The Convex URL will be displayed in the terminal output.

### 5. Start the Development Server

In a new terminal window, start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 6. Configure Clerk Webhook

1. In your Clerk dashboard, go to **Webhooks**
2. Add a new endpoint: `https://your-convex-deployment.convex.site/clerk`
3. Select the events you want to listen to (user.created, user.updated, etc.)
4. Copy the webhook secret and add it to your `.env.local` file

## Development Workflow

For development, you'll need **two terminal windows**:

**Terminal 1 - Convex Backend:**

```bash
npx convex dev
```

**Terminal 2 - Next.js Frontend:**

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npx convex dev` - Start Convex development mode (watches for changes)

## Project Structure

```
n-drive/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages (files, favorites, trash)
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── convex/               # Convex backend functions
│   ├── files.ts          # File management functions
│   ├── users.ts          # User management functions
│   ├── schema.ts         # Database schema
│   └── http.ts           # HTTP endpoints (webhooks)
├── context/              # React context providers
└── lib/                  # Utility functions
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
