# Project Context

Date: 2026-03-11

## Summary

VideoForge AI is now a cohesive SaaS base with:

- responsive marketing site
- Firebase-first auth
- protected dashboard
- billing and credits model with Stripe checkout, portal and webhook sync
- prompt template library
- mock AI video creation workflow
- history management
- settings and admin foundations
- shared ES/EN locale across server and client dashboard rendering
- admin-only client registry inside the superadmin workspace
- AI-assisted idea-to-brief flow before video generation
- short-form pricing plans based on 1 / 5 / 10 / 20 monthly AI videos
- `720p`-only generation at launch to keep cost and offer scope tightly controlled
- fal + Kling 2.5 Turbo Pro as the first live provider target, while preserving a mock fallback when no live credentials are present
- paid live video generation currently limited to superadmin sessions only

## Main Runtime Flow

1. User signs in or signs up through Firebase client auth.
2. A Next.js route handler exchanges the Firebase ID token for a secure session cookie.
3. Protected dashboard pages resolve session on the server and apply role gates for superadmin-only areas.
4. The dashboard locale is read from a cookie so server-rendered sections follow the current ES/EN toggle.
5. The Create Video page can turn a rough idea into an AI-enhanced brief before the user edits the final prompt.
6. The Create Video page validates form input with React Hook Form + Zod.
7. The billing page can open Stripe checkout, reconcile the successful return server-side and later manage the subscription through the Stripe portal.
8. The video service validates credits, persists the job, calls the provider adapter and updates state.
9. History and dashboard pages refresh status through server actions or route handlers.

## Current Data Strategy

- Runtime persistence is mock/in-memory through repositories.
- SQL migration and database types are ready for Supabase Postgres.
- Seeds provide realistic plans, users, prompt templates and generations.

## Planned Production Swaps

- Replace auth fallback mode with fully configured Firebase production credentials only
- Replace in-memory repositories with Postgres-backed repositories
- Replace mock storage with Supabase Storage or Cloudflare R2
- Replace mock provider with first real AI video API
- Replace mock queue with background job infrastructure
