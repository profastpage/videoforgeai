# VideoForge AI

VideoForge AI is a premium SaaS foundation for creating AI videos in seconds for marketing, sales, business, ecommerce, social media and creator workflows. The project is built as a production-oriented Next.js App Router codebase with a polished responsive UI, server actions, route handlers, Firebase-first auth, Supabase-ready data access, Stripe-ready billing, a mock-first AI video provider layer, and realistic seed content.

## Stack

- Next.js 16 App Router + TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui-style component primitives
- lucide-react
- framer-motion
- React Hook Form + Zod
- Firebase-first auth + Supabase-ready data layer
- Stripe-ready billing layer
- Mock-first AI video provider abstraction
- Route handlers + server actions

## Current Product Surface

- Marketing landing page with hero, trust indicators, benefits, how-it-works, use cases, pricing and FAQ
- Login and signup flows using server actions with mock auth fallback
- Responsive dashboard shell with fixed mobile header and desktop sidebar
- Dashboard overview with stats, video-plan state, credits and recent videos
- Create Video flow with prompt templates, generation form, `720p`-only generation, credit estimation and mock image-to-video source
- Create Video flow with idea-to-brief AI enhancement, editable prompt optimization, prompt templates, `720p`-only generation, credit estimation and mock image-to-video source
- History page with search, filters, refresh, duplicate and cancel actions
- Billing page with operational `Demo`, `Lite`, `Pro` and `Business` video plans plus subscription summary
- Settings page with profile, preferences and sign-out
- Admin page with seeded platform metrics and audit trail
- API routes for generation listing/creation plus status refresh and cancellation

## Project Structure

```text
src/
  app/
    (marketing)/
    (auth)/
    (dashboard)/
    api/
  components/
  config/
  features/
  hooks/
  lib/
    schemas/
  server/
    mock-db/
    repositories/
    seeds/
    stripe/
    supabase/
  services/
    auth/
    billing/
    dashboard/
    prompts/
    storage/
    video/
  types/
supabase/
  migrations/
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5000` when using the local launcher, or `http://localhost:3000` if you start Next manually with `npm run dev`.

To launch the app directly on port `5000`, run:

```bat
start-videoAI.cmd
```

That launcher binds the app to `http://127.0.0.1:5000`, opens the browser automatically, and keeps that port dedicated to this workspace. If a previous local `node` process is still using it, it will be stopped and restarted automatically.

Verification:

```bash
npm run typecheck
npm run lint
npm run build
npm run qa
```

## Production Workflow

- GitHub is the source of truth for production: `git@github.com:profastpage/videoforgeai.git`
- The production branch is `main`
- Vercel is expected to stay connected to the GitHub repository so every push to `main` triggers an automatic production deployment
- Standard release flow for this project is: local validation -> commit -> push to GitHub -> Vercel auto deploy
- Keep secrets only in local `.env` and Vercel Environment Variables, never in Git
- Live Fal video generation is restricted to superadmin emails configured in `SUPERADMIN_EMAILS`; non-admin sessions stay on the mock provider path

AI routing:

- see [`docs/AI_ROUTING.md`](/C:/dev/CREADOR%20DE%20VIDEOS/docs/AI_ROUTING.md)
- marketing and pricing: `brand-system -> copy-positioning -> landing-page-director -> master-frontend -> conversion-critic -> design-critic`
- dashboard shell and pages: `dashboard-director -> app-shell-architect -> design-system-builder -> master-frontend -> design-critic`
- end-to-end product flows: `master-fullstack`

## Environment Variables

See [`.env.example`](/C:/dev/CREADOR%20DE%20VIDEOS/.env.example).

Key groups:

