# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** QafilaTech
**Generated:** 2026-08-13
**Category:** Logistics marketplace (B2B + drivers)
**Brand constraint:** Logo teal `#507080` is the primary brand color. Do not replace it with navy/blue/orange palettes.

---

## Global Rules

### Color Palette

Derived from the official logo mark (`#507080` / `hsl(200 23% 41%)`).

| Role | Hex | CSS Variable | Notes |
|------|-----|--------------|-------|
| Primary | `#507080` | `--color-primary` | Logo teal — CTAs, links, icons |
| On Primary | `#FFFFFF` | `--color-on-primary` | Contrast ~5.4:1 on primary |
| Secondary | `#3A5560` | `--color-secondary` | Darker teal for hover / emphasis |
| Accent/CTA | `#507080` | `--color-accent` | Same as primary — color *is* the brand |
| Background | `#F6F9FA` | `--color-background` | Cool off-white, teal-tinted |
| Foreground | `#162228` | `--color-foreground` | Teal-ink, not pure black |
| Muted | `#E8EEF1` | `--color-muted` | Surfaces, chips |
| Border | `#D3DCE0` | `--color-border` | Cool gray-teal |
| Destructive | `#DC2626` | `--color-destructive` | Errors only |
| Ring | `#507080` | `--color-ring` | Focus rings use brand |

**Color Notes:** Trust teal from the QAFILA.TECH mark. No orange delivery accents, no navy substitution, no purple/pink AI gradients.

### Typography

- **Heading Font:** Plus Jakarta Sans (800 hero / 700 sections / 600 cards)
- **Body Font:** Plus Jakarta Sans (400, line-height 1.5)
- **Arabic:** Tajawal (300–800)
- **Mood:** geometric, professional, B2B, approachable
- **Base size:** 16px

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Tajawal:wght@300;400;500;700;800&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Card padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero padding |

### Radii & Motion

- Buttons / chips: `12px`
- Cards: `16px`
- Micro-interactions: `150–300ms`, ease-out
- Animate transform/opacity only
- Honor `prefers-reduced-motion`

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(22,34,40,0.06)` | Subtle lift |
| `--shadow-md` | `0 8px 24px rgba(80,112,128,0.12)` | Cards, buttons |
| `--shadow-lg` | `0 16px 40px rgba(80,112,128,0.16)` | Featured media |

---

## Component Specs

### Buttons

- One primary CTA per view; secondary is outline
- Min height 44px, `cursor-pointer`, visible focus ring (`2px` brand)
- Primary: brand teal fill, white label
- Secondary: transparent + brand/white border depending on surface

### Cards

- White surface on cool background
- 16px radius, teal-tinted shadow
- Hover: shadow lift only (no layout-shifting scale)

### Icons

- Lucide only, outline, 24px default
- Sit in 48×48 teal-tint wells (`bg-primary/10 text-primary`)

---

## Style Guidelines

**Style:** Trust & Authority

**Keywords:** credentials, bilingual Oman marketplace, verified partners, real-time tracking, security, professional logistics

**Key Effects:** Badge hover, stat reveal, scroll fade (transform + opacity)

### Page Pattern (landing override)

Marketplace dual-audience (customers + drivers), not search-first:

1. Hero (value prop + dual register CTAs + product visual)
2. Trust bar (location, language, verification, tracking)
3. Features (audience toggle + icon cards)
4. How it works
5. CTA (Register as Customer / Driver)
6. Footer

---

## Anti-Patterns (Do NOT Use)

- Playful design, emoji icons, purple/pink AI gradients
- Replacing brand teal with generic logistics blue/orange
- Fake metrics
- Hover-only interactions
- Infinite decorative bounce/spin
- Missing focus rings or sub-44px tap targets
