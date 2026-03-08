import { useMemo } from "react";
import {
  FileText,
  BookOpen,
  Flame,
  Target,
  Trophy,
  Star,
  Zap,
  Crown,
  Rocket,
  Award,
  Pen,
  GraduationCap,
} from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  unlocked: boolean;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

interface BadgeInput {
  totalRewrites: number;
  totalWords: number;
  streak: number;
  bestScore: number | null;
  avgScore: number | null;
  uniqueContexts: number;
  daysPracticed: number;
}

const BADGE_DEFS: (Omit<Badge, "unlocked"> & { check: (i: BadgeInput) => boolean })[] = [
  // Rewrite milestones
  { id: "first-write", name: "First Steps", description: "Complete your first rewrite", icon: Pen, tier: "bronze" as const, check: (i) => i.totalRewrites >= 1 },
  { id: "ten-rewrites", name: "Getting Warmed Up", description: "Complete 10 rewrites", icon: FileText, tier: "bronze" as const, check: (i) => i.totalRewrites >= 10 },
  { id: "fifty-rewrites", name: "Consistent Writer", description: "Complete 50 rewrites", icon: BookOpen, tier: "silver" as const, check: (i) => i.totalRewrites >= 50 },
  { id: "hundred-rewrites", name: "Century Club", description: "Complete 100 rewrites", icon: Trophy, tier: "gold" as const, check: (i) => i.totalRewrites >= 100 },
  { id: "twofifty-rewrites", name: "Writing Machine", description: "Complete 250 rewrites", icon: Crown, tier: "platinum" as const, check: (i) => i.totalRewrites >= 250 },

  // Word milestones
  { id: "hundred-words", name: "Wordsmith", description: "Polish 100 words", icon: Zap, tier: "bronze" as const, check: (i) => i.totalWords >= 100 },
  { id: "thousand-words", name: "Thousand Words", description: "Polish 1,000 words", icon: Star, tier: "silver" as const, check: (i) => i.totalWords >= 1000 },
  { id: "tenk-words", name: "Prolific Writer", description: "Polish 10,000 words", icon: Rocket, tier: "gold" as const, check: (i) => i.totalWords >= 10000 },

  // Streak milestones
  { id: "streak-3", name: "On a Roll", description: "Maintain a 3-day streak", icon: Flame, tier: "bronze" as const, check: (i) => i.streak >= 3 },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, tier: "silver" as const, check: (i) => i.streak >= 7 },
  { id: "streak-30", name: "Monthly Master", description: "Maintain a 30-day streak", icon: Flame, tier: "gold" as const, check: (i) => i.streak >= 30 },

  // Score milestones
  { id: "score-80", name: "High Achiever", description: "Score 80+ on a rewrite", icon: Target, tier: "silver" as const, check: (i) => (i.bestScore ?? 0) >= 80 },
  { id: "score-95", name: "Near Perfection", description: "Score 95+ on a rewrite", icon: Award, tier: "gold" as const, check: (i) => (i.bestScore ?? 0) >= 95 },
  { id: "avg-75", name: "Consistent Quality", description: "Average score above 75", icon: GraduationCap, tier: "silver" as const, check: (i) => (i.avgScore ?? 0) >= 75 },

  // Variety
  { id: "multi-context", name: "Versatile Writer", description: "Use 3+ writing contexts", icon: Star, tier: "silver" as const, check: (i) => i.uniqueContexts >= 3 },
];

export function useBadges(input: BadgeInput): Badge[] {
  return useMemo(() => {
    return BADGE_DEFS.map(({ check, ...def }) => ({
      ...def,
      unlocked: check(input),
    }));
  }, [input]);
}

export const TIER_COLORS: Record<Badge["tier"], { bg: string; border: string; text: string }> = {
  bronze: { bg: "bg-orange-100 dark:bg-orange-950/30", border: "border-orange-300 dark:border-orange-700", text: "text-orange-600 dark:text-orange-400" },
  silver: { bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-600", text: "text-slate-500 dark:text-slate-400" },
  gold: { bg: "bg-gold/10", border: "border-gold/40", text: "text-gold" },
  platinum: { bg: "bg-violet-100 dark:bg-violet-950/30", border: "border-violet-300 dark:border-violet-700", text: "text-violet-600 dark:text-violet-400" },
};