- App: `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Billing: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_DEMO`, `STRIPE_PRICE_LITE`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`
- Video provider: `VIDEO_PROVIDER`, `VIDEO_PROVIDER_API_KEY`, `VIDEO_PROVIDER_WEBHOOK_SECRET`, `FAL_API_KEY`, `FAL_QUEUE_BASE_URL`, `FAL_KLING_TEXT_MODEL`, `FAL_KLING_IMAGE_MODEL`, `SUPERADMIN_EMAILS`
- AI brief enhancement: `OPENAI_API_KEY`, `OPENAI_MODEL`
- Storage: `STORAGE_DRIVER`, `SUPABASE_STORAGE_BUCKET`, `R2_*`
- Jobs: `JOB_DRIVER`, `UPSTASH_REDIS_*`

## Firebase Auth Connection

1. Create a Firebase project and enable Email/Password sign-in.
2. Add the public client config values and Admin SDK credentials to `.env`.
3. For local development, you can point `FIREBASE_AUTH_EMULATOR_HOST` at the Auth Emulator.
4. Client config lives in the Firebase client module and server verification uses Firebase Admin session cookies.

Main auth files:

- [src/services/auth/auth-service.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/services/auth/auth-service.ts)
- [src/app/api/auth/session/route.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/app/api/auth/session/route.ts)
- [src/app/api/auth/logout/route.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/app/api/auth/logout/route.ts)

## Supabase Connection

1. Create a Supabase project.
2. Copy your project URL and anon key into `.env`.
3. Apply the schema in [supabase/migrations/20260311070000_init.sql](/C:/dev/CREADOR%20DE%20VIDEOS/supabase/migrations/20260311070000_init.sql).
4. Replace or extend the mock repositories in [src/server/repositories](/C:/dev/CREADOR%20DE%20VIDEOS/src/server/repositories) with real Supabase-backed implementations.
5. Keep Supabase focused on Postgres/storage concerns; auth is now handled by Firebase.

## Stripe Connection

1. Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_DEMO`, `STRIPE_PRICE_LITE`, `STRIPE_PRICE_PRO` and `STRIPE_PRICE_BUSINESS`.
2. Point your Stripe webhook endpoint at `POST /api/stripe/webhook`.
3. Use the dashboard billing page to launch `POST /api/billing/checkout` and the customer portal flow at `POST /api/billing/portal`.
4. On successful checkout, the billing page also reconciles the returned `session_id` server-side, so local development does not depend entirely on webhook delivery before the UI reflects the new plan.

## Video Provider Connection

Main hook points:

- Base contract: [src/services/video/providers/base.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/services/video/providers/base.ts)
- Registry: [src/services/video/providers/registry.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/services/video/providers/registry.ts)
- fal adapter: [src/services/video/providers/fal.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/services/video/providers/fal.ts)
- Mock adapter: [src/services/video/providers/mock.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/services/video/providers/mock.ts)
- Orchestration: [src/services/video/video-service.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/services/video/video-service.ts)

fal + Kling 2.5 Turbo Pro is now the launch target provider. To enable it:

1. Add `FAL_API_KEY` in `.env`.
2. Keep `VIDEO_PROVIDER=fal` or override the model ids if you want a different fal model path.
3. The app will fall back to the mock adapter automatically if fal credentials are absent.
4. For honest product behavior, the generation UI is now constrained to `720p` and `5s/10s`, with `10s` as the default launch format because Kling 2.5 Turbo Pro officially supports `5s` or `10s`.

## Architecture Notes

- Client UI stays in `features/*` and `components/*`.
- Domain validation uses Zod schemas in `src/lib/schemas`.
- Server-only configuration and infrastructure live in `src/server`.
- Repositories isolate data access so mocks can be replaced without rewriting UI.
- Video orchestration is abstracted away from transport and provider details.
- Billing logic is centralized and credit-aware.

## Seeds And Mocks

- Plans: [src/server/seeds/plans.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/server/seeds/plans.ts)
- Prompt templates: [src/server/seeds/prompt-templates.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/server/seeds/prompt-templates.ts)
- Demo user: [src/server/seeds/demo-user.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/server/seeds/demo-user.ts)
- Mock generations: [src/server/mock-db/video-generations.ts](/C:/dev/CREADOR%20DE%20VIDEOS/src/server/mock-db/video-generations.ts)

## Immediate Next Steps

- Finish Firebase production credential setup and disable fallback mode
- Move repositories from in-memory data to Supabase Postgres queries
- Move Stripe state from mock/in-memory repositories to Supabase-backed persistence once production billing goes live
- Add real storage uploads for image-to-video input and generated assets
- Add background job execution using Upstash Redis, BullMQ or trigger-based workers
- Move live video state and generated asset metadata from in-memory flow to persistent storage once fal is running in production
