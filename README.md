# Calorie Tracker

MVP health and wellness app focused on **calorie tracking**. Future AI-powered features (custom fitness routines, nutrition plans, mental health support) are planned but not included in this phase — no paid AI APIs are used.

**Package name:** `app-projcet-folder`

## MVP features

- User signup and login (Supabase Auth)
- User profile: age, sex, height, weight, optional body fat percentage
- Food logging against a manual nutrition database
- Activity logging with formula-based calorie-burn estimates
- Daily calorie summary (intake vs burn vs TDEE target)
- Simple dashboard with today's totals and quick-log actions

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) — Auth + PostgreSQL (free tier)

## Prerequisites

- Node.js 18.18 or later
- npm
- A free [Supabase](https://supabase.com/) project (setup in Phase 2)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** This is the Phase 1 scaffold. The app will not run until Phase 2 adds Next.js config, entry pages, and Supabase environment variables. See [docs/MVP.md](docs/MVP.md) for full scope.

## Environment variables

Create a `.env.local` file in Phase 2 with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

| Path | Purpose |
|---|---|
| `app/` | Routes, layouts, and API route handlers (auth, logging, dashboard) |
| `components/` | UI — forms, dashboard cards, log entry components |
| `lib/` | Calorie formulas, Supabase clients, shared types; future `lib/ai/` stubs |
| `docs/` | MVP scope, data model, and architecture notes |

## Roadmap

1. **Phase 1 (current)** — Project scaffold and documentation
2. **Phase 2** — Runnable Next.js app, Supabase tables, auth, logging, dashboard
3. **Future** — Optional AI layer behind `lib/ai/gateway.ts` (no paid APIs until explicitly enabled)

## Status

Phase 1 scaffold complete. See [docs/MVP.md](docs/MVP.md) for detailed MVP scope and data model.
