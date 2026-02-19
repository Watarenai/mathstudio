-- Fix RLS Infinite Recursion
-- The previous policy caused a loop because checking `is_admin` required querying the table, 
-- which triggered the policy again.
-- We use a SECURITY DEFINER function to break the loop.

-- 1. Create a secure function to check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- 3. Re-create the policy using the secure function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  public.is_admin() = true
);
