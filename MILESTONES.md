# FarmSet — Prototype Milestone Tracker

**Product:** FarmSet — dairy farm management web app (mobile-friendly, installable/PWA-style)
**Value proposition:** *"Walk away from your farm without losing touch with it."*
**Client:** Dominic Njoka (Medtulek International) — Kiambu / Upperhill
**Goal of this phase:** interactive prototype for client review → quotation. Target rollout: before December 2026.
**Stack:** Supabase (DB, Auth, Storage, Realtime) + Vercel (hosting/deploy)

> Design reference: [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) — adapted from the client-provided reference system, with palette swapped to pasture green (structural) + harvest amber (accent).

> UX decision: the root URL (`/`) is the login form directly — no separate marketing landing page. This is a working tool, not a product to sell on first load.

---

## M0 — Project Setup
- [x] Scaffold web app (Next.js, App Router + TypeScript) in this repo
- [ ] Connect Supabase project (client/server SDK code + `supabase/schema.sql` are ready — needs a live project's URL/anon key in `.env.local`, see `.env.local.example`)
- [ ] Set up Supabase Auth (login screen is UI-only for now; not wired to a live account)
- [x] Base folder structure + lint/format config
- [ ] Connect this repo to a Vercel project and confirm a live deploy (needs your Vercel account access)

## M1 — Design System & Branding
- [x] Scaffold Next.js (App Router) + Tailwind v4 + shadcn/ui (`base-nova`) + Framer Motion + lucide-react
- [x] Wire pasture (green, structural) + harvest (amber, accent) token scales into `globals.css` (`@theme`, `:root`/`.dark`) per `DESIGN-SYSTEM.md` §2
- [x] Set up fonts: Geist Sans (body), Geist Mono, Playfair Display (headings) per §3
- [x] Build shared primitives: `Container`, `SectionHeading`, `PageHero`, `AnimatedSection`, `.btn-metallic`/`.gold-line` utilities per §4–§5
- [x] Build `Header` (sticky, farm switcher, mobile `Sheet` drawer), `Footer`, and a mobile bottom tab bar for the app shell
- [x] Core UI kit: buttons, inputs, cards, badges/status chips, tabs, tables, modals — reusing exact class patterns from §4

## M2 — Roles, Auth & Multi-Tenancy
- [x] Data model: `farms`, `profiles`, `farm_managers` (join table — many managers per farm, many farms per manager), `farm_owners` (join table — an owner can own/oversee multiple farms) — see `supabase/schema.sql`
- [x] Roles: **Owner**, **Manager** (workers/other roles noted as future if needed)
- [x] Row-Level Security policies written (owners/managers see only farms they belong to) — not yet applied to a live project
- [x] Farm switcher UI (for owners/managers tied to multiple farms) — built and working against demo data
- [ ] Invite flow: owner invites a manager to a specific farm (UI stub only — "Invite manager" button not yet functional)
- [ ] Onboarding: create first farm, add first manager (needs live Supabase auth first)

## M3 — Cow / Livestock Profiles
- [x] Data model: `animals` table (farm-scoped) — see `supabase/schema.sql`
- [x] Fields: name/tag number, breed (Friesian, Holstein, Ayrshire, Jersey, Guernsey, Pedigree Cross), age (from DOB), sex, status (healthy/sick/pregnant/dry)
- [x] Animal list view (per farm or all farms) with search + status filter
- [x] Animal profile page: bio details + tabbed medicine/milk history
- [ ] Add/edit/retire animal (not yet built — next pass)

## M4 — Daily Operations Logging (Manager-facing, mobile-first)
- [x] Medicine/treatment log form: animal, medicine, dosage, notes — large tap targets, phone-first
- [x] Milk production log form: animal (optional/herd-level), litres, session
- [x] Farm job/task log form: title, status
- [ ] "Sick/flagged animal" quick-flag action (status currently shown, not yet toggleable from the UI)
- [ ] Logs persisted + attributed to the logged-in manager (forms currently show a confirmation toast only — needs Supabase wiring to actually save)

## M5 — Owner Dashboard & Analytics
- [x] Daily summary view: sick/flagged animals, milk totals, jobs done vs. pending — the "what happened while I was away" view
- [x] Multi-farm rollup view (per-farm cards + farm switcher to drill into one)
- [x] Simple charts: 7-day milk yield bar chart + task-completion meter
- [x] Recent activity feed (who logged what, when) per farm

## M6 — Notifications
- [x] In-app notifications UI: sick animal flagged, overdue task, daily digest — with unread badges in header/bottom nav
- [ ] Notification triggers wired to live M4 log events (currently demo data, not event-driven)
- [ ] (Stretch) Email notification via Supabase + provider for daily/weekly digest

## M7 — Prototype Polish & Client Review
- [x] End-to-end demo data seeded (2 farms, 2 managers, 6 animals, logs, tasks, notifications) for client walkthrough
- [x] Mobile responsiveness pass — verified at 390×844 (mobile), 768×1024 (tablet), 1440×900 (desktop); bottom tab bar, Sheet drawer nav, stacking forms all confirmed working
- [x] Fix rough edges from internal QA (Base UI `nativeButton` a11y warnings, Select label display bug, ESLint/type errors — all resolved, clean production build)
- [ ] Deploy demo build to Vercel, share link with client for review (needs your Vercel account — see note below)
- [ ] Collect client feedback → informs final quotation scope

---

## To get this live (needs your account access)
1. **Vercel**: `vercel link` then `vercel --prod` from this repo, or connect the repo in the Vercel dashboard.
2. **Supabase**: create a project, run `supabase/schema.sql` in the SQL editor, then copy the project URL + anon key into Vercel's env vars (and a local `.env.local`, see `.env.local.example`). Until this is done, the app runs on the built-in demo data — fully clickable, nothing persists.
3. Once live, wire up real auth on `/login` and connect the logging forms in `/dashboard/log` to actually write to Supabase (M2/M4 remaining items above).

## Phase 2 (post-prototype, informs quotation — not in this build)
- [ ] Paid training-content section for farmers
- [ ] Native mobile app derived from the web app (inherits all web features)
- [ ] Additional roles (e.g. farm worker, vet) if requested
- [ ] Advanced analytics (breeding cycles, cost tracking, feed management)
