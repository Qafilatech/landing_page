# Qafila landing page (Vite + React)

Marketing site + `/admin` ops portal. **No local Express backend** — everything talks to `qafila-platform` on port 3001.

## Quick start (after platform is running)

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000 — admin at `/admin`.

`.env.example` defaults:

```
VITE_API_BASE=http://localhost:3000   # wait — must be API
```

Correct values (see committed `.env.example`):

```
VITE_API_BASE=http://localhost:3001
VITE_WEBSITE_DOMAIN=http://localhost:3000
```

Team setup for SuperTokens / DB / Flutter: see `qafila-platform/docs/LOCAL_DEV_SETUP.md`.

## Scripts

- `npm run dev` — Vite
- `npm run build` — production build
- `npm run preview` — preview build

## Tech

React 18, TypeScript, Vite, Tailwind, shadcn/ui, React Router.
