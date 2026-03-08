
CREATE TABLE public.anon_rate_limits (
  ip_hash text PRIMARY KEY,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.anon_rate_limits ENABLE ROW LEVEL SECURITY;
