import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "./types";

interface ContextBreakdownChartProps {
  data: { name: string; value: number }[];
}

const ContextBreakdownChart = ({ data }: ContextBreakdownChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.35 }}
    className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
  >
    <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Writing Context Breakdown</h3>
    {data.length > 0 ? (
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <ResponsiveContainer width={120} height={120} className="sm:!w-[140px] sm:!h-[140px] shrink-0">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-muted-foreground capitalize">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
    )}
  </motion.div>
);

export default ContextBreakdownChart;
