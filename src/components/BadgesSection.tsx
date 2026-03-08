import { Badge } from "@/hooks/useBadges";
import { BadgeCard } from "@/components/BadgeCard";
import { Award } from "lucide-react";
import { motion } from "framer-motion";

interface BadgesSectionProps {
  badges: Badge[];
  variant?: "dashboard" | "report";
}

export const BadgesSection = ({ badges, variant = "dashboard" }: BadgesSectionProps) => {
  const unlocked = badges.filter((b) => b.unlocked);
  const locked = badges.filter((b) => !b.unlocked);

  if (variant === "report") {
    // Compact row for report card — only show unlocked
    if (unlocked.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground font-sans mb-3 uppercase tracking-wider">
          Badges Earned
        </h3>
        <div className="flex flex-wrap gap-2">
          {unlocked.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} index={i} compact />
          ))}
        </div>
      </div>
    );
  }

  // Dashboard — full grid with locked/unlocked
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-6 shadow-elegant"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-semibold text-foreground font-sans">Badges</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {unlocked.length}/{badges.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {[...unlocked, ...locked].map((badge, i) => (
          <BadgeCard key={badge.id} badge={badge} index={i} />
        ))}
      </div>
    </motion.div>
  );
};
