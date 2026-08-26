# Design System Reference — FarmSet

Adapted from the River Church Eldoret design system. Palette swapped for a farm-appropriate
two-hue system (pasture green + harvest amber); structure, spacing, components, and motion
carry over unchanged per the source system's own reuse instructions.

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Server Components by default, Vercel-native |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`) | Design tokens live in `globals.css` via `@theme` |
| Component primitives | shadcn/ui (style: `"base-nova"`, built on `@base-ui/react`) | Accessible Button/Dialog/Sheet/DropdownMenu/NavigationMenu/Badge/Card out of the box |
| Motion | Framer Motion | Scroll-triggered reveal animations |
| Icons | lucide-react | Consistent line-icon set throughout |
| Fonts | `next/font/google`: Geist (sans), Geist Mono, Playfair Display (headings) | Serif display + clean sans body |

Bootstrap:

```
npx create-next-app@latest . --ts --tailwind --eslint --app --import-alias "@/*"
npx shadcn@latest init -d
npx shadcn@latest add button dialog dropdown-menu navigation-menu sheet separator badge card -y
npm install framer-motion lucide-react
```

## 2. Color System

Two hue families only: a **pasture green** scale (primary/structural) and a **harvest amber**
scale (accent/CTA — reads as "gold/wheat," which fits a farm brand naturally). Semantic red
for destructive actions only (shadcn's default `--destructive`).

### 2.1 Raw scale (defined once, in `:root`)

```css
:root {
  --pasture-50:  #eef6ee;
  --pasture-100: #d7ead9;
  --pasture-200: #b0d5b3;
  --pasture-300: #82ba88;
  --pasture-400: #5b9d63;
  --pasture-500: #3f8248;
  --pasture-600: #2f6b39;   /* primary brand green */
  --pasture-700: #26562e;
  --pasture-800: #204526;
  --pasture-900: #1a381f;
  --pasture-950: #102415;   /* darkest surface — headers/footers/hero overlays */

  --harvest-50:  #fdf8ec;
  --harvest-100: #faedc9;
  --harvest-200: #f3da93;
  --harvest-300: #eabf5c;
  --harvest-400: #dea435;   /* ring/focus color */
  --harvest-500: #c98d24;   /* accent/secondary */
  --harvest-600: #a8721c;
  --harvest-700: #825819;   /* accent text on light backgrounds (AA-safe) */
  --harvest-800: #614317;
  --harvest-900: #453113;
}
```

To re-brand further: replace these two 10-step scales at the same lightness steps — everything
downstream (semantic tokens, components) references these variables, never raw hex.

### 2.2 Semantic tokens (map the scale to meaning, light + dark)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: var(--pasture-950);
  --primary: var(--pasture-600);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: var(--harvest-500);
  --secondary-foreground: var(--pasture-950);
  --muted: var(--pasture-50);
  --muted-foreground: var(--pasture-700);
  --accent: var(--harvest-100);
  --accent-foreground: var(--pasture-900);
  --border: var(--pasture-100);
  --input: var(--pasture-100);
  --ring: var(--harvest-400);
}

.dark {
  --background: var(--pasture-950);
  --foreground: oklch(0.985 0 0);
  --primary: var(--harvest-500);           /* inverts: amber becomes primary in dark mode */
  --primary-foreground: var(--pasture-950);
  --secondary: var(--pasture-700);
  --muted: var(--pasture-800);
  --muted-foreground: var(--pasture-200);
  --accent: var(--pasture-800);
  --accent-foreground: var(--harvest-300);
  --ring: var(--harvest-400);
}
```

### 2.3 Usage rules

- **`pasture-950` surfaces**: hero banners, footer, sticky header on dark pages — reserved for
  "big structural blocks," never body copy backgrounds.
- **White/near-white surfaces**: default page background, all cards.
- **`pasture-50`**: subtle section backgrounds to break up all-white pages (e.g. a stats/pillars
  grid between two white sections).
- **`harvest-400/60` border ("gold-line")**: thin amber outline on emphasized cards, buttons,
  dividers — see §4.2.
- **`harvest-700` text on white / `harvest-300` text on `pasture-950`**: eyebrow labels and
  accent text — always 700-step on light, 300-step on dark, for contrast.
- Never use harvest amber as a large fill for body text backgrounds; it's an accent, not a
  surface color.
