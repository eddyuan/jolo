# Jolo — Product & Design Spec (v1)

Jolo is a job search agent: it builds a truthful, tailored resume from the user's
background, finds matching jobs, prepares applications for the user to approve,
submits them, and tracks what happens next.

## 1. Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | v1 core | Resume optimization + auto-apply. Email tracking starts minimal. Calendar and video are v2. |
| 2 | Autonomy | Queue & approve. Rules-based auto-apply (salary floor, location, blocklist, daily cap) is an opt-in later. |
| 3 | Job sources / submission | Job aggregator APIs for discovery. Automated submission only on Greenhouse, Lever and Ashby. Everything else is "apply manually" with the tailored resume. No LinkedIn/Indeed automation. |
| 4 | Gmail | Google Sign-In (non-restricted scopes) at launch. Job-mail ingestion via a user-created Gmail filter that forwards to a Jolo inbound address. Full `gmail.readonly` (restricted scope, CASA assessment) only once user numbers justify it. |
| 5 | Video intro | Post-v1. If built: hosted on a shareable profile page, via a consent-enforcing provider (e.g. ElevenLabs, HeyGen). Better fit: interview practice. |
| 6 | Selfie "legitimacy" | Liveness check via a vendor. No ID/KYC. |
| 7 | Resume guardrail | Never fabricate. Rephrase/reorder/emphasize only; every claim traces to the master profile. Show a diff before use. |
| 8 | Market | Canada first. |
| 9 | Business model | Free tier (a few applications/month) + subscription with quotas, priced from measured per-application cost. |
| 10 | Platforms | Responsive Nuxt 4 web app first. Flutter mobile app in v2 (notifications, on-the-go approvals). |
| 11 | Workers | Hosted browser service (e.g. Browserbase) driven by a small worker. Self-hosted Playwright later if cost demands. |
| 12 | Data & auth | Supabase (Postgres + auth + storage + row-level security). |
| 13 | First users | Software engineers in Canada. |
| 14 | Review queue | Daily batch ("12 jobs ready — approve all or review each"). |

## 2. Feature scope

### 2.1 Onboarding & profile
- Sign in with Google (email/password as fallback).
- Upload an existing resume (PDF/DOCX) or answer a guided interview; both produce a
  **master profile** — the single source of truth for every fact about the user.
- Job preferences: target titles, seniority, location / remote, relocation, salary floor,
  start date, work authorization / sponsorship needs.
- Company blocklist (current employer always included).
- Standard answers: years of experience, links (LinkedIn, GitHub, portfolio), notice period,
  voluntary EEO/demographic answers (with "prefer not to say").

### 2.2 Resume optimization
- Generate a tailored resume per job from the master profile; never add facts.
- Show a diff against the base resume; user can edit.
- Export ATS-parseable PDF and DOCX.
- Cover letter generation, same no-fabrication rule.

### 2.3 Job matching
- Pull listings from aggregator APIs and public Greenhouse/Lever/Ashby job boards.
- Deduplicate across sources; detect closed listings.
- Fit score with a human-readable reason; record why jobs were skipped.
- Approve/reject decisions on the queue feed back into matching.

### 2.4 Application engine
- One adapter per ATS (Greenhouse, Lever, Ashby) mapping form fields to the profile.
- Unknown screening question → pause and ask the user, save the answer for reuse. Never guess.
- CAPTCHA or unexpected step → hand off to the user.
- ATS email verification flows read via the forwarded-mail inbox.
- Capture screenshot + confirmation for every submission.
- Guards: no duplicate application, per-company cap, per-user daily cap.
- Adapter health checks with alerting (ATS forms change without notice).

### 2.5 Tracking
- Pipeline: `found → queued → approved → applying → applied → replied → interview → offer | rejected | withdrawn`.
- Classify inbound job mail (rejection, interview invite, assessment, recruiter outreach) and link it to the application.
- Follow-up reminders when a company goes quiet.
- Full action log of everything the agent did on the user's behalf.

### 2.6 Notifications
- Daily digest email with the review batch; alerts for interview invites and questions needing an answer.

## 3. v2 and later
- **Calendar**: parse interview invites and scheduling links, time zones, conflict detection
  (Google Calendar scopes need app verification but not CASA).
- **Full Gmail read** (restricted scope + annual CASA assessment).
- **Interview prep**: company research, likely questions, mock interviews (reuses voice).
- **Video intro** on a shareable profile page, with liveness check and biometric consent.
- **Flutter mobile app**.
- More ATS adapters (Workday, SmartRecruiters, …), more countries, rules-based auto-apply.

## 4. Architecture

```
Nuxt 4 (Vercel) ── web UI + Nitro server routes (API)
      │
      ├── Supabase: Postgres (RLS), Auth, Storage (resumes, screenshots, media)
      ├── Job queue (Postgres-backed, e.g. pg-boss, or a hosted queue)
      │        │
      │        └── Worker service (container) ── hosted browser (Browserbase) ── ATS sites
      ├── LLM: Claude — tailoring, cover letters, screening answers, mail classification
      ├── Inbound mail endpoint (forwarded job mail)
      └── Stripe (billing, quotas)
```

- Browser automation never runs inside Vercel functions (duration limits); it runs in the worker.
- OAuth tokens and resumes encrypted at rest; per-user row-level security on every table.

### Core data model (first cut)
- `users`, `profiles` (master profile, preferences, standard answers), `blocklist`
- `resumes` (base + tailored versions, linked to job)
- `jobs` (normalized listing, source, ATS type, status open/closed, dedup key)
- `matches` (user × job, score, reason, decision)
- `applications` (status, submitted_at, screenshot, confirmation, cover letter)
- `screening_answers` (question fingerprint → user answer)
- `emails` (inbound, classification, linked application)
- `agent_actions` (audit log), `subscriptions` / `usage`

## 5. Legal, privacy & trust
- Terms explicitly authorize Jolo to apply on the user's behalf; user sees every action.
- Canada: PIPEDA; Quebec Law 25 (privacy officer, impact assessments, consent) if serving Quebec.
- Google API Services User Data Policy / Limited Use: Gmail data only for the user-facing feature, no model training or ads.
- Biometric data (selfie, voice) — v2: separate explicit consent, retention limit, deletion path.
- Account deletion and data export on request; published privacy policy.

## 6. Operations
- Admin dashboard: users, queue, failed runs, adapter health.
- Cost tracking per application (LLM + browser minutes) to set quotas and pricing.
- Error monitoring and alerting on failed runs.
- Success metric: **response rate per application**, not volume.

## 7. Suggested build order
1. ~~Nuxt + Supabase skeleton, Google sign-in, RLS.~~ Built; needs a Supabase project and Google OAuth client (see README).
2. Resume upload/parse → master profile → preferences.
3. Tailored resume generation with diff + PDF/DOCX export.
4. Job ingestion from Greenhouse/Lever/Ashby boards + matching + daily review queue.
5. Worker + Greenhouse adapter end-to-end (then Lever, Ashby).
6. Inbound mail forwarding + classification + pipeline tracking.
7. Stripe billing and quotas.
