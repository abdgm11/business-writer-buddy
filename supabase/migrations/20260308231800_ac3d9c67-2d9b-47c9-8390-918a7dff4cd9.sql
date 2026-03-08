
-- Add bonus_rewrites column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bonus_rewrites integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Create referrals table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  referrer_reward integer NOT NULL DEFAULT 5,
  referred_reward integer NOT NULL DEFAULT 3,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  UNIQUE (referred_id)
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals (as referrer)
CREATE POLICY "Users can view referrals they made"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

-- No direct client inserts/updates/deletes (handled by edge function)
CREATE POLICY "No client inserts on referrals"
  ON public.referrals FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "No client updates on referrals"
  ON public.referrals FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "No client deletes on referrals"
  ON public.referrals FOR DELETE
  TO authenticated
  USING (false);

-- Function to generate a unique referral code for a user
CREATE OR REPLACE FUNCTION public.ensure_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := substring(md5(NEW.user_id::text || now()::text || random()::text) from 1 for 8);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate referral code on profile creation
CREATE TRIGGER tr_ensure_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_referral_code();

-- Backfill existing profiles with referral codes
UPDATE public.profiles
SET referral_code = substring(md5(user_id::text || now()::text || random()::text) from 1 for 8)
WHERE referral_code IS NULL;