- Status colors layered on top for farm-specific states (not part of the two-hue system, used
  sparingly and only for status chips/badges): healthy = `pasture-600`, sick/alert = `--destructive`
  (red), pending/needs-attention = `harvest-500`.

## 3. Typography

```tsx
// app/layout.tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
```

```css
--font-display: var(--font-playfair);
--font-heading: var(--font-display);   /* aliased so `font-heading` utility works */

@layer base {
  html { @apply font-sans; }              /* Geist Sans is the default body font */
  h1, h2, h3, h4 { @apply font-heading; } /* every heading auto-gets Playfair Display */
}
```

Rules:
- Headings (h1–h4) are always the serif display font, semibold–bold weight.
- Body copy is always Geist Sans, regular weight, `text-pasture-700` (not pure black).
- Monospace (`font-mono`, Geist Mono) is reserved for literal technical strings only (e.g. a
  tag/ID in an admin table) — never decorative.
- Eyebrow/label text: `text-xs font-semibold uppercase tracking-wide`.

## 4. Core Component Patterns

### 4.1 Buttons

Base button from shadcn (`components/ui/button.tsx`) with variants
`default | outline | secondary | ghost | destructive | link` and sizes
`xs | sm | default | lg | icon`. Two custom utility classes layer on for brand CTAs:

```css
@layer utilities {
  .btn-metallic {
    background-image: linear-gradient(
      110deg,
      var(--harvest-600) 0%, var(--harvest-300) 30%, var(--harvest-500) 45%,
      var(--harvest-100) 55%, var(--harvest-500) 70%, var(--harvest-600) 100%
    );
    background-size: 250% 100%;
    color: var(--pasture-950);
    animation: shimmer 5s linear infinite;
  }
  .btn-metallic:hover { animation-duration: 1.8s; }

  .gold-line { @apply border border-harvest-400/60; }  /* thin amber outline, reused everywhere */
}

@keyframes shimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: -200% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .btn-metallic { animation: none; }
}
```

Usage — primary CTAs:

```tsx
<Button className="btn-metallic gold-line font-semibold">Log Today's Activity</Button>
```

Secondary/outline CTAs on a dark hero:

```tsx
<Button variant="outline" className="gold-line border-white/40 bg-transparent text-white hover:bg-white/10">
  View Farm Dashboard
</Button>
```

### 4.2 Cards

```tsx
// Standard card
<div className="rounded-2xl border border-pasture-100 bg-white p-6 shadow-sm">…</div>

// Emphasized card ("gold-line")
<div className="gold-line rounded-2xl border bg-white p-6">…</div>
```

Interactive/clickable cards (e.g. an animal profile card): `transition-transform hover:-translate-y-1 hover:shadow-md`.
Dark cards (used sparingly, e.g. a summary stat block): `bg-pasture-950 text-white`.
Radius scale: `rounded-lg` (buttons/inputs) → `rounded-xl`/`rounded-2xl` (cards, most common) → `rounded-3xl` (large feature cards). Never sharp corners.

### 4.3 Section heading

```tsx
<span className="rounded-full border border-harvest-400/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-harvest-700">
  Eyebrow Label
</span>
<h2 className="font-heading text-3xl font-semibold text-pasture-950 sm:text-4xl">Title</h2>
<span className="h-px w-16 bg-harvest-400" />
<p className="max-w-2xl text-pasture-700">Optional supporting description.</p>
```

On a dark background: `border-harvest-400/40 text-harvest-300` (eyebrow), `text-white` (title), `text-pasture-100` (description).

### 4.4 Page hero banner (interior pages)

```tsx
<div className="bg-pasture-950 py-16 text-center text-white sm:py-20">
  <span className="rounded-full border border-harvest-400/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-harvest-300">
    Eyebrow
  </span>
  <h1 className="font-heading text-4xl font-bold sm:text-5xl">Page Title</h1>
  <span className="h-px w-16 bg-harvest-400" />
  <p className="max-w-2xl text-pasture-100">Optional description</p>
</div>
```

### 4.5 Badges

```tsx
<Badge variant="outline" className="gold-line text-pasture-800">Healthy</Badge>
```

### 4.6 Header / Navigation

- Sticky, `bg-background/95 backdrop-blur`, `border-b border-pasture-100`.
- Desktop: horizontal links + shadcn `DropdownMenu` for nav items with children, plus a
  `btn-metallic` CTA on the far right (e.g. "Log Activity").
