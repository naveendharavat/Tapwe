# Tapwe

Smart NFC + QR business cards. Each printed card opens one permanent link (`/c/<code>`); the Tapwe team points it at the owner's digital profile, a menu, a feedback form, or any website.

| Folder | What it is |
|---|---|
| `tapwe-web/` | React 19 + TypeScript + Vite site: marketing pages, request form, owner dashboard, public card page |
| `tapwe-server/` | NestJS 12 + TypeORM + Postgres (Supabase) REST API |
| `docs/design/tapwe-design.html` | The approved UI design (open in a browser) |
| `docs/superpowers/` | Design spec and implementation plan |

## Run it locally

Requirements: Node 22+, Yarn 1, a Postgres 14+ database (Supabase works).

```bash
# 1. Database: in Supabase open the project → Connect → Session pooler,
#    and copy host / port / user / database / password into tapwe-server/.env (DB_SSL=true).

# 2. API — http://localhost:4000
cd tapwe-server
yarn install
cp .env.example .env          # fill in the DB_* values and a long random JWT_SECRET
yarn migration:run            # creates the tables
yarn seed                     # demo data (safe to re-run)
yarn start:dev

# 3. Website — http://localhost:5173
cd ../tapwe-web
yarn install
cp .env.example .env.local
yarn dev
```

Demo logins created by `yarn seed`:

- Owner: `demo@tapwe.in` / `demo12345` — 3 cards (`ab12cd` profile, `k9f2xq` menu link, `m4t8zr` draft) and a week of taps
- Admin: `admin@tapwe.in` / `admin12345`

Try the public card page: <http://localhost:5173/c/ab12cd> (profile), `/c/k9f2xq` (redirects), `/c/m4t8zr` (not active yet).

## Tests

The e2e tests rebuild a throwaway Postgres on port 5433 (they never read the DB settings in `.env`):

```bash
docker run -d --rm --name tapwe-pg-test -p 5433:5432 -e POSTGRES_USER=tapwe -e POSTGRES_PASSWORD=tapwe -e POSTGRES_DB=tapwe_test postgres:16-alpine
cd tapwe-server && yarn test && yarn test:e2e
cd tapwe-web && yarn test
docker stop tapwe-pg-test
```

## How a card gets to its owner

There is no admin screen in v1; the team uses the admin API with an admin token:

```bash
# Provision a card for the customer's email (they may not have an account yet)
curl -X POST localhost:4000/admin/cards -H "Authorization: Bearer $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"name":"Table menu","ownerEmail":"owner@cafe.in","status":"active","destinationType":"menu","destinationUrl":"https://cafe.in/menu"}'
```

The card appears in that owner's dashboard as soon as they sign up (or right away if they already have an account). Other admin routes: `GET/PATCH /admin/card-requests` (incoming requests), `GET/PATCH /admin/change-requests` (owners asking to repoint a card; mark `done` once updated), `PATCH /admin/cards/:code` (rename, repoint, reassign or clear `ownerEmail`).

## Before launch

- Replace the placeholder founders in `tapwe-web/src/content/team.ts`.
- Pricing, Privacy, Terms and Support pages still hold the design's placeholder copy.
- Set `PUBLIC_CARD_BASE_URL` (server) to the real domain — it is the link written to every NFC chip and QR code, so it must never change once cards are printed.
