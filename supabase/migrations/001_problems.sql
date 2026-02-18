-- MathStudio: problems テーブル
-- Supabase ダッシュボード > SQL Editor で実行

create table if not exists public.problems (
    id uuid primary key default gen_random_uuid(),
    genre text not null check (genre in ('proportional', 'inverse', 'equation', 'geometry', 'sector')),
    difficulty text not null check (difficulty in ('Easy', 'Normal', 'Hard', 'Expert')),
    unit text not null default '',
    points int not null default 100,
    problem_text text not null,
    correct_answer text not null,
    answer_variants text[] not null default '{}',
    hints text[] not null default '{}',
    chips text[] not null default '{}',
    created_by uuid references auth.users(id),
    is_approved boolean not null default false,
    created_at timestamptz not null default now()
);

-- RLS（行レベルセキュリティ）
alter table public.problems enable row level security;

-- 承認済み問題は誰でも読める
create policy "approved_problems_select" on public.problems
    for select using (is_approved = true);

-- 自分が作った問題は読める（未承認含む）
create policy "own_problems_select" on public.problems
    for select using (auth.uid() = created_by);

-- ログインユーザーは問題を作成できる
create policy "authenticated_insert" on public.problems
    for insert with check (auth.uid() = created_by);

-- 自分の問題は更新・削除できる
create policy "own_problems_update" on public.problems
    for update using (auth.uid() = created_by);

create policy "own_problems_delete" on public.problems
    for delete using (auth.uid() = created_by);

-- インデックス
create index if not exists idx_problems_genre_difficulty on public.problems(genre, difficulty);
create index if not exists idx_problems_approved on public.problems(is_approved);
