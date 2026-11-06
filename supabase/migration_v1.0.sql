-- Multi-Course Learning Hub v1.0
-- Apply in Supabase SQL Editor. This migration creates separate content tables;
-- it does not modify existing LMS tables.
create extension if not exists pgcrypto;

create table if not exists public.learning_courses (
 id uuid primary key default gen_random_uuid(),
 slug text unique not null,
 title text not null,
 official_title text,
 description text,
 duration_hours integer not null default 0,
 outcome text,
 status text not null default 'draft' check (status in ('draft','published','archived')),
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.learning_modules (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.learning_courses(id) on delete cascade,
 title text not null,
 summary text,
 duration_hours numeric(5,2) not null default 0,
 sort_order integer not null default 0,
 status text not null default 'draft' check (status in ('draft','published')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.learning_items (
 id uuid primary key default gen_random_uuid(),
 module_id uuid not null references public.learning_modules(id) on delete cascade,
 item_type text not null check (item_type in ('lesson','workshop','prompt','resource','quiz')),
 title text not null,
 body jsonb not null default '{}'::jsonb,
 sort_order integer not null default 0,
 status text not null default 'draft' check (status in ('draft','published')),
 version integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.learning_item_versions (
 id uuid primary key default gen_random_uuid(),
 item_id uuid not null references public.learning_items(id) on delete cascade,
 version integer not null,
 title text not null,
 body jsonb not null,
 changed_at timestamptz not null default now(),
 changed_by uuid,
 unique(item_id,version)
);

create index if not exists learning_modules_course_sort on public.learning_modules(course_id,sort_order);
create index if not exists learning_items_module_sort on public.learning_items(module_id,sort_order);
create index if not exists learning_items_published on public.learning_items(status);

alter table public.learning_courses enable row level security;
alter table public.learning_modules enable row level security;
alter table public.learning_items enable row level security;
alter table public.learning_item_versions enable row level security;

drop policy if exists "Public read published courses" on public.learning_courses;
create policy "Public read published courses" on public.learning_courses for select using (status='published' or public.is_admin());
drop policy if exists "Admin manage courses" on public.learning_courses;
create policy "Admin manage courses" on public.learning_courses for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read published modules" on public.learning_modules;
create policy "Public read published modules" on public.learning_modules for select using (
 (status='published' and exists(select 1 from public.learning_courses c where c.id=course_id and c.status='published'))
 or public.is_admin()
);
drop policy if exists "Admin manage modules" on public.learning_modules;
create policy "Admin manage modules" on public.learning_modules for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read published items" on public.learning_items;
create policy "Public read published items" on public.learning_items for select using (
 (status='published' and exists(
   select 1 from public.learning_modules m join public.learning_courses c on c.id=m.course_id
   where m.id=module_id and m.status='published' and c.status='published'
 )) or public.is_admin()
);
drop policy if exists "Admin manage items" on public.learning_items;
create policy "Admin manage items" on public.learning_items for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin read versions" on public.learning_item_versions;
create policy "Admin read versions" on public.learning_item_versions for select using (public.is_admin());
drop policy if exists "Admin insert versions" on public.learning_item_versions;
create policy "Admin insert versions" on public.learning_item_versions for insert with check (public.is_admin());

-- Future member login/progress can be added later without changing course content structure.
-- Public learners currently need no account. Never expose service_role or secret keys in frontend.
