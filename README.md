# QafilaTech Landing Page

Static marketing site for [QafilaTech](https://qafila.tech) — a logistics marketplace connecting customers, drivers, and businesses.

This repo is **frontend only**. There is no backend, auth, or database in this project. Registration happens via external Microsoft Forms links.

## Features

- Fully responsive layout (mobile, tablet, desktop)
- English / Arabic language toggle with RTL support
- Customer / Driver audience switch (synced between navbar and features)
- Landing sections: hero video, trust bar, features, how it works, CTA, footer
- Smooth scroll navigation and scroll-triggered animations
- 404 page for unknown routes

## Tech Stack

| Layer | Tools |
|-------|-------|
| UI | React 18, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS, tailwindcss-animate |
| Routing | React Router |
| Icons | Lucide React |
| Fonts | Plus Jakarta Sans, Tajawal (Google Fonts) |

## Prerequisites

- Node.js 18+
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:3000
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

## Project Structure

```
landing_page/
├── public/                  # Static assets served as-is
│   ├── QT-Logo/             # Light & dark logo variants
│   ├── singleLogo.png       # Favicon & OG image
│   ├── heroSplash3.png      # Hero poster / fallback image
│   ├── Mockup.png           # Features section mockup
│   └── 5171156-hd_*.mp4     # Hero background video
├── src/
│   ├── components/          # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustBar.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Index.tsx        # Main landing page
│   │   └── NotFound.tsx     # 404 page
│   ├── context/
│   │   └── LanguageContext.tsx
│   ├── App.tsx              # Routes: / and *
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles & design tokens
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## Routes

| Path | Page |
|------|------|
| `/` | Landing page |
| `*` | 404 — Not Found |

## Registration Links

Sign-up CTAs point to Microsoft Forms (configured in `src/components/CTA.tsx`):

- **Customer registration** — Office Forms design page
- **Driver registration** — Office Forms response page

## Deployment

1. Run `npm run build`
2. Deploy the generated `dist/` folder to any static host

Configured production hosts in `vite.config.ts`:

- `qafila.tech`
- `www.qafila.tech`
- `robust-bandicoot-qafila-c8800ffd.koyeb.app`

### Koyeb / static hosting

```bash
npm run build
# Upload or sync the dist/ directory to your host
```

No environment variables are required for the landing page itself.

## Brand

Primary brand color: **teal `#507080`** — defined as CSS variables in `src/index.css`.

---

Made with 🤘🏿 by Halumi
