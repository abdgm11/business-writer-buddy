
-- Restrict INSERT to only allow status='created' (prevent users from inserting paid rows)
DROP POLICY "Users can insert their own payments" ON public.payments;
CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'created');

-- Remove client-side UPDATE policy entirely - all updates go through edge functions with service role
DROP POLICY "Users can update their own payments" ON public.payments;
