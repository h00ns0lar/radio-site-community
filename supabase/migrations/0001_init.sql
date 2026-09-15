-- AN:TENNA 초기 스키마
-- Supabase SQL Editor에서 그대로 실행하세요.

create extension if not exists "pgcrypto";

-- 프로필 (역할: 교사/학생)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null check (role in ('teacher', 'student')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 회원가입 시 auth.users -> profiles 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 관측 공유 게시판
create table if not exists public.observation_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  image_urls text[] not null default '{}',
  observed_at date not null,
  created_at timestamptz not null default now()
);

alter table public.observation_posts enable row level security;

create policy "observation posts are publicly readable"
  on public.observation_posts for select
  using (true);

create policy "authenticated users can create observation posts"
  on public.observation_posts for insert
  with check (auth.uid() = author_id);

create policy "authors can update their observation posts"
  on public.observation_posts for update
  using (auth.uid() = author_id);

create policy "authors can delete their observation posts"
  on public.observation_posts for delete
  using (auth.uid() = author_id);

-- 커뮤니티 게시판 (자유 / 질문 / 노하우공유)
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  category text not null check (category in ('free', 'question', 'tip')),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "community posts are publicly readable"
  on public.community_posts for select
  using (true);

create policy "authenticated users can create community posts"
  on public.community_posts for insert
  with check (auth.uid() = author_id);

create policy "authors can update their community posts"
  on public.community_posts for update
  using (auth.uid() = author_id);

create policy "authors can delete their community posts"
  on public.community_posts for delete
  using (auth.uid() = author_id);

-- 댓글 (두 게시판 공용, post_type으로 구분)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_type text not null check (post_type in ('observation', 'community')),
  post_id uuid not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_type, post_id);

alter table public.comments enable row level security;

create policy "comments are publicly readable"
  on public.comments for select
  using (true);

create policy "authenticated users can create comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "authors can delete their comments"
  on public.comments for delete
  using (auth.uid() = author_id);

-- 관측 이미지 저장 버킷
insert into storage.buckets (id, name, public)
values ('observation-images', 'observation-images', true)
on conflict (id) do nothing;

create policy "observation images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'observation-images');

create policy "authenticated users can upload observation images"
  on storage.objects for insert
  with check (bucket_id = 'observation-images' and auth.role() = 'authenticated');
