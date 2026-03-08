import { useEffect, useRef } from "react";
import { Badge } from "@/hooks/useBadges";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "proseai-seen-badges";

function getSeenBadges(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markBadgeSeen(id: string) {
  const seen = getSeenBadges();
  seen.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

const TIER_EMOJI: Record<Badge["tier"], string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
};

export function useBadgeNotifications(badges: Badge[]) {
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Skip the very first render to avoid toasting all existing badges on page load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      // Seed seen badges with currently unlocked ones on first load
      const seen = getSeenBadges();
      let changed = false;
      badges.forEach((b) => {
        if (b.unlocked && !seen.has(b.id)) {
          // First time loading dashboard with these badges — mark as seen silently
          seen.add(b.id);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
      }
      return;
    }

    // On subsequent updates, toast for newly unlocked badges
    const seen = getSeenBadges();
    badges.forEach((badge) => {
      if (badge.unlocked && !seen.has(badge.id)) {
        markBadgeSeen(badge.id);
        toast({
          title: `${TIER_EMOJI[badge.tier]} Badge Unlocked!`,
          description: `${badge.name} — ${badge.description}`,
        });
      }
    });
  }, [badges]);
}
