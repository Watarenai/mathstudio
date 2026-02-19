-- MathStudio: サブスクリプション & Proユーザー管理
-- Supabase ダッシュボード > SQL Editor で実行

-- user_profiles テーブル
create table if not exists public.user_profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    is_pro boolean not null default false,
    stripe_customer_id text,
    stripe_subscription_id text,
    updated_at timestamptz not null default now()
);

-- RLS
alter table public.user_profiles enable row level security;

-- 自分のプロフィールは参照可能
create policy "own_profile_select" on public.user_profiles
    for select using (auth.uid() = id);

-- ユーザー作成時に自動で user_profiles も作成（Trigger）
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, is_pro)
    values (new.id, false);
    return new;
end;
$$ language plpgsql security definer;

-- Trigger設定
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- 手動でPro化するための関数（デバッグ/管理者用）
create or replace function public.set_pro_status(user_id uuid, status boolean)
returns void as $$
begin
    update public.user_profiles
    set is_pro = status, updated_at = now()
    where id = user_id;
end;
$$ language plpgsql security definer;
