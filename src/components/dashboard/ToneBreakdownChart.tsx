import { motion } from "framer-motion";
import { CHART_COLORS } from "./types";

interface ToneBreakdownChartProps {
  data: { name: string; value: number }[];
}

const ToneBreakdownChart = ({ data }: ToneBreakdownChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.4 }}
    className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
  >
    <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Tone Usage</h3>
    {data.length > 0 ? (
      <div className="space-y-2 sm:space-y-3">
        {data.map((item, i) => {
          const max = data[0].value;
          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground capitalize">{item.name}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
    )}
  </motion.div>
);

export default ToneBreakdownChart;
