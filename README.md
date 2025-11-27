# Money Game

Money Game is a Next.js 16 application that turns personal finance into a lightweight game. Authenticated users connect through Supabase, set monthly savings goals, upload income/expense snapshots, and watch their progress translate into scores, levels, and badges.

## Features

- **Supabase Auth & Session Guarding** – Edge middleware keeps sessions synced and redirects anonymous visitors to the login screen.
- **Goal Management** – Dedicated flows to define a first monthly savings goal and revisit it later.
- **Gamified Dashboard** – Shows total savings vs. goal, level, score, and earned badges at a glance.
- **Data Upload Pipeline** – Accepts JSON summaries, persists rows in `savings_data`, and recalculates `profiles` metrics.
- **Insights & Challenges** – Aggregates recent savings trends and surfaces rotating challenges to keep users engaged.
- **Responsive UI System** – Tailwind CSS v4 + shadcn/ui components built on Radix primitives for consistent styling and accessibility.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4, tw-animate-css, shadcn/ui, Radix UI
- **Auth & Data:** Supabase (Supabase JS + Supabase SSR helpers)
- **Charts & UI Helpers:** Recharts, lucide-react, class-variance-authority, react-hook-form, zod

## Project Structure

```
app/
  page.tsx             # Landing page
  layout.tsx           # Root layout & metadata
  auth/…               # Login, signup, success, error pages
  dashboard/           # Main progress dashboard
  edit-goal/, set-goal/ # Goal management flows
  upload-data/         # JSON upload workflow
  insights/            # Trends, challenges, badges
components/
  ui/                  # shadcn/ui building blocks
lib/
  supabase/            # Client + server helpers and middleware glue
middleware.ts          # Enforces authenticated routes
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm (ships with Node) or pnpm/yarn if you prefer
- A Supabase project with `profiles` and `savings_data` tables

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"
```

Both browser and server helpers (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`) rely on these variables at runtime.

### 4. Database schema expectations

At minimum you should have:

- `profiles` table with columns:
  - `id` (UUID, PK, matches Supabase auth user id)
  - `monthly_goal` (numeric)
  - `total_savings`, `current_score`, `current_level` (numeric)
  - `badges_earned` (text array)
- `savings_data` table with columns:
  - `user_id` (UUID FK to `profiles.id`)
  - `month` (text)
  - `income`, `expenses`, `savings` (numeric)
  - `created_at` (timestamp)

Seed your Supabase project or run SQL migrations as needed before uploading data from the app.

### 5. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000. Middleware will redirect you to `/auth/login` until you authenticate with Supabase.

### 6. Useful scripts

| Script          | Description                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the Next.js dev server     |
| `npm run build` | Create a production build        |
| `npm run start` | Run the production server        |
| `npm run lint`  | Run ESLint across the codebase   |

## Deployment Notes

- Set the same Supabase environment variables on your hosting provider (Vercel, Netlify, etc.).
- Because the middleware uses Supabase cookies, ensure the deployment platform supports Next.js Edge Middleware (Vercel does by default).
- Run `npm run build` locally before deploying if you want to catch any SSR or type issues early.

## Contributing / Next Steps

- Add migrations / seed scripts under `scripts/` to automate Supabase setup.
- Extend the gamification system (more badges, streak tracking, charts).
- Harden the JSON upload flow with schema validation in Supabase Row Level Security policies.
- Add automated tests (unit + integration) to cover Supabase client logic and UI flows.

## License

No explicit license is currently provided. If you plan to distribute this project, consider adding a `LICENSE` file (MIT, Apache 2.0, etc.) that matches your needs.


