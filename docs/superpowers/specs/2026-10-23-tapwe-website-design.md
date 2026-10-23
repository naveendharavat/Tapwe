# Tapwe — Website & API Design

**Date:** 2026-10-23
**Status:** Draft — awaiting approval
**Design reference:** `docs/design/tapwe-design.html` (the approved UI prototype; open it in a browser to see every screen)

---

## 1. What Tapwe is, and why this exists

Tapwe sells **smart NFC + QR business cards**. Each physical PVC card carries an NFC chip and a printed QR code. Both open the **same permanent URL** (`https://tapwe.example/c/<cardId>`). The card's owner decides what that URL opens — their digital business profile, a menu, a feedback form, or any website link — and the Tapwe team can change it at any time **without reprinting the card**.

This project builds the Tapwe website: the public marketing site, the card request flow, and the customer dashboard where owners see their cards — plus the backend that makes the printed card link actually work.

**Success looks like:** a business owner can land on the site, request a card, sign up, see their card in the dashboard, and anyone who taps/scans the physical card reaches the right destination, with the tap counted.

---

## 2. Goals

1. **Faithful implementation of the approved design.** The React app must look and behave like `docs/design/tapwe-design.html` — same colors, fonts, spacing, animations, copy, and interactions. The design file is the source of truth for UI.
2. **A real backend.** NestJS + TypeORM + MySQL serving: sign-up/sign-in, card requests, the owner's cards, the digital profile, change requests, and tap analytics. No fake data in production screens.
3. **Working public card resolution.** `GET /c/:cardId` opens the configured destination (hosted profile page, or redirect to a URL) and records a tap event.
4. **All pages from the design**, not a subset:
   - Marketing: Home, Features, How It Works, Pricing (placeholder), Request a Card, Privacy/Terms/Support stubs
   - Auth: Sign In, Sign Up
   - Dashboard: Overview, My Cards, Request a Card, QR Code, Digital Profile, Destinations, Analytics, Account Settings
   - Public: the card resolution page

## 3. Non-goals (v1)

