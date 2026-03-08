import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CustomTooltip from "./CustomTooltip";

interface ScoreTrendChartProps {
  data: { index: number; score: number | null; date: string }[];
}

const ScoreTrendChart = ({ data }: ScoreTrendChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
  >
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <TrendingUp className="h-4 w-4 text-gold" />
      <h3 className="text-sm font-semibold text-foreground">Score Trend</h3>
    </div>
    {data.length > 1 ? (
      <ResponsiveContainer width="100%" height={160} className="sm:!h-[200px]">
        <AreaChart data={data} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--gold))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--gold))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={28} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="hsl(var(--gold))"
            strokeWidth={2}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-[160px] sm:h-[200px] text-sm text-muted-foreground">
        Need at least 2 scored rewrites
      </div>
    )}
  </motion.div>
);

export default ScoreTrendChart;
