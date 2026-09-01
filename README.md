# CoverageQualifier — Life Insurance Offer Funnel

Marketing site + multi-step quote funnel built with Next.js 16, Tailwind v4, and Supabase. Brand string `CoverageQualifier` — swap via `lib/brand.ts`.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** — mint theme configured in `app/globals.css`
- **Supabase** (Postgres for leads + Auth for admin gate)
- **Resend** for lead-notification emails
- **react-hook-form + zod** for form validation
- **Vercel** for hosting

## Setup

```bash
# 1. install
npm install

# 2. env
cp .env.local.example .env.local
# fill in Supabase URL, anon key, service-role key, Resend API key, notification email

# 3. apply the Supabase migration
#   - via Supabase dashboard SQL editor: paste supabase/migrations/0001_leads.sql and run
#   - or with the Supabase CLI: supabase db push

# 4. create your first admin user
#   a. Supabase dashboard → Auth → Users → invite/create yourself with email + password
#   b. Supabase dashboard → SQL editor:
#      insert into public.admin_users (user_id) values ('<your-auth-uid>');

# 5. dev
npm run dev
```

## Deploy (Vercel)

1. Push repo to GitHub.
2. Import into Vercel → set the same env vars from `.env.local.example`.
3. Point your domain (GoDaddy / Namecheap) at Vercel's DNS as per Vercel's project → Domains screen.

## Structure

- `app/` — App Router pages
  - `page.tsx` — marketing home
  - `quote/` — funnel (entry + dynamic `[step]/`)
  - `quote/complete/` — TCPA consent
  - `quote/results/` — mocked personalized quotes
  - `admin/` — auth-gated dashboard
  - `api/leads/` — POST upsert + CSV export
- `components/site/` — home page sections
- `components/funnel/` — funnel shell + inputs
- `lib/brand.ts` — one-file brand rename (name, phone, socials)
- `lib/funnel/steps.ts` — ordered step config (add/edit questions here)
- `lib/supabase/{server,browser,admin}.ts` — Supabase clients
- `lib/supabase/types.ts` — hand-authored Database types
- `lib/email/notifyLead.ts` — Resend email
- `supabase/migrations/0001_leads.sql` — schema

## Notes

- Quote pricing is **mocked** (`app/quote/results/page.tsx → computeQuotes`). Swap with a real rate table or API when ready.
- Leads persist as partials — a row is created on the first `OK` and upserted each step.
- The TCPA consent copy is placeholder — replace with your compliance team's wording before going live.
- The reference screenshots that originally lived in `public/` were moved to `reference/` so Next.js could use `public/`. Delete `reference/` before shipping.
