-- TASK-11: ファミリープラン対応
-- Supabase ダッシュボード > SQL Editor で実行

-- plan_type カラムを追加（free / pro / family）
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'free'
    CHECK (plan_type IN ('free', 'pro', 'family', 'school'));

-- 既存の is_pro = true ユーザーは plan_type = 'pro' に移行
UPDATE public.user_profiles
  SET plan_type = 'pro'
  WHERE is_pro = true AND plan_type = 'free';

-- 保護者↔子アカウント紐付け用
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_user_profiles_parent_id
  ON public.user_profiles(parent_id);
