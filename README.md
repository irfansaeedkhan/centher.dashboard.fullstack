# Centher Dashboard (fullstack)

Centher SocialFi dapp — feed, chat, voice/stream, NFT marketplace, staking, launchpad — with a self-contained Nest of **Next.js Pages**, **Hono** APIs, **Better Auth**, and **Neon Postgres**.

## Stack

- Next.js (Pages Router) + React
- Hono API at `/api/*` (`pages/api/[[...route]].api.ts`)
- Better Auth (email/password) + cookie sessions
- Drizzle ORM → Neon Postgres
- Yarn

## Demo login

| Field    | Value            |
| -------- | ---------------- |
| Email    | `demo@centher.io` |
| Password | `Demo1234!`       |

Shown on the login screen. Wallet connect remains available but is not required for the demo path.

## Local setup

1. Copy env:

```bash
cp .env.example .env.local
```

2. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in `.env.local` (never commit secrets).

3. Use Node 20+ (22 recommended for Better Auth peers):

```bash
yarn install
yarn db:push
yarn db:seed
yarn dev -p 3002
```

Open [http://localhost:3002/auth/login](http://localhost:3002/auth/login).

## Useful scripts

- `yarn dev` — development server
- `yarn build` / `yarn start` — production
- `yarn db:push` — apply Drizzle schema to Neon
- `yarn db:seed` — seed demo user + sample feed/chat/stream/marketplace data
- `yarn lint` — ESLint

## API (demo)

- `GET /api/health`
- `POST /api/auth/sign-in/email`
- `GET /api/users/me`
- `GET /api/socials/posts`
- `GET /api/stream/channels`
- `GET /api/marketplace/nfts`
- `GET /api/chat/conversations`
- `GET /api/staking/pools`
- `GET /api/launchpads`

Voice/stream UI uses seeded channel state; live WebRTC is simulated for demo.

## Deploy

- GitHub: push to your `centher.dashboard.fullstack` remote
- Vercel: import that repo, set env vars in the Vercel project (not in git), then deploy

### Required Vercel env

| Name | Value |
| ---- | ----- |
| `DATABASE_URL` | Neon connection string |
| `BETTER_AUTH_SECRET` | long random secret |
| `BETTER_AUTH_URL` | `https://centher-app.vercel.app` (your production URL, **https**, not localhost) |
| `NEXT_PUBLIC_BRAND_NAME` | `Centher` |

Optional: `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD` — if set, password **must** be `Demo1234!` (with `!`) to match the seed. Prefer leaving them unset; the login form uses the seed credentials.

API clients default to same-origin `/api/*`. Set `NEXT_PUBLIC_USE_SAME_ORIGIN_API=false` only if you intentionally point at external CAPI/CIS hosts.
