# Jolo

Job search agent: tailored resumes, applications you approve, replies tracked.
See [`docs/SPEC.md`](docs/SPEC.md) for the product and design spec.

Stack: Nuxt 4 + TypeScript, Supabase (Postgres, Auth, Storage), deployed on Vercel.

## Setup

1. **Install**

   ```bash
   pnpm install
   cp .env.example .env
   ```

2. **Supabase project** — create one at [supabase.com](https://supabase.com), then put the
   project URL and publishable (or anon) key from *Project Settings → API* into `.env`.

3. **Database** — apply the migrations in `supabase/migrations/`, either with the
   [Supabase CLI](https://supabase.com/docs/guides/cli) (`supabase link` then `supabase db push`)
   or by pasting them into the SQL editor.

4. **Google sign-in**
   - In Google Cloud Console, create an OAuth client (type *Web application*) and add
     `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI.
   - In Supabase, *Authentication → Sign In / Providers → Google*: enable it and paste the
     client ID and secret.
   - In Supabase, *Authentication → URL Configuration*: set the site URL and add
     `http://localhost:3000/confirm` (and your production `/confirm` URL) to the redirect URLs.

5. **Run**

   ```bash
   pnpm dev
   ```

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server on http://localhost:3000 |
| `pnpm build` | Production build |
| `pnpm typecheck` | Type-check app and server, including Supabase query types |
| `pnpm db:types` | Regenerate `shared/types/database.types.ts` from the linked Supabase project |

## Layout

- `app/pages/` — `/` (public), `/login`, `/confirm` (OAuth callback), `/dashboard` (signed in)
- `server/api/` — API routes; `serverSupabaseClient` runs queries as the signed-in user, so RLS applies
- `supabase/migrations/` — schema and row-level security policies
- `shared/types/database.types.ts` — typed Supabase schema
