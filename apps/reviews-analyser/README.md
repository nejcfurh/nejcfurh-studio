# Reviews Analyser

An AI-powered tool for analyzing customer product reviews. Provides sentiment analysis, key insights, category breakdowns, and actionable recommendations with an interactive chatbox for follow-up questions.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack), React 19, TypeScript
- **AI:** Google Generative AI
- **Validation:** Zod
- **Styling:** Tailwind CSS 4
- **Icons:** React Icons
- **Optimization:** Babel React Compiler
- **Analytics:** @repo/shared (workspace package)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Features

- Paste reviews and get AI-powered analysis
- Overall sentiment visualization
- Category-wise breakdown
- Key insights extraction
- Actionable recommendations
- Interactive chatbox for follow-up questions
- Glassmorphism UI with animated gradient background
- Loading states and error handling

## Environment Variables

Create a `.env` file in the app root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=   # Google AI API key
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start development server (Turbopack) |
| `pnpm build`      | Production build                     |
| `pnpm start`      | Start production server              |
| `pnpm lint`       | Run ESLint and Prettier checks       |
| `pnpm format`     | Format code                          |
| `pnpm type:check` | TypeScript type checking             |
