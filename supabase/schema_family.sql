-- 数字碑 · 族谱
-- 在 Supabase SQL Editor 新建查询，把本文件整段粘贴后 Run。
-- 可与 supabase/schema.sql 分开运行。
--
-- 匿名登录仍需打开，网页才能把族谱记到当前浏览器的用户名下：
--   Authentication → Sign In / Providers → Anonymous sign-ins → Allow anonymous sign-ins
--
-- 手机短信登录是以后的可选项，演示版不会发短信：
--   Authentication → Sign In / Providers → Phone
--   打开后再把 js/config.js 里的 phoneOtp 改成 true。
--
-- 不要把 service_role 或 sb_secret 放进网页。

create table if not exists public.family_trees (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null default '',
  is_public boolean not null default false,
  tree jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.family_trees is
  'Private by default. Public read only when is_public is true.';

create unique index if not exists family_trees_owner_idx
  on public.family_trees (owner);

create or replace function public.family_trees_set_owner()
returns trigger
language plpgsql
as $$
begin
  new.owner = auth.uid();
  return new;
end;
$$;

create or replace function public.family_trees_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists family_trees_set_owner on public.family_trees;
create trigger family_trees_set_owner
  before insert or update on public.family_trees
  for each row execute function public.family_trees_set_owner();

drop trigger if exists family_trees_set_updated_at on public.family_trees;
create trigger family_trees_set_updated_at
  before update on public.family_trees
  for each row execute function public.family_trees_set_updated_at();

alter table public.family_trees enable row level security;

drop policy if exists "family_public_read" on public.family_trees;
create policy "family_public_read"
  on public.family_trees
  for select
  to anon, authenticated
  using (is_public = true);

drop policy if exists "family_owner_select" on public.family_trees;
create policy "family_owner_select"
  on public.family_trees
  for select
  to authenticated
  using (owner = auth.uid());

drop policy if exists "family_owner_insert" on public.family_trees;
create policy "family_owner_insert"
  on public.family_trees
  for insert
  to authenticated
  with check (owner = auth.uid());

drop policy if exists "family_owner_update" on public.family_trees;
create policy "family_owner_update"
  on public.family_trees
  for update
  to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

drop policy if exists "family_owner_delete" on public.family_trees;
create policy "family_owner_delete"
  on public.family_trees
  for delete
  to authenticated
  using (owner = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.family_trees to anon, authenticated;
grant insert, update, delete on public.family_trees to authenticated;
