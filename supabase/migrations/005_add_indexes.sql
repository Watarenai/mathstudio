-- TASK-07: stripe_customer_id インデックス + updated_at 自動更新トリガー
-- Supabase ダッシュボード > SQL Editor で実行

-- stripe_customer_id 検索の高速化（Webhook で頻繁に使われる）
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id
  ON public.user_profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- updated_at 自動更新トリガー（手動で now() を渡す必要がなくなる）
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_profiles_updated_at ON public.user_profiles;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
