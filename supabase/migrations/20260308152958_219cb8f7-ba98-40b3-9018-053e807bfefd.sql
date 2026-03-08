
-- Profiles: restrict DELETE to own profile only
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Rewrites: restrict UPDATE to own rewrites only
CREATE POLICY "Users can update their own rewrites"
  ON public.rewrites FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
