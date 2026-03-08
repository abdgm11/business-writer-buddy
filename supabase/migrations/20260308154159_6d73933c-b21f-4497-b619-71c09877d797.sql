
-- ============================================
-- Fix RLS policies: change RESTRICTIVE to PERMISSIVE and fix role scoping
-- ============================================

-- REWRITES TABLE
DROP POLICY IF EXISTS "Users can view their own rewrites" ON public.rewrites;
DROP POLICY IF EXISTS "Users can insert their own rewrites" ON public.rewrites;
DROP POLICY IF EXISTS "Users can delete their own rewrites" ON public.rewrites;
DROP POLICY IF EXISTS "Users can update their own rewrites" ON public.rewrites;

CREATE POLICY "Users can view their own rewrites"
  ON public.rewrites FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewrites"
  ON public.rewrites FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rewrites"
  ON public.rewrites FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewrites"
  ON public.rewrites FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PROFILES TABLE
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- PAYMENTS TABLE
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "No client-side payment updates" ON public.payments;
DROP POLICY IF EXISTS "No client-side payment deletes" ON public.payments;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'created');

-- Keep blocking policies as RESTRICTIVE
CREATE POLICY "No client-side payment updates"
  ON public.payments AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY "No client-side payment deletes"
  ON public.payments AS RESTRICTIVE FOR DELETE TO authenticated
  USING (false);
