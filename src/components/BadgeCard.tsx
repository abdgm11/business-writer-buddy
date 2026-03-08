import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Badge, TIER_COLORS } from "@/hooks/useBadges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeCardProps {
  badge: Badge;
  index?: number;
  compact?: boolean;
}

export const BadgeCard = ({ badge, index = 0, compact = false }: BadgeCardProps) => {
  const tier = TIER_COLORS[badge.tier];
  const Icon = badge.icon;

  if (compact) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                badge.unlocked
                  ? `${tier.bg} ${tier.border} ${tier.text}`
                  : "bg-muted border-muted-foreground/20 text-muted-foreground/30"
              }`}
            >
              {badge.unlocked ? (
                <Icon className="h-4 w-4" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-center max-w-[180px]">
            <p className="font-semibold text-sm">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            {!badge.unlocked && (
              <p className="text-xs text-muted-foreground/60 mt-1">🔒 Locked</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`rounded-xl border-2 p-4 text-center transition-all ${
        badge.unlocked
          ? `${tier.bg} ${tier.border}`
          : "bg-muted/50 border-muted-foreground/10 opacity-50"
      }`}
    >
      <div
        className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
          badge.unlocked ? `${tier.bg} ${tier.text}` : "bg-muted text-muted-foreground/30"
        }`}
      >
        {badge.unlocked ? (
          <Icon className="h-6 w-6" />
        ) : (
          <Lock className="h-5 w-5" />
        )}
      </div>
      <p className={`text-sm font-semibold ${badge.unlocked ? "text-foreground" : "text-muted-foreground/50"}`}>
        {badge.name}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
      {badge.unlocked && (
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.text} ${tier.bg}`}>
          {badge.tier}
        </span>
      )}
    </motion.div>
  );
};
