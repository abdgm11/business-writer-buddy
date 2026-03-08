import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    {stats.map((s, i) => (
      <motion.div
        key={s.label}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.08 }}
        className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{s.label}</p>
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-muted shrink-0">
            <s.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground font-display">{s.value}</p>
        <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{s.change}</p>
      </motion.div>
    ))}
  </div>
);

export default StatsGrid;
