# Tapwe

Smart NFC + QR business cards. Each printed card opens one permanent link (`/c/<code>`); the Tapwe team points it at the owner's digital profile, a menu, a feedback form, or any website.

| Folder | What it is |
|---|---|
| `tapwe-web/` | The whole app: React 19 + TypeScript + Vite. Marketing pages, request form, owner dashboard, admin, public card page |
| `supabase/` | The database: tables, access rules and functions (`migrations/`), plus demo data (`seed.sql`) |
| `docs/design/tapwe-design.html` | The approved UI design (open in a browser) |

There is no separate backend. The app talks to Supabase directly: Supabase Auth handles accounts, row-level security decides who can read or change each row, and a few database functions do the server-side work (opening a card and counting the tap, analytics, admin search).

## Set up Supabase (once)

1. Create a project at <https://supabase.com>.
2. **Authentication → Sign In / Providers → Email**: turn **Confirm email** off (sign-up signs people straight in).
3. **SQL Editor**: paste and run `supabase/migrations/20261102000000_init.sql`.
4. Optional, for a test project only: run `supabase/seed.sql` for the demo accounts below.
5. **Project Settings → API**: copy the Project URL and the `anon` public key.

## Run it locally

Requirements: Node 22+, Yarn 1.

```bash
cd tapwe-web
yarn install
cp .env.example .env.local     # paste the Project URL and anon key
yarn dev                       # http://localhost:5173
```

Demo logins created by `seed.sql`:

- Owner: `demo@tapwe.in` / `demo12345`: 3 cards (`ab12cd` profile, `k9f2xq` menu link, `m4t8zr` draft) and a week of taps
- Admin: `admin01@tapwe.in` / `admin@0123`: signs in on the same page and lands on the admin dashboard (`/admin`)

Try the public card page: <http://localhost:5173/c/ab12cd> (profile), `/c/k9f2xq` (redirects), `/c/m4t8zr` (not active yet).

## Deploy (Vercel)

One Vercel project, root directory `tapwe-web`. Add the three `VITE_*` variables from `.env.example` in the project settings. `vercel.json` sends every path to the app so links like `/c/ab12cd` work.

## Tests

```bash
cd tapwe-web && yarn test
```

## How a card gets to its owner

Customers sign up and sign in at `/sign-in`; admins sign in on the same page and land on the admin dashboard at `/admin`:

- **Card requests**: everything sent through the website's "Request a card" form. Mark each one contacted or fulfilled, and use **Create card** to start a card for that customer.
- **Cards**: every card from every customer. Create a card for a customer's email (they may not have an account yet; it appears in their dashboard as soon as they sign up), then edit its name, owner, status and where it opens. Copy its link or download its QR code for printing.
- **Change requests**: customers asking to repoint a card. **Edit card**, then **Mark done**.

To make another account an admin, set its `role` to `admin` in the `users` table (Supabase → Table Editor).

## Before launch

- Don't run `seed.sql` on the live project: its passwords are published in this README.
- Pricing, Privacy, Terms and Support pages still hold the design's placeholder copy.
- Set `VITE_PUBLIC_CARD_BASE_URL` to the real domain — it is the link written to every NFC chip and QR code, so it must never change once cards are printed.
