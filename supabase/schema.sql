-- Enable extensions
create extension if not exists "pgcrypto";

-- Audits table
create table if not exists audits (
  id text primary key,
  share_slug text unique not null,
  tool_entries jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  total_monthly_savings numeric not null default 0,
  total_yearly_savings numeric not null default 0,
  current_monthly_spend numeric not null default 0,
  optimized_monthly_spend numeric not null default 0,
  ai_summary text,
  email text,
  created_at timestamptz not null default now()
);

-- Leads table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  audit_id text references audits(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(email, audit_id)
);

-- Indexes
create index if not exists audits_share_slug_idx 
on audits(share_slug);

create index if not exists audits_created_at_idx 
on audits(created_at desc);

create index if not exists leads_email_idx 
on leads(email);

-- Enable RLS
alter table audits enable row level security;
alter table leads enable row level security;

-- Policies
create policy "Audits are publicly readable"
on audits
for select
using (true);

create policy "Anyone can insert audits"
on audits
for insert
with check (true);

create policy "Anyone can insert leads"
on leads
for insert
with check (true);