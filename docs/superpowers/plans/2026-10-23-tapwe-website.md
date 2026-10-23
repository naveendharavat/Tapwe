# Tapwe Website & API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Tapwe marketing site, customer dashboard, and public card page (React + Vite), backed by a NestJS + TypeORM + MySQL API.

**Architecture:** Two apps in one repo: `tapwe-server/` (NestJS REST, one module per resource, controller → service → repository layering) and `tapwe-web/` (Vite SPA, the design file's CSS ported verbatim, static service classes + React Query hooks per resource). The SPA talks to the API over `VITE_API_URL` with a Bearer JWT.

**Tech Stack:** Node 22, NestJS 10, TypeORM 0.3, MySQL 8+ (local Homebrew MySQL 9 is fine), `@nestjs/jwt`, `bcrypt`, `class-validator`, Jest + supertest; React 18, Vite 5, TypeScript 5, react-router-dom 6, @tanstack/react-query 5, axios, react-hook-form + yup, `qrcode`, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-23-tapwe-website-design.md` — UI source of truth: `docs/design/tapwe-design.html`.

## Global Constraints

- UI must match `docs/design/tapwe-design.html`: CSS ported verbatim (tokens + class names), same copy, same icons (inline SVG paths from the `P` map), Inter font.
- No "Demo data" badges, "Design preview only" lines, or hardcoded figures in shipped screens.
- Validation rules (frontend yup and backend class-validator agree): email required + valid; password required, sign-up min 8; phone normalized (strip spaces/`-()`; if >10 chars strip leading `+91`/`91`/`0`) then `^[6-9]\d{9}$`; URLs must parse with protocol `http:`/`https:`.
- Error messages copied from the design's `msg` object, e.g. `Enter your name.`, `Enter a valid email address.`, `Use at least 8 characters.`, `Enter a valid 10-digit mobile number.`, `Choose at least one option.`, `Please confirm to continue.`.
- Card code: 6 chars `[a-z0-9]`, permanent, never reused (soft delete only).
- Card URL shown to users: `${PUBLIC_CARD_BASE_URL}/c/${code}` (web env `VITE_PUBLIC_CARD_BASE_URL`, default `window.location.origin`).
- No `synchronize: true`; schema changes go through migrations.
- **Never `git commit`.** Each task's final step saves a patch backup to the scratchpad instead.
- Comments: at most one short line, only for non-obvious constraints.

## Review Focus

1. **Duplicate email at sign-up / re-request** → sign-up returns 409 `An account with this email already exists.`; card requests from the same email are allowed (Task 3, Task 4 tests).
2. **Owner touching another owner's card** (`GET/DELETE /cards/:id`, change requests) → 404, never 403-leaks existence (Task 5 test).
3. **Tapping a deleted / draft / paused / unknown card** → deleted & unknown = 404 page; draft/paused = "not active" page; none record a tap (Task 7 test).
4. **Email case/whitespace** (`  Foo@Bar.com `) → trimmed + lowercased everywhere, so claim-on-sign-up still matches the provisioned `ownerEmail` (Task 3 test).
5. **Expired/invalid JWT on a dashboard route** → API 401 → SPA clears token and redirects to `/sign-in` (Task 9 test).

---

## File Structure

```
tapwe-server/
  src/main.ts, app.module.ts
  src/config/{configuration.ts, typeorm.config.ts, data-source.ts}
  src/common/{guards/jwt-auth.guard.ts, guards/roles.guard.ts, decorators/{current-user,roles,public}.decorator.ts,
              utils/{normalize.ts, card-code.ts}}
  src/database/migrations/<ts>-Init.ts, src/database/seed.ts
  src/modules/<name>/{<name>.module.ts, <name>.controller.ts, <name>.service.ts, <name>.repository.ts,
                      entities/*.entity.ts, dto/*.dto.ts, <name>.service.spec.ts}
    names: users, auth, profiles, cards, card-requests, change-requests, analytics, public, admin, health
  test/app.e2e-spec.ts
tapwe-web/
  src/main.tsx, App.tsx, routes.tsx, styles/globals.css
  src/components/ui/{Button,Input,Select,Textarea,Field,Card,Badge,Dialog,Dropdown,Tabs,Skeleton,EmptyState,Icon,icons.ts}.tsx
  src/components/toast/{ToastProvider.tsx, useToast.ts}
  src/components/layout/{Navbar,Footer,MarketingLayout,DashboardLayout,Logo}.tsx
  src/components/cards/{SmartCardPreview,QRCodePreview,PhoneMockup,CardFan}.tsx, decorativeQr.ts
  src/components/home/{Hero,Marquee,HowSteps,DemoSection,Bento,UseCases,Showcase,TeamSection,CtaBand}.tsx
  src/pages/{Home,Features,HowItWorks,Pricing,Request,Legal,SignIn,SignUp,PublicCard}.tsx
  src/pages/dashboard/{Overview,MyCards,RequestCard,QrCode,Profile,Destinations,Analytics,Settings}.tsx
  src/services/{api.ts, auth/, cards/, card-requests/, profile/, analytics/, public/}  each: <x>.service.ts, <x>.queries.ts, <x>.types.ts
  src/auth/{AuthProvider.tsx, RequireAuth.tsx, token.ts}
  src/lib/{validation.ts, cardUrl.ts}
  src/hooks/useReveal.ts
```

---

### Task 1: Server scaffold, config, health

**Files:** Create `tapwe-server/` via `npx @nestjs/cli@10 new tapwe-server --package-manager yarn --skip-git`; add `src/config/*`, `src/modules/health/*`, `.env.example`, `test/app.e2e-spec.ts`.

**Interfaces — Produces:** env keys `PORT=4000, DB_HOST, DB_PORT=3306, DB_USER, DB_PASSWORD, DB_NAME=tapwe, JWT_SECRET, JWT_EXPIRES_IN=7d, WEB_ORIGIN=http://localhost:5173`; `GET /health → {status:'ok'}`; global prefix none; global `ValidationPipe({whitelist:true, transform:true, forbidNonWhitelisted:true})`; `data-source.ts` exporting `AppDataSource` for the TypeORM CLI; scripts `migration:generate`, `migration:run`, `seed`.

- [ ] Step 1: e2e test `GET /health` → 200 `{status:'ok'}`. Run `yarn test:e2e` → FAIL.
- [ ] Step 2: Implement ConfigModule (global), TypeOrmModule.forRootAsync (`autoLoadEntities`, `synchronize:false`, `migrationsRun:false`), CORS from `WEB_ORIGIN`, HealthModule.
- [ ] Step 3: Start MySQL (`brew services start mysql`), create DBs `tapwe` and `tapwe_test`; `yarn test:e2e` → PASS.
- [ ] Step 4: Backup: `git add -N . && git diff > $SCRATCH/task1.patch`.

### Task 2: Entities + initial migration

**Files:** entity files under each module; `src/database/migrations/<ts>-Init.ts`; `src/common/utils/{normalize.ts, card-code.ts}` + specs.

**Interfaces — Produces:**
- `User {id:number, name, email(unique), passwordHash, role:'owner'|'admin', createdAt, updatedAt}`
- `Profile {id, userId(unique), businessName, description, phone, website, updatedAt}` (all strings nullable except userId)
- `Card {code:string(PK,6), userId:number|null, ownerEmail:string|null, name, status:'draft'|'active'|'paused', destinationType:'profile'|'url'|'menu'|'form', destinationUrl:string|null, createdAt, updatedAt, deletedAt}` (`@DeleteDateColumn`)
- `CardRequest {id, name, businessName, email, phone, businessType, quantity, destinations:string[] (json), city|null, note|null, agreed:boolean, status:'new'|'contacted'|'fulfilled', userId|null, createdAt}`
- `ChangeRequest {id, cardCode, message, status:'open'|'done', createdAt}`
- `TapEvent {id, cardCode, happenedAt, userAgent|null}` indexed `(cardCode, happenedAt)`
- `normalizeEmail(v:string):string` (trim + lowercase); `normalizePhone(v:string):string` (rule in Global Constraints); `generateCardCode(rand?:()=>number):string`.

- [ ] Step 1: Specs: `normalizeEmail('  Foo@Bar.com ')==='foo@bar.com'`; `normalizePhone('+91 98765-43210')==='9876543210'`, `normalizePhone('09876543210')==='9876543210'`; `generateCardCode()` matches `/^[a-z0-9]{6}$/`. Run → FAIL.
- [ ] Step 2: Implement utils + entities; `yarn migration:generate src/database/migrations/Init`; `yarn migration:run`. Specs PASS; `SHOW TABLES` lists 6 tables.
- [ ] Step 3: Backup patch.

### Task 3: Users + Auth (with card claiming)

**Files:** `modules/users/*`, `modules/auth/*`, `common/guards/*`, `common/decorators/*`.

**Interfaces — Consumes:** `User`, `Card`, `normalizeEmail`. **Produces:**
- `POST /auth/sign-up {name,email,password}` → `201 {token, user:{id,name,email,role}}`; `POST /auth/sign-in` → `200` same shape, wrong creds → 401 `Incorrect email or password.`; `GET /auth/me` → user.
- `PATCH /users/me {name?, email?}` → user (409 on taken email).
- `JwtAuthGuard` registered globally; `@Public()` opts out; `@CurrentUser()` yields `{id, role}`; `@Roles('admin')` + `RolesGuard`.
- `CardsRepository.claimByEmail(email:string, userId:number):Promise<number>` (defined here in `modules/cards/cards.repository.ts`, reused in Task 5).

- [ ] Step 1: `auth.service.spec.ts` (mocked repos): sign-up hashes password (stored ≠ plain); duplicate email → `ConflictException('An account with this email already exists.')`; sign-up with `' Owner@X.com '` calls `claimByEmail('owner@x.com', newId)`; sign-in wrong password → `UnauthorizedException`. Run → FAIL.
- [ ] Step 2: Implement (bcrypt cost 10, JWT payload `{sub, role}`); sign-up also creates an empty `Profile`. Specs PASS.
- [ ] Step 3: e2e: sign-up → me with token 200; me without token 401.
- [ ] Step 4: Backup patch.

### Task 4: Card requests (public submit + admin)

**Files:** `modules/card-requests/*`, `modules/admin/admin.controller.ts` (request routes).

**Interfaces — Produces:** `POST /card-requests` (`@Public`) body `{name, businessName, email, phone, businessType, quantity, destinations:string[], city?, note?, agreed:true}` → `201 {id}`; `GET /admin/card-requests?status=` → list newest first; `PATCH /admin/card-requests/:id {status}`.
Allowed `businessType`: the design's `reqTypes`; `quantity`: `reqQty`; `destinations`: values from `reqDest` labels, min 1.

- [ ] Step 1: e2e: valid body → 201; phone `12345` → 400 with message `Enter a valid 10-digit mobile number.`; `agreed:false` → 400; same email twice → both 201; owner token on `/admin/card-requests` → 403.
- [ ] Step 2: Implement DTO (`@Transform` normalizers, `@Matches`, `@IsIn`, `@ArrayMinSize(1)`, custom messages) + service + repo. PASS.
- [ ] Step 3: Backup patch.

### Task 5: Cards, change requests, admin provisioning

**Files:** `modules/cards/*`, `modules/change-requests/*`, `modules/admin/*`.

**Interfaces — Produces:**
- `GET /cards` → `CardDto[]` `{code, name, status, destinationType, destinationUrl, destinationLabel, url}` for current user, newest first. `destinationLabel`: profile → `Profile: <businessName>` or `Digital profile`; else destinationUrl.
- `GET /cards/:code`, `DELETE /cards/:code` (soft) → 204; other owner's/unknown → 404.
- `POST /cards/:code/change-requests {message (1–500)}` → 201.
- `POST /admin/cards {name, ownerEmail?, status?, destinationType, destinationUrl?}` → card (retries code on collision, max 5; resolves `userId` if email matches a user; `destinationUrl` required + http(s) unless type is profile).
- `PATCH /admin/cards/:code {name?, ownerEmail?, status?, destinationType?, destinationUrl?}`.

- [ ] Step 1: Specs/e2e: owner A cannot GET/DELETE/change-request owner B's card (404); deleted card disappears from `GET /cards`; admin create with existing user's email sets `userId`; `destinationType:'url'` without URL → 400; `generateCardCode` collision retried (mock repo returns exists once).
- [ ] Step 2: Implement. PASS.
- [ ] Step 3: Backup patch.

### Task 6: Profile

**Files:** `modules/profiles/*`.

**Interfaces — Produces:** `GET /profile` → `{businessName, description, phone, website}`; `PUT /profile` same body (all optional; `website` http(s) if set; `phone` normalized + pattern if set).

- [ ] Step 1: e2e: PUT then GET round-trips; `website:'ftp://x'` → 400 `Enter a full link starting with https://`.
- [ ] Step 2: Implement. PASS. Backup patch.

### Task 7: Public resolution + analytics

**Files:** `modules/public/*`, `modules/analytics/*`.

**Interfaces — Produces:**
- `GET /public/cards/:code` (`@Public`) →
  `{state:'redirect', url}` | `{state:'profile', profile:{businessName, description, phone, website}}` | `{state:'inactive'}`; unknown/deleted → 404. Records `TapEvent` only for `redirect`/`profile`.
- `GET /analytics/summary` → `{perDay:[{date:'YYYY-MM-DD', count}] (7 entries, oldest first, zero-filled, ending today), totals:{cards, active, drafts, taps}}` for current user's cards.

- [ ] Step 1: Tests: paused card → `inactive`, tap count unchanged; deleted → 404; active url card → redirect + 1 tap; `perDay` has 7 entries with zero-fill (service spec with fixed clock).
- [ ] Step 2: Implement (group by `DATE(happenedAt)` in SQL, zero-fill in service). PASS.
- [ ] Step 3: Backup patch.

### Task 8: Seed script

**Files:** `src/database/seed.ts`.

**Produces:** admin `admin@tapwe.in` / `admin12345`; owner `demo@tapwe.in` / `demo12345` with profile `Your Business` / `Café · Open until 10 pm`; cards `ab12cd` "Front desk card" active profile, `k9f2xq` "Table menu" active menu `https://example.com/menu`, `m4t8zr` "Feedback card" draft form `https://forms.example.com/feedback`; tap events matching the design week `[12,18,9,24,30,38,21]`. Idempotent (skips if admin exists).

- [ ] Step 1: `yarn seed` twice → no error; `GET /cards` as demo returns 3. Backup patch.

### Task 9: Web scaffold, design system, API client, auth

**Files:** `tapwe-web/` via `yarn create vite tapwe-web --template react-ts`; `styles/globals.css`; `components/ui/*`; `components/toast/*`; `services/api.ts`; `auth/*`; `lib/*`; `App.tsx`, `routes.tsx`, `main.tsx`.

**Interfaces — Produces:**
- `globals.css` = design `<style>` block (lines 12–431) verbatim, plus Google Fonts Inter link in `index.html`.
- `<Icon name={IconName} className? />` from `icons.ts` (`P` map); `Button` props `{variant:'p'|'s'|'g'|'d'|'w'|'o', size?:'sm'|'lg', icon?:boolean, loading?:boolean, as?: 'a'|Link}` → classes `btn btn-<v>`.
- `useToast(): {toast(msg:string, tone?:'ok'|'error')}`; `<Dialog open onClose title description>`; `<Dropdown>` menu with Escape/outside-click close.
- `api` axios instance (`baseURL: import.meta.env.VITE_API_URL`), attaches token, on 401 → `clearToken()` + `window.location.assign('/sign-in')`; `getErrorMessage(e):string`.
- `AuthProvider` → `useAuth(): {user, signIn(dto), signUp(dto), signOut(), isLoading}`; `<RequireAuth>` redirects to `/sign-in`.
- `lib/validation.ts`: yup schemas `signInSchema, signUpSchema, requestSchema, profileSchema, settingsSchema, changeRequestSchema` (rules + messages from Global Constraints).
- `cardUrl(code:string):string`.

- [ ] Step 1: Vitest: `requestSchema` rejects phone `12345` with `Enter a valid 10-digit mobile number.` and accepts `+91 98765 43210`; `signUpSchema` rejects 7-char password with `Use at least 8 characters.`; api 401 interceptor clears token (mock adapter).
- [ ] Step 2: Implement. `yarn test` PASS, `yarn build` PASS.
- [ ] Step 3: Backup patch.

### Task 10: Layouts + card mockup components

**Files:** `components/layout/*`, `components/cards/*`, `hooks/useReveal.ts`.

**Interfaces — Produces:** `<MarketingLayout>` (Navbar with active link + burger/mobile nav, Footer, `<Outlet/>`); `<SmartCardPreview theme:'brand'|'insta'|'menu'|'review' seed?:string/>`; `<QRCodePreview value?:string seed?:string/>` — `value` → real QR via `qrcode.toString(value,{type:'svg'})`, else decorative pattern (port of design `qr()`); `<PhoneMockup>{children}</PhoneMockup>`, `ProfileScreen` (design `profileInner`, props override name/description); `<CardFan/>`; `useReveal()` adds `.in` to `.rv` via IntersectionObserver, respects reduced motion.

- [ ] Step 1: Vitest: `SmartCardPreview theme="menu"` renders `OUR` and `MENU`; `QRCodePreview value="https://x"` renders an `<svg>` without the decorative aria-label.
- [ ] Step 2: Implement. PASS. Backup patch.

### Task 11: Marketing pages

**Files:** `components/home/*`, `pages/{Home,Features,HowItWorks,Pricing,Legal}.tsx`.

Content arrays (`features`, `steps`, `cases`, `tag`, `demoTabs`, feature `rows`, how-it-works `f`, `plans`, `legal`, `team`) copied verbatim from the design into the component that uses them. DemoSection auto-cycles every 4200 ms (paused under reduced motion, stops on click). `/#use-cases`, `/#team` anchors scroll.

- [ ] Step 1: Run `yarn dev`, open each route side by side with `docs/design/tapwe-design.html` at 1280px and 375px; screenshot-compare with Playwright. Visual diffs fixed.
- [ ] Step 2: `yarn build` PASS. Backup patch.

### Task 12: Request page + Sign in / Sign up

**Files:** `pages/{Request,SignIn,SignUp}.tsx`, `services/card-requests/*`, `services/auth/*`.

Behavior: Request form = design markup + `requestSchema`; first invalid field focused; errors clear as user fixes them; submit → `POST /card-requests`, then the design's "Request received" panel (dropping the "design preview" sentence) + "Submit another request" resets. Auth pages = design split layout; password show/hide; on success toast (`Account created.` / `Signed in.`) and navigate to `/app`; server errors shown in toast.

- [ ] Step 1: Vitest (RTL): submitting empty Request form shows `Enter your name.` and focuses `#rq-name`.
- [ ] Step 2: Implement; manual: submit real request → row in DB; sign up → lands on `/app`. Backup patch.

### Task 13: Dashboard shell, Overview, My Cards, Destinations

**Files:** `components/layout/DashboardLayout.tsx`, `pages/dashboard/{Overview,MyCards,Destinations}.tsx`, `services/cards/*`, `services/analytics/*`.

Behavior: sidebar nav (8 items, design order/icons), mobile drawer, user menu (Account Settings / Sign out). Overview: promo band, 3 stats from `totals` (Total cards / Active / Drafts), recent 5 cards table. My Cards: status tabs `all/active/draft/paused` (client filter), skeleton while loading, error state with Try again (refetch), empty state; row menu: Copy card URL / View QR code (`/app/qr?card=code`) / Request a change (dialog → change request) / Delete card (confirm dialog). Destinations: read-only list + "Go to My Cards".

- [ ] Step 1: Vitest: MyCards with mocked query error renders `We couldn’t load your cards`; empty list renders `No cards yet`.
- [ ] Step 2: Implement; manual with seeded demo user. Backup patch.

### Task 14: QR, Profile, Analytics, Settings, Request Card pages

**Files:** `pages/dashboard/{QrCode,Profile,Analytics,Settings,RequestCard}.tsx`, `services/profile/*`.

Behavior: QR page — card select (`?card=` param), real QR for `cardUrl(code)`, Copy URL, Download QR (SVG, filename `tapwe-<code>.svg`), hint "The NFC chip and this QR code open the same link." Profile — form + live PhoneMockup preview updating as you type; save via `PUT /profile`. Analytics — bars from `perDay` (weekday labels from dates), heights relative to max (all-zero → flat), total taps line. Settings — name/email via `PATCH /users/me`, updates auth user. RequestCard — design's 3-step explainer linking to `/request`.

- [ ] Step 1: Vitest: Analytics with `perDay` all zeros renders 7 bars without NaN heights.
- [ ] Step 2: Implement; manual check. Backup patch.

### Task 15: Public card page

**Files:** `pages/PublicCard.tsx`, `services/public/*`; route `/c/:code` outside both layouts.

Behavior: `redirect` → `window.location.replace(url)` (show "Opening…" meanwhile); `profile` → full-screen mobile page built from `ProfileScreen` styles (avatar initials, name, description, Call `tel:`, Map (Google Maps search of business name), Website, Save contact = downloads a `.vcf`), tiles hidden when the field is empty; `inactive` → empty-state "This card isn’t active yet"; 404 → "Card not found" with link to Tapwe home.

- [ ] Step 1: Vitest: profile response with no phone hides the Call tile; 404 renders `Card not found`.
- [ ] Step 2: Implement; manual: tap `/c/ab12cd` (profile), `/c/k9f2xq` (redirect), `/c/m4t8zr` (inactive), `/c/zzzzzz` (404). Backup patch.

### Task 16: Final verification

- [ ] Server: `yarn lint && yarn build && yarn test && yarn test:e2e` all green.
- [ ] Web: `yarn lint && yarn build && yarn test` all green.
- [ ] Root `README.md`: setup (MySQL, `.env`, migrate, seed, run both apps) and demo logins.
- [ ] Stop any dev servers started; leave MySQL service state as found.
