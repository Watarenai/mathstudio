-- TASK: 解約理由ログテーブル（チャーン分析用）
-- Supabase ダッシュボード > SQL Editor で実行

CREATE TABLE IF NOT EXISTS public.cancellation_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL, -- 'expensive' | 'not_using' | 'features' | 'bugs' | 'other'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS有効化
ALTER TABLE public.cancellation_feedback ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の解約理由をINSERT可能
DROP POLICY IF EXISTS "insert_own_feedback" ON public.cancellation_feedback;
CREATE POLICY "insert_own_feedback" ON public.cancellation_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 管理者のみ全件参照可能
DROP POLICY IF EXISTS "admin_select_all" ON public.cancellation_feedback;
CREATE POLICY "admin_select_all" ON public.cancellation_feedback
    FOR SELECT USING (public.is_admin() = true);

-- インデックス（集計クエリ高速化）
CREATE INDEX IF NOT EXISTS idx_cancellation_feedback_reason ON public.cancellation_feedback(reason);
CREATE INDEX IF NOT EXISTS idx_cancellation_feedback_created_at ON public.cancellation_feedback(created_at);
