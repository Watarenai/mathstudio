-- TASK-11: ゲーム結果のクラウド同期
-- Supabase ダッシュボード > SQL Editor で実行

-- ゲーム結果履歴テーブル
CREATE TABLE IF NOT EXISTS public.game_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL,
    genre TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    correct_count INT, 
    total_count INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS有効化
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON public.game_results(user_id);
CREATE INDEX IF NOT EXISTS idx_game_results_created_at ON public.game_results(created_at);

-- ポリシー
-- 1. 自分の結果はINSERT可能
DROP POLICY IF EXISTS "insert_own_result" ON public.game_results;
CREATE POLICY "insert_own_result" ON public.game_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. 自分と、自分の親だけがSELECT可能
DROP POLICY IF EXISTS "select_own_or_child_result" ON public.game_results;
CREATE POLICY "select_own_or_child_result" ON public.game_results
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = user_id
            AND parent_id = auth.uid()
        )
    );

-- 間違い履歴テーブル（詳細分析用）
CREATE TABLE IF NOT EXISTS public.wrong_answer_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    problem_id TEXT,               -- 生成問題の場合はnull、固定問題ならID
    problem_text TEXT,             -- 問題文スナップショット
    user_answer TEXT,
    correct_answer TEXT,
    genre TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.wrong_answer_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_wrong_answer_logs_user_id ON public.wrong_answer_logs(user_id);

DROP POLICY IF EXISTS "insert_own_wrong_log" ON public.wrong_answer_logs;
CREATE POLICY "insert_own_wrong_log" ON public.wrong_answer_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_or_child_wrong_log" ON public.wrong_answer_logs;
CREATE POLICY "select_own_or_child_wrong_log" ON public.wrong_answer_logs
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = user_id
            AND parent_id = auth.uid()
        )
    );
