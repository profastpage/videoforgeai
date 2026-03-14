# Context

Date: 2026-03-11

## Product

VideoForge AI is a premium AI video SaaS for marketing, sales, business teams, agencies, ecommerce brands and creators. The current implementation is a production-oriented foundation with a polished marketing site, Firebase-first auth, dashboard shell, billing model, prompt templates, mock generation pipeline and active Supabase/Stripe/provider integration points.

## Architecture

- `src/app`: App Router pages, route groups and route handlers
- `src/components`: Reusable design-system and shell primitives
- `src/features`: Product-facing feature modules for auth, billing, marketing, video and shared states
- `src/server`: Env parsing, Firebase/Supabase/Stripe clients, seeds, repositories and mock DB data
- `src/services`: Domain orchestration for auth, billing, dashboard, prompts, storage and video
- `src/lib/schemas`: Shared Zod contracts for validation and typing
- `supabase/migrations`: SQL schema for production database setup

## Backend Design

- Route handlers under `src/app/api` provide transport endpoints, including live Stripe checkout, billing portal and webhook reconciliation.
- Server actions drive generation mutations, AI brief enhancement and coordinated server work.
- Firebase session verification happens on the server through secure cookies.
- Repositories isolate persistence behind mock-first server modules.
- Billing and credit enforcement happens server-side, and Stripe sync now updates the mock-first subscription plus plan allowance state.
- Video provider execution is abstracted in `src/services/video/providers`.
- Storage and job execution are prepared behind service abstractions.

## Frontend Design

- The UI is mobile-first with a fixed mobile header and desktop sidebar.
- Dashboard shell now collapses major two-column layouts earlier to avoid cramped cards and broken copy on mid-width desktops.
- Landing page uses motion and premium SaaS visual structure.
- Dashboard pages render commercial product states rather than generic placeholders.
- Dashboard locale is shared across server and client rendering through a locale cookie plus the client provider, so the ES/EN switch updates server-rendered copy too.
- Client registry is no longer part of the regular customer dashboard navigation; it is centralized inside the superadmin area only.
- The Create Video flow now accepts a rough idea first and can enhance it into a stronger hook, CTA and generation prompt through an AI brief service with a mock-safe fallback.
- The commercial pricing model is now built around short-form video allowances: `Demo` (1), `Lite` (5), `Pro` (10) and `Business` (20) videos per month, anchored to 10-second standard renders.
- The generation UI and validation are currently locked to `720p` only so pricing and delivery stay aligned with the launch offer.
- The billing page now launches live Stripe checkout for upgrades, falls back to a Stripe portal redirect for already-linked subscriptions, and reconciles successful returns server-side through the returned checkout session id.
- The launch video provider target is fal using Kling 2.5 Turbo Pro, with automatic fallback to the mock adapter when fal credentials are missing.
- Shared UI primitives follow shadcn/ui-style patterns and Tailwind tokens.

## Security And Validation

- Protected dashboard pages require a server-resolved authenticated session.
- Superadmin-only pages and controls are gated server-side by session role before render.
- Auth is Firebase-first with a controlled local fallback when Firebase env vars are absent.
- Generation inputs are validated with Zod on both client and server.
- Credit checks happen before generation creation.

## Integrations

- Auth: Firebase Auth + Firebase Admin session cookies
- Database: Supabase/Postgres-ready
- Billing: Stripe checkout, billing portal and webhook sync with env scaffolding
- AI brief enhancement: OpenAI Responses API when configured, deterministic fallback when env vars are absent
- Storage: mock, Supabase Storage and R2 drivers prepared
- Video generation: mock provider active, real provider slot prepared
- Jobs: mock queue active, Upstash/BullMQ/trigger architecture prepared
