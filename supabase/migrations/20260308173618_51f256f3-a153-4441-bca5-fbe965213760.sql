CREATE OR REPLACE FUNCTION public.get_total_rewrites()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.rewrites;
$$;