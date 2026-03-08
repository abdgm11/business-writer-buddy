
-- Payments: explicitly deny DELETE for all users (no one should delete payment records via client)
CREATE POLICY "No client-side payment deletes"
  ON public.payments FOR DELETE TO authenticated
  USING (false);

-- Payments: explicitly deny UPDATE for all users (updates only via edge functions with service role)
CREATE POLICY "No client-side payment updates"
  ON public.payments FOR UPDATE TO authenticated
  USING (false);
