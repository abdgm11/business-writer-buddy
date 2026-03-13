import { Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCardProps {
  streak: number;
  streakGoal: number;
}

const StreakCard = ({ streak, streakGoal }: StreakCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" as const }}
    className="relative overflow-hidden rounded-2xl gradient-navy p-6 md:p-8 shadow-elegant"
  >
    <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
      <Flame className="w-full h-full text-gold" />
    </div>
    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-gold shadow-gold">
          <Flame className="h-8 w-8 text-accent-foreground" />
        </div>
        <div>
          <p className="text-5xl md:text-6xl font-bold text-white font-display leading-none">
            {streak}
          </p>
          <p className="text-sm text-white/80 mt-1">day streak</p>
        </div>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-gold" />
          <p className="text-sm font-medium text-primary-foreground">
            {streak > 0 ? `${streakGoal - streak} days to your ${streakGoal}-day goal!` : "Start your streak by polishing some text!"}
          </p>
        </div>
        <div className="w-full h-3 rounded-full bg-primary-foreground/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(streak / streakGoal) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
            className="h-full rounded-full gradient-gold"
          />
        </div>
        <p className="text-xs text-primary-foreground/50 mt-2">
          Practice daily to keep your streak. Resets after 24 hours of inactivity.
        </p>
      </div>
    </div>
  </motion.div>
);

export default StreakCard;
