# Jolo

Job search agent: tailored resumes, applications you approve, replies tracked.
See [`docs/SPEC.md`](docs/SPEC.md) for the product and design spec.

## Stack

A pnpm + Turborepo monorepo:

| Path | What |
|---|---|
| `apps/web` | Next.js 16 (App Router) + TypeScript, deployed on Vercel |
| `apps/mobile` | Expo (React Native) with Expo Router, for iOS and Android |
| `packages/db` | Shared Supabase database types (`Database`, `Profile`, …) |
| `supabase/migrations` | Postgres schema and row-level security policies |

Both apps talk to the same Supabase project (Postgres, Auth, Storage).

## Setup

1. **Install**

   ```bash
   pnpm install
   cp apps/web/.env.example apps/web/.env.local
   cp apps/mobile/.env.example apps/mobile/.env
   ```

2. **Supabase project** — create one at [supabase.com](https://supabase.com), then put the
   project URL and publishable (or anon) key from *Project Settings → API* into both env files.

3. **Database** — apply the migrations in `supabase/migrations/`, either with the
   [Supabase CLI](https://supabase.com/docs/guides/cli) (`supabase link` then `supabase db push`)
   or by pasting them into the SQL editor.

4. **Google sign-in** (one Google OAuth client serves web and mobile, since both go through
   Supabase's hosted OAuth flow)
   - In Google Cloud Console, create an OAuth client (type *Web application*) and add
     `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI.
   - In Supabase, *Authentication → Sign In / Providers → Google*: enable it and paste the
     client ID and secret.
   - In Supabase, *Authentication → URL Configuration*, add these redirect URLs:
     - `http://localhost:3000/auth/callback` and your production `/auth/callback` URL (web)
     - `jolo://auth/callback` (mobile builds)
     - `exp://**` (Expo Go during development)

5. **Run**

   ```bash
   pnpm --filter @jolo/web dev      # http://localhost:3000
   pnpm --filter @jolo/mobile start # then open in Expo Go or a simulator
   ```

## Scripts (from the repo root)

| Script | What it does |
|---|---|
| `pnpm build` | Build every app |
| `pnpm typecheck` | Type-check every package, including Supabase query types |
| `pnpm lint` | Lint every package |
| `pnpm db:types` | Regenerate `packages/db/src/database.types.ts` from the linked Supabase project |

## How auth works

- **Web**: `apps/web/src/proxy.ts` refreshes the Supabase session cookie on every request and
  redirects signed-out visitors to `/login`. Google redirects back to `/auth/callback`, which
  exchanges the code for a session. Only `/` and `/login` are public.
- **Mobile**: sign-in opens Google in an in-app browser (PKCE flow) and returns to
  `jolo://auth/callback`; the session is stored with AsyncStorage. Expo Router's
  `Stack.Protected` keeps signed-out users on the sign-in screen.
- **Database**: every table has row-level security, so both apps query as the signed-in user
  and can only see their own rows.
