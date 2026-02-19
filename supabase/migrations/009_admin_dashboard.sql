-- Add is_admin flag to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- RLS: Allow admins to view ALL profiles
-- (Existing policy allows users to view their own)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
);

-- RPC: Admin Set Pro Status
-- securely updates is_pro status, restricted to admins
CREATE OR REPLACE FUNCTION public.admin_set_pro_status(
  target_user_id UUID,
  new_status BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the executor is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Update target user
  UPDATE public.user_profiles
  SET is_pro = new_status, updated_at = now()
  WHERE id = target_user_id;
END;
$$;
