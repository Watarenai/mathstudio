-- TASK-02: set_pro_status() を service_role 専用に制限
-- Supabase ダッシュボード > SQL Editor で実行

-- 既存関数を削除してから再作成（パラメータ名変更のため DROP が必要）
DROP FUNCTION IF EXISTS public.set_pro_status(UUID, BOOLEAN);

CREATE FUNCTION public.set_pro_status(
  target_user_id UUID,
  status BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service_role 以外は拒否（一般ユーザーによる不正 Pro 昇格を防ぐ）
  IF current_setting('role') != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: service_role required';
  END IF;

  UPDATE public.user_profiles
    SET is_pro = status, updated_at = now()
    WHERE id = target_user_id;
END;
$$;

-- 一般ユーザー・認証済みユーザーからの実行権限を剥奪
REVOKE EXECUTE ON FUNCTION public.set_pro_status(UUID, BOOLEAN) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_pro_status(UUID, BOOLEAN) FROM authenticated;

-- service_role のみ実行可能
GRANT EXECUTE ON FUNCTION public.set_pro_status(UUID, BOOLEAN) TO service_role;