- Mobile (`< md`): hamburger opens a shadcn `Sheet` (slide-in drawer), flat indented list.
- Farm/logo switcher (for multi-farm owners/managers) lives in the header, left of the CTA.

### 4.7 Footer

`bg-pasture-950 text-pasture-100`, three-column grid (brand+tagline / quick links / contact),
logo in a white rounded badge (`rounded-xl bg-white px-4 py-2.5`) if the logo isn't
transparent-safe on dark. Bottom bar: centered copyright, `border-t border-pasture-800`,
`text-xs text-pasture-400`.

### 4.8 Forms

```css
.input-base {
  @apply rounded-lg border border-pasture-200 px-3 py-2 outline-none
         focus:border-harvest-500 focus:ring-2 focus:ring-harvest-400/40;
}
```

Every field: `<label>` above input, `text-sm font-medium text-pasture-900`.
Field logging forms (medicine, milk, tasks) should be optimized for fast thumb entry —
large tap targets, minimal required fields, numeric keypad for litres/dosage inputs.

## 5. Motion

```tsx
"use client";
import { motion } from "framer-motion";

export function AnimatedSection({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

Rules:
- Wrap each logical content block in its own `<AnimatedSection>` — not the whole page in one.
- Grids stagger via `delay={index * 0.05}` (or `0.1` for 2 items side by side).
- `viewport={{ once: true }}` — animates once on first scroll into view, never replays.
- Hero/dashboard-critical content is not animated on first load — only content below the fold.
- Hover lifts (`hover:-translate-y-1`) are plain CSS transitions, not Framer Motion.
- Respect `prefers-reduced-motion`.

## 6. Iconography

`lucide-react` exclusively.
- Inline icon next to text: `<Icon className="size-4" aria-hidden="true" />` before the text, `gap-1.5`–`gap-2` flex container.
- Icons `aria-hidden="true"` when paired with visible text.
- Icon color follows context: `text-harvest-600`/`text-harvest-700` for accent icons next to headings, `currentColor` inside buttons.
- Suggested farm-context icon mapping: cow/animal (`PawPrint` or custom), medicine (`Syringe`/`Pill`), milk (`Milk`/`GlassWater`), task done (`CheckCircle2`), task pending (`Circle`), sick/alert (`AlertTriangle`), notification (`Bell`).

## 7. Imagery

- Hero/banner photography: full-bleed, `object-cover`, dark gradient overlay for legible text:
  `bg-gradient-to-t from-pasture-950 via-pasture-950/70 to-pasture-950/40`.
- Animal profile photos: fixed aspect ratio (`aspect-[4/5]`), `object-cover`, rounded corners matching the card.
- Empty/missing-image state: never a broken image — solid `bg-pasture-100` (light) or `bg-pasture-950` (dark) placeholder with a muted icon or the animal's tag/initial centered in it.
- Logos on dark backgrounds: check for real transparency before placing directly; otherwise use a small white badge (see §4.7).

## 8. Layout Conventions

- Global content width: `mx-auto max-w-6xl px-4 sm:px-6` (reusable `Container` component).
- Vertical rhythm: sections `py-16` by default; dark/banner sections `py-16 sm:py-20`.
- Grids: `gap-5`/`gap-6`, responsive columns (`sm:grid-cols-2 lg:grid-cols-3`), never more than 3 columns for card grids.
- Mobile-first everywhere — this matters especially here since managers log activity from the field on phones: base styles target mobile, `sm:`/`md:`/`lg:` layer up, never the reverse.

## 9. Applying This to FarmSet — Checklist

- [ ] Scaffold Next.js + Tailwind v4 + shadcn/ui (`base-nova`) + Framer Motion + lucide-react (§1)
- [ ] Wire the pasture/harvest scales into `@theme inline` + `:root`/`.dark` exactly as in §2.2
- [ ] Set up the three fonts via `next/font/google`, matching §3
- [ ] Build shared primitives first, in order: `Container`, `SectionHeading`, `PageHero`, `AnimatedSection`, `.btn-metallic`/`.gold-line` utilities — every page/screen composes from these
- [ ] Build `Header` (sticky + farm switcher + mobile `Sheet`) and `Footer` once, shared via a route-group layout
- [ ] Reuse the exact card/badge/form/button class strings from §4 verbatim across dashboard, animal profiles, and logging screens — consistency comes from copying the same class combinations, not reinventing similar ones per screen