- **No payments or real pricing.** The Pricing page ships with the design's placeholder content.
- **No NFC writing from the browser.** Cards are programmed by the Tapwe team with an external NFC app (the design's instructions tab stays as help text).
- **No admin web UI.** Card provisioning and request handling happen through admin-only API endpoints (callable via Postman/curl); admin screens are a later phase.
- **No hosted menus or hosted feedback forms.** In v1 a "menu" or "feedback form" destination is just an external URL the owner provides (Google Form, hosted menu link, etc.). Only the **digital profile** is hosted by Tapwe.
- **No email sending** (no verification or notification emails).
- **No i18n** — English only.

## 4. Anti-goals (things that would make this a failure)

- A dashboard that quietly shows hardcoded numbers. Every figure a customer sees must come from the API. (The design file's "Demo data" badges exist because it is a static prototype — they must **not** ship.)
- A restyled site. New fonts, different colors, "improved" layouts — all failures. The design is approved as-is.
- Over-engineering. This is one SPA and one API. No microservices, no RabbitMQ, no Module Federation, no monorepo tooling (nx/turbo).

---

## 5. Constraints

- **Frontend stack (fixed by owner):** React + TypeScript, Vite, the folder shape below.
- **Backend stack (fixed by owner):** NestJS + TypeORM.
- **Repo:** this repository (`Tapwe`), two top-level app folders (see §6).
- Developer machine: macOS, Node 18+. Database must be runnable locally.

---

## 6. How it gets made — decided choices

Choices marked **(my call)** were made by the spec author, not the owner; flag any you want changed before building.

| Area | Decision |
|---|---|
| Repo layout | `tapwe-web/` (frontend) and `tapwe-server/` (backend) side by side in this repo **(my call)** |
| Frontend build | Vite + React 18 + TypeScript |
| Routing | `react-router-dom` v6 with `BrowserRouter` — real paths (`/features`, `/app/cards`), not the prototype's hash routes **(my call)** |
| Styling | Plain global CSS: port the design file's `<style>` block into `src/styles/globals.css`, keeping the CSS custom properties and class names. No Tailwind, no CSS-in-JS **(my call — simplest faithful port)** |
| Data fetching | `axios` + `@tanstack/react-query` **(my call)** |
| Forms & validation | `react-hook-form` + `yup`, reusing the exact rules in the design file (email, password ≥ 8, Indian 10-digit mobile `^[6-9]\d{9}$` with +91/0 normalization, http(s) URL check) |
| Icons | The design's inline SVG icon set, ported to one `Icon` component (keeps the exact artwork) **(my call)** |
| Backend shape | Plain NestJS **REST** controllers (`@Get`/`@Post`…), not CampX-style `@MessagePattern` — this is a standalone product with one server **(my call)** |
| Database | **MySQL 8** with TypeORM migrations (no `synchronize` in prod) **(my call — matches owner's experience; Postgres is a drop-in swap if preferred)** |
| Auth | Email + password, bcrypt hashing, JWT access token returned in the response body and stored by the SPA; `Authorization: Bearer` header on API calls **(my call)** |
| Validation (API) | `class-validator` DTOs mirroring the frontend yup rules |
| QR codes | Dashboard QR for a real card is a **real scannable QR** (npm `qrcode`, SVG output) encoding the card URL. The decorative QR generator from the design stays for marketing mockups only **(my call — the prototype's placeholder QR would be useless on a real card)** |
| Card IDs | 6-character lowercase base36 code (like the design's `ab12cd`), collision-checked, permanent |
| Card deletion | Soft delete (`deletedAt`). A printed card's code must never be reusable **(my call)** |

---

## 7. Frontend

### 7.1 Folder structure (owner's tree, extended)

```
tapwe-web/src/
├── components/
│   ├── ui/            Button, Input, Select, Textarea, Card, Badge, Dialog,
│   │                  Dropdown(menu), Tabs, Toast, Skeleton, EmptyState, Icon
│   ├── layout/        Navbar, Footer, MarketingLayout,
│   │                  DashboardLayout (sidebar + topbar + mobile drawer)
│   ├── cards/         SmartCardPreview (4 themes: brand/insta/menu/review),
│   │                  QRCodePreview (decorative + real modes), PhoneMockup
│   └── home/          Hero, Marquee, HowItWorksSteps, DemoSection,
│                      BentoFeatures, UseCases, Showcase, TeamSection, CtaBand
├── pages/
│   ├── Home.tsx  Features.tsx  HowItWorks.tsx  Pricing.tsx  Request.tsx
│   ├── Legal.tsx (privacy/terms/support stubs)
│   ├── SignIn.tsx  SignUp.tsx
│   ├── PublicCard.tsx            ← /c/:cardId resolution page
│   └── dashboard/   Overview, MyCards, RequestCard, QrCode, Profile,
│                    Destinations, Analytics, Settings
├── services/        api.ts (axios instance) + per-resource service & query hooks
│                    (auth, cards, cardRequests, profile, analytics)
├── hooks/           useToast, useAuth, useReveal (IntersectionObserver)
├── lib/             validation schemas (yup), formatters
├── styles/globals.css
├── App.tsx          routes + providers
└── main.tsx
```

### 7.2 Fidelity rules

- Port the design's CSS verbatim (class names included); components render the same markup the prototype builds with strings.
- Keep: `prefers-reduced-motion` handling, focus-visible styles, aria attributes, scroll-reveal (`.rv`/`.in`), the auto-cycling demo tabs, toasts, the `<dialog>`-based confirms, mobile nav + dashboard drawer behavior, table loading/error/empty states.
- The marketing site's interactive pieces (demo section, card fan, hero chips) stay purely presentational.

### 7.3 Behavior changes from prototype → real app

| Prototype behavior | Real app |
|---|---|
| Request form fakes success after 700 ms | `POST /card-requests`; success panel shows the submitted summary (same UI) |
| Sign-in/up fake a session and jump to `#/app` | Real auth against the API; dashboard routes guarded (redirect to `/sign-in`) |
| Dashboard seeds 3 demo cards in JS | `GET /cards` for the signed-in owner; empty state when none |
| "Request a change" toast only | `POST /cards/:id/change-requests` |
| Delete removes from JS array | Soft delete via API, same confirm dialog |
| Analytics bar chart with hardcoded week | `GET /analytics/summary` (taps per day, last 7 days + totals) |
| Profile/Settings forms toast only | Real `PUT /profile`, `PATCH /users/me` |
| QR download serializes the placeholder SVG | Downloads the real QR SVG for that card |
| "Demo data" badges everywhere | Removed |

The prototype also contains a 3-step **create-card wizard** (`ccBody`) that is no longer reachable from its own nav (its "Request a Card" page replaced it with the request flow). The real app follows the nav: **customers request cards; they don't self-create them.** The wizard is not built.

---

## 8. Backend

### 8.1 Modules

`auth`, `users`, `profiles`, `cards`, `card-requests`, `change-requests`, `analytics`, `public`, `admin`, `health`.

### 8.2 Entities (TypeORM, MySQL)

| Entity | Fields (beyond id/timestamps) |
|---|---|
| `User` | name, email (unique), passwordHash, role enum `owner` \| `admin` |
| `Profile` | userId (unique FK), businessName, description, phone, website — the hosted digital profile (one per owner, per the design's Profile page) |
| `Card` | id = 6-char public code (PK, string), userId FK (nullable until claimed), ownerEmail (nullable — pending-claim email, see §8.5), name, status enum `draft` \| `active` \| `paused`, destinationType enum `profile` \| `url` \| `menu` \| `form` (menu/form/url all resolve as URL; the enum keeps the dashboard's labels), destinationUrl (nullable), deletedAt |
| `CardRequest` | name, businessName, email, phone, businessType, quantity, destinations (JSON array of the picked pills), city?, note?, agreed, status enum `new` \| `contacted` \| `fulfilled`, userId? |
| `ChangeRequest` | cardId FK, message, status enum `open` \| `done` |
| `TapEvent` | cardId FK, happenedAt, userAgent? |

### 8.3 Endpoints

**Public (no auth)**
- `POST /card-requests` — the marketing Request form
- `GET /public/cards/:cardId` — resolution: returns `{ destinationType, url }` or `{ destinationType: 'profile', profile: {...} }`; records a TapEvent. 404 for unknown/deleted; a `draft`/`paused` card returns a "not active" state the frontend renders politely.

**Auth**
- `POST /auth/sign-up` `{name,email,password}` → `{token, user}`
- `POST /auth/sign-in` → `{token, user}`
- `GET /auth/me`

**Owner (JWT)**
- `GET /cards` · `GET /cards/:id` · `DELETE /cards/:id` (soft)
  *(No owner rename endpoint: the design's card-actions menu has no rename control — Copy URL / View QR / Request a change / Delete only. Renames go through the admin endpoint. — my call, from builder review)*
- `POST /cards/:id/change-requests`
- `GET /profile` · `PUT /profile`
- `PATCH /users/me` (name/email — Settings page)
- `GET /analytics/summary` → `{ perDay: [{date, count}×7], totals: {cards, active, taps} }`

**Admin (JWT + role=admin; no UI in v1)**
- `GET /admin/card-requests` · `PATCH /admin/card-requests/:id` (status)
- `POST /admin/cards` — provision: generate code, set `ownerEmail`, destination, status
- `PATCH /admin/cards/:id` — rename, reassign owner, change destination/status

### 8.5 Card claiming (how a card reaches its owner's dashboard) — my call, from builder review

Provisioning and sign-up can happen in either order:

1. The team provisions a card with the customer's **`ownerEmail`** (from the card request). If a user with that email already exists, `userId` is set immediately.
2. Otherwise the card waits unclaimed. At **sign-up**, any cards whose `ownerEmail` matches the new account's email are attached (`userId` set) automatically — the customer signs up and their card is already in the dashboard.
3. `PATCH /admin/cards/:id` can correct the owner later (typo'd email, transfers).

### 8.4 Cross-cutting

- Global `ValidationPipe` (whitelist, transform). DTO rules mirror §6's validation row.
- Consistent error shape `{statusCode, message}`; frontend toasts the message.
- CORS allowing the web app origin. `.env` for DB/JWT config, with `.env.example` committed.
- Seed script (dev only): one admin, one demo owner, three cards matching the design's sample data, a week of tap events — so the dashboard looks like the design during development.

---

## 9. What's left to the builder

- React Query key naming, component prop shapes, file-by-file breakdown (plan territory).
- Exact CSS organization inside `globals.css` (one file is acceptable).
- Dev DB setup choice (local MySQL vs Docker compose file) — provide one working path.
- Pagination is unnecessary at v1 volumes; skip unless trivial.

## 10. Phases (build order)

1. **Scaffold + design system** — both apps boot; globals.css ported; ui/ + layout/ + cards/ components rendered in isolation.
2. **Marketing site** — all public pages, static, pixel-matched against the prototype.
3. **Backend core** — entities, migrations, auth, card-requests; Request form goes live.
4. **Dashboard** — auth guard, cards list/menus/dialogs, profile, destinations, settings, change requests.
5. **Public resolution + analytics** — `/c/:cardId`, tap events, real QR, analytics page.

Each phase ends with typecheck + lint green and a manual walkthrough against the design file.

## 11. Open questions for the owner

**Blocking (no approved design exists for this):**

1. **What does the public card page (`/c/:cardId`) look like?** The design file has no such page — yet it's what every physical tap/scan lands on. Needed: the hosted **profile** view, a **card not active** state (draft/paused), and an **unknown card** 404.
   *Recommended default:* build the profile view from the design's phone-screen mockup (avatar, business name, description, Call/Map/Social/Website tiles, "Save contact" button) as a real mobile page in the same design system; URL-type destinations redirect immediately (no page); not-active/404 are simple centered messages reusing the design's empty-state style.

**Defaults that proceed unless overridden:**

2. **Database:** MySQL 8 (Postgres is a drop-in swap).
3. **Public URL:** `/c/:cardId` on the same domain for v1.
4. **No admin UI in v1:** the team provisions cards via API calls/seed scripts.
