-- ============================================================
-- ZOMBIES EE GUIDE — Supabase Schema Setup
-- Paste this into Supabase → SQL Editor → Run
-- ============================================================

-- 1. SESSIONS TABLE
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  session_name text not null,
  map_id text not null,
  created_at timestamptz default now(),
  active boolean default true
);

-- 2. PARTICIPANTS TABLE
create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  name text not null,
  joined_at timestamptz default now(),
  color text not null
);

-- 3. STEP COMPLETIONS TABLE
create table if not exists step_completions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  step_index int not null,
  completed_by_name text not null,
  completed_by_color text not null,
  completed_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public read/write for now (lock down later if needed)
-- ============================================================

alter table sessions enable row level security;
alter table participants enable row level security;
alter table step_completions enable row level security;

-- Sessions policies
create policy "Public read sessions" on sessions for select using (true);
create policy "Public insert sessions" on sessions for insert with check (true);
create policy "Public update sessions" on sessions for update using (true);

-- Participants policies
create policy "Public read participants" on participants for select using (true);
create policy "Public insert participants" on participants for insert with check (true);

-- Step completions policies
create policy "Public read step_completions" on step_completions for select using (true);
create policy "Public insert step_completions" on step_completions for insert with check (true);
create policy "Public delete step_completions" on step_completions for delete using (true);

-- ============================================================
-- ENABLE REALTIME
-- Run each line separately if needed, or all at once
-- ============================================================

alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table step_completions;

-- ============================================================
-- HELPER INDEX — fast session lookup by code
-- ============================================================

create index if not exists sessions_code_idx on sessions(code);
create index if not exists step_completions_session_idx on step_completions(session_id, step_index);
