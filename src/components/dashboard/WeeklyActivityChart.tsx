import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CustomTooltip from "./CustomTooltip";

interface WeeklyActivityChartProps {
  data: { day: string; rewrites: number; words: number }[];
}

const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
  >
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <BarChart3 className="h-4 w-4 text-gold" />
      <h3 className="text-sm font-semibold text-foreground">Weekly Activity</h3>
    </div>
    {data.some((d) => d.rewrites > 0) ? (
      <ResponsiveContainer width="100%" height={160} className="sm:!h-[200px]">
        <BarChart data={data} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} width={28} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="rewrites" name="Rewrites" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-[160px] sm:h-[200px] text-sm text-muted-foreground">
        No activity this week yet
      </div>
    )}
  </motion.div>
);

export default WeeklyActivityChart;
