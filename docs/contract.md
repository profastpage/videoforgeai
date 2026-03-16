# API Contract

Date: 2026-03-11

## Envelope

All route handlers return:

```json
{
  "data": {},
  "error": null
}
```

or

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Endpoints

### `POST /api/video-brief/enhance`

Enhances a rough idea into a structured video brief.

Request:

```json
{
  "idea": "Describe the product, the offer, the audience and the angle...",
  "locale": "es",
  "generationType": "text-to-video",
  "preferredAspectRatio": "9:16",
  "preferredDurationSeconds": 10
}
```

Returns:

```json
{
  "data": {
    "brief": {
      "projectName": "Video comercial optimizado",
      "hook": "Gancho claro...",
      "prompt": "Crea un video...",
      "negativePrompt": "Evita escenas...",
      "callToAction": "Descubre la oferta hoy",
      "style": "performance-ads",
      "aspectRatio": "9:16",
      "durationSeconds": 10
    }
  },
  "error": null
}
```

Errors:

- `400 INVALID_INPUT`
- `401 UNAUTHORIZED`
- `502 BRIEF_ENHANCEMENT_FAILED`
- `500 INTERNAL_SERVER_ERROR`

### `GET /api/video-generations`

Returns the current authenticated user generation list.

### `POST /api/video-generations`

Creates a generation from:

```json
{
  "projectName": "Spring Promo Video",
  "prompt": "Create a polished conversion-focused promo...",
  "negativePrompt": "Avoid noisy scenes...",
  "generationType": "text-to-video",
  "aspectRatio": "9:16",
  "resolution": "720p",
  "durationSeconds": 10,
  "style": "performance-ads",
  "templateSlug": "ecommerce-flash-sale"
}
```

Errors:

- `400 INVALID_INPUT`
- `401 UNAUTHORIZED`
- `402 INSUFFICIENT_CREDITS`
- `500 GENERATION_CREATE_FAILED`

### `POST /api/video-generations/:id/status`

Refreshes queued/processing generation state through the provider abstraction.

### `POST /api/video-generations/:id/cancel`

Requests cancellation through the provider abstraction.

### `GET /api/video-templates`

Returns seeded prompt template catalog and featured templates.

### `POST /api/billing/checkout`

Creates a Stripe billing redirect for the authenticated user from:

```json
{
  "planId": "pro"
}
```

Returns:

```json
{
  "data": {
    "url": "https://checkout.stripe.com/...",
    "mode": "checkout"
  },
  "error": null
}
```

If the workspace already has a linked Stripe subscription, the same endpoint can return a portal redirect instead:

```json
{
  "data": {
    "url": "https://billing.stripe.com/...",
    "mode": "portal"
  },
  "error": null
}
```

Errors:

- `400 INVALID_INPUT`
- `401 UNAUTHORIZED`
- `404 PLAN_NOT_FOUND`
- `500 PLAN_PRICE_NOT_CONFIGURED`
- `503 STRIPE_NOT_CONFIGURED`

### `POST /api/billing/portal`

Creates a Stripe billing portal session for the current authenticated workspace.

Errors:

- `401 UNAUTHORIZED`
- `409 BILLING_PORTAL_UNAVAILABLE`
- `503 STRIPE_NOT_CONFIGURED`

### `POST /api/stripe/webhook`

Receives Stripe webhook events and synchronizes subscription state back into the internal billing model.

Handled events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Errors:

- `400 INVALID_WEBHOOK_SIGNATURE`
- `500 STRIPE_WEBHOOK_NOT_CONFIGURED`

## Changelog

- 2026-03-11 | Replaced the initial simple demo contract with auth-aware generation, refresh and cancellation routes | Updated | Aligns the contract with the new SaaS architecture.
- 2026-03-11 | Added operational Stripe checkout, billing portal and webhook routes using the shared `{ data, error }` envelope | Updated | Lets the dashboard launch real billing flows and reconcile subscriptions back into the app state.
