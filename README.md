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
- Admin: `admin01@tapwe.in` / `admin@0123` — signs in on the same page and lands on the admin dashboard (`/admin`)

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

Customers sign up and sign in at `/sign-in`; admins sign in on the same page and land on the admin dashboard at `/admin`:

- **Card requests**: everything sent through the website's "Request a card" form. Mark each one contacted or fulfilled, and use **Create card** to start a card for that customer.
- **Cards**: every card from every customer. Create a card for a customer's email (they may not have an account yet; it appears in their dashboard as soon as they sign up), then edit its name, owner, status and where it opens. Copy its link or download its QR code for printing.
- **Change requests**: customers asking to repoint a card. **Edit card**, then **Mark done**.

To make another account an admin, set its `role` to `admin` in the `users` table.

## Before launch

- Change the seeded admin password, or delete the demo accounts: their passwords are published in this README.

- Replace the placeholder founders in `tapwe-web/src/content/team.ts`.
- Pricing, Privacy, Terms and Support pages still hold the design's placeholder copy.
- Set `PUBLIC_CARD_BASE_URL` (server) to the real domain — it is the link written to every NFC chip and QR code, so it must never change once cards are printed.
