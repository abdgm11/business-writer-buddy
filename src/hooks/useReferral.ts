import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ReferralStats {
  referralCode: string | null;
  totalReferred: number;
  bonusEarned: number;
  loading: boolean;
}

export function useReferral(): ReferralStats {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [totalReferred, setTotalReferred] = useState(0);
  const [bonusEarned, setBonusEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);

      const [profileRes, referralsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("referral_code, bonus_rewrites")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("referrals")
          .select("id, referrer_reward")
          .eq("referrer_id", user.id),
      ]);

      setReferralCode(profileRes.data?.referral_code ?? null);
      setBonusEarned(profileRes.data?.bonus_rewrites ?? 0);
      setTotalReferred(referralsRes.data?.length ?? 0);
      setLoading(false);
    };

    fetch();
  }, [user]);

  return { referralCode, totalReferred, bonusEarned, loading };
}
