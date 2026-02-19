-- TASK-24: エンゲージメント分析用ログテーブル
-- Supabase ダッシュボード > SQL Editor で実行

-- 問題回答ログテーブル
CREATE TABLE IF NOT EXISTS public.problem_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    genre TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    duration_ms INTEGER NOT NULL, -- 回答にかかった時間（ミリ秒）
    problem_text TEXT, -- オプション: 問題文のスナップショット（デバッグ用）
    user_answer TEXT,  -- オプション: ユーザーの回答
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS有効化
ALTER TABLE public.problem_logs ENABLE ROW LEVEL SECURITY;

-- インデックス (分析クエリ高速化)
CREATE INDEX IF NOT EXISTS idx_problem_logs_user_id ON public.problem_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_logs_created_at ON public.problem_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_problem_logs_genre ON public.problem_logs(genre);

-- ポリシー

-- 1. 自分のログはINSERT可能
DROP POLICY IF EXISTS "insert_own_log" ON public.problem_logs;
CREATE POLICY "insert_own_log" ON public.problem_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. 自分は自分のログを見れる
DROP POLICY IF EXISTS "select_own_log" ON public.problem_logs;
CREATE POLICY "select_own_log" ON public.problem_logs
    FOR SELECT USING (auth.uid() = user_id);

-- 3. 管理者は全てのログを見れる (public.is_admin() 関数を使用)
-- ※ 010_fix_admin_rls.sql で定義された関数
DROP POLICY IF EXISTS "admin_select_all_logs" ON public.problem_logs;
CREATE POLICY "admin_select_all_logs" ON public.problem_logs
    FOR SELECT USING (public.is_admin() = true);
