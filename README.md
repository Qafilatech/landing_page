# QafilaTech Landing Page

Marketing site for [QafilaTech](https://qafila.tech) — a logistics marketplace connecting customers, drivers, and businesses.

## Features

- Responsive layout (mobile, tablet, desktop)
- English / Arabic language toggle with RTL support
- Customer / Driver audience switch on the landing page
- Hero video, features, how-it-works, and CTA sections
- External registration forms (Microsoft Forms) for sign-ups

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server and production build
- **Tailwind CSS** — styling and animations
- **React Router** — client-side routing (`/` and 404)
- **Lucide React** — icons

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # output → dist/
npm run preview  # preview production build locally
```

## Project Structure

```
src/
├── components/       # Landing page sections
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── TrustBar.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── pages/
│   ├── Index.tsx     # Landing page
│   └── NotFound.tsx  # 404 page
├── context/
│   └── LanguageContext.tsx
├── App.tsx
├── main.tsx
└── index.css
public/               # Static assets (logos, video, mockups)
```

## Deployment

Build the static site with `npm run build` and deploy the `dist/` folder to any static host (Koyeb, Netlify, Vercel, etc.).

Production domains configured in `vite.config.ts`:
- `qafila.tech`
- `www.qafila.tech`
- `robust-bandicoot-qafila-c8800ffd.koyeb.app`

---

Made with 🤘🏿 by Halumi
