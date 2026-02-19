-- TASK-03: Stripe Webhook 冪等性チェック用テーブル
-- Supabase ダッシュボード > SQL Editor で実行

CREATE TABLE IF NOT EXISTS public.stripe_events (
  id           TEXT        PRIMARY KEY,   -- Stripe の event.id (例: evt_xxx)
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- service_role のみアクセス可能にする（一般ユーザーからは不可）
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- ポリシー未定義 = 全拒否。service_role は RLS をバイパスするため追加設定不要。

-- 古いレコードの定期削除（30日）
-- Supabase の pg_cron 拡張で以下を登録するか、手動で月次実行する:
-- SELECT cron.schedule('stripe-events-cleanup', '0 3 * * *',
--   $$DELETE FROM public.stripe_events WHERE processed_at < now() - INTERVAL '30 days'$$
-- );
