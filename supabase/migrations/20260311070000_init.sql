create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  company_name text,
  timezone text not null default 'America/Lima',
  theme_preference text not null default 'system' check (theme_preference in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  description text not null,
  monthly_price integer not null default 0,
  monthly_credits integer not null,
  max_duration_seconds integer not null,
  history_limit_days integer not null,
  concurrency_limit integer not null,
  priority text not null check (priority in ('standard', 'priority', 'highest')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  billing_cycle_anchor timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credits_balance (
  user_id uuid primary key references public.users(id) on delete cascade,
  available_credits integer not null default 0,
  reserved_credits integer not null default 0,
  lifetime_used_credits integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.video_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_name text not null,
  prompt text not null,
  negative_prompt text,
  generation_type text not null check (generation_type in ('text-to-video', 'image-to-video')),
  status text not null check (status in ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  aspect_ratio text not null check (aspect_ratio in ('16:9', '9:16', '1:1')),
  resolution text not null check (resolution in ('720p', '1080p', '4k')),
  duration_seconds integer not null,
  style text not null,
  template_slug text,
  source_image_url text,
  provider_key text not null,
  provider_job_id text,
  progress integer not null default 0,
  estimated_credits integer not null,
  consumed_credits integer,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.generation_assets (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.video_generations(id) on delete cascade,
  kind text not null check (kind in ('preview', 'source', 'final')),
  storage_driver text not null,
  path text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.credits_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  generation_id uuid references public.video_generations(id) on delete set null,
  amount integer not null,
  type text not null check (type in ('grant', 'usage', 'refund', 'adjustment')),
  reason text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.prompt_templates (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  slug text not null unique,
  title text not null,
  description text not null,
  prompt text not null,
  recommended_aspect_ratio text not null,
  recommended_style text not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  event_type text not null,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_video_generations_user_status on public.video_generations (user_id, status, created_at desc);
create index if not exists idx_video_generations_provider_job on public.video_generations (provider_key, provider_job_id);
create index if not exists idx_credits_transactions_user_created on public.credits_transactions (user_id, created_at desc);
create index if not exists idx_prompt_templates_category on public.prompt_templates (category, is_featured);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity_type, entity_id, created_at desc);
