-- 数字碑 · 云端表
-- 在 Supabase 控制台 → SQL Editor 新建查询，把本文件整段粘贴进去，然后 Run。
--
-- 网页使用匿名登录，每个浏览器得到一个 owner id，不需要密码。
-- 必须先打开匿名登录，否则 signInAnonymously 会失败：
--   Authentication → Sign In / Providers → Anonymous sign-ins
--   打开 “Allow anonymous sign-ins”
--
-- 网页只带 publishable key。不要把 service_role 或 sb_secret 放进网站。

-- paid 目前由网页在「模拟支付」成功后直接写入。
-- 在接入真实微信支付 / 支付宝，并由服务器核对付款之前，这个值可以被伪造。

create table if not exists public.steles (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null default '',
  birth_year integer,
  death_year integer,
  hometown text,
  epitaph text not null default '',
  content jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.steles.paid is
  'Client-set today. Forgeable until real payment is verified on the server.';

comment on column public.steles.content is
  'Full stele body (events, message). Not returned by the search view.';

create index if not exists steles_public_paid_idx
  on public.steles (is_public, paid);

create index if not exists steles_owner_idx
  on public.steles (owner);

create or replace function public.steles_set_owner()
returns trigger
language plpgsql
as $$
begin
  -- 主人只能是当前登录用户，网页不能改成别人的 id。
  new.owner = auth.uid();
  return new;
end;
$$;

create or replace function public.steles_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists steles_set_owner on public.steles;
create trigger steles_set_owner
  before insert or update on public.steles
  for each row execute function public.steles_set_owner();

drop trigger if exists steles_set_updated_at on public.steles;
create trigger steles_set_updated_at
  before update on public.steles
  for each row execute function public.steles_set_updated_at();

alter table public.steles enable row level security;

drop policy if exists "steles_public_read" on public.steles;
create policy "steles_public_read"
  on public.steles
  for select
  to anon, authenticated
  using (is_public = true and paid = true);

drop policy if exists "steles_owner_select" on public.steles;
create policy "steles_owner_select"
  on public.steles
  for select
  to authenticated
  using (owner = auth.uid());

drop policy if exists "steles_owner_insert" on public.steles;
create policy "steles_owner_insert"
  on public.steles
  for insert
  to authenticated
  with check (owner = auth.uid());

drop policy if exists "steles_owner_update" on public.steles;
create policy "steles_owner_update"
  on public.steles
  for update
  to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

drop policy if exists "steles_owner_delete" on public.steles;
create policy "steles_owner_delete"
  on public.steles
  for delete
  to authenticated
  using (owner = auth.uid());

-- 搜索只用这张视图：姓名、生卒年、墓志铭一行。不含 content / hometown。
-- security_invoker 让查询者的 RLS 生效，不会绕过「仅公开且已付费」。
drop view if exists public.steles_public_cards;
create view public.steles_public_cards
with (security_invoker = true) as
select
  id,
  name,
  birth_year,
  death_year,
  epitaph
from public.steles
where is_public = true
  and paid = true;

comment on view public.steles_public_cards is
  'Search cards only. Full text is read from steles when a public paid row is opened.';

grant usage on schema public to anon, authenticated;
grant select on public.steles to anon, authenticated;
grant insert, update, delete on public.steles to authenticated;
grant select on public.steles_public_cards to anon, authenticated;
