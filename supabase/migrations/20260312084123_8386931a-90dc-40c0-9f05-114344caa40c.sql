-- Deny all client access to anon_rate_limits (only service role should access)
CREATE POLICY "Deny all select for anon_rate_limits"
ON public.anon_rate_limits
FOR SELECT
TO authenticated, anon
USING (false);

CREATE POLICY "Deny all insert for anon_rate_limits"
ON public.anon_rate_limits
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "Deny all update for anon_rate_limits"
ON public.anon_rate_limits
FOR UPDATE
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all delete for anon_rate_limits"
ON public.anon_rate_limits
FOR DELETE
TO authenticated, anon
USING (false);