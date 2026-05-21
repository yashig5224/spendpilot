-- SpendPilot Supabase Schema
-- Run this in the Supabase SQL editor

-- Audits table
create table if not exists audits (
  id                    text primary key,
  share_slug            text unique not null,
  tool_entries          jsonb not null default '[]',
  recommendations       jsonb not null default '[]',
  total_monthly_savings numeric not null default 0,
  total_yearly_savings  numeric not null default 0,
  current_monthly_spend numeric not null default 0,
  optimized_monthly_spend numeric not null default 0,
  ai_summary            text,
  email                 text,
  created_at            timestamptz not null default now()
);

-- Leads table
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  audit_id   text references audits(id),
  created_at timestamptz not null default now(),
  unique(email, audit_id)
);

-- Indexes
create index if not exists audits_share_slug_idx on audits(share_slug);
create index if not exists audits_created_at_idx on audits(created_at desc);
create index if not exists leads_email_idx on leads(email);

-- Row Level Security (public read for audits, write-only for leads)
alter table audits enable row level security;
alter table leads enable row level security;

-- Anyone can read audits (for public share URLs)
create policy "Audits are publicly readable"
  on audits for select using (true);

-- Anyone can insert audits (no auth required)
create policy "Anyone can insert audits"
  on audits for insert with check (true);

-- Anyone can insert leads
create policy "Anyone can insert leads"
  on leads for insert with check (true);
