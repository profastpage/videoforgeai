# AI Routing

## Default

- Primary skill: `master-fullstack`
- Reason: the product crosses marketing, dashboard UI, auth, billing, server actions, route handlers, and provider orchestration.

## Recommended Sequences

### Marketing and pricing

`brand-system -> copy-positioning -> landing-page-director -> master-frontend -> conversion-critic -> design-critic`

Use for:

- marketing homepage
- pricing page
- launch and conversion sections

### Dashboard shell and operational pages

`dashboard-director -> app-shell-architect -> design-system-builder -> master-frontend -> design-critic`

Use for:

- overview
- history
- billing
- settings
- admin shell

### Create Video and end-to-end workflows

`brand-system -> dashboard-director -> app-shell-architect -> design-system-builder -> master-fullstack -> design-critic`

Use for:

- create-video
- idea-to-brief enhancement
- credits and billing interactions
- auth-gated workflows

### Backend-only work

`master-backend`

Use for:

- auth
- route handlers
- Stripe
- Supabase
- repositories
- storage
- provider integration

## Non-Negotiables

- Keep Firebase-first auth intact.
- Keep provider abstraction mock-first and swappable.
- Keep billing, credits, and responsive dashboard behavior coherent.
