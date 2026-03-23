import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange";
  sparkData?: number[];
}

const colorMap = {
  blue: { bg: "bg-admin-info/10", text: "text-admin-info", stroke: "#3b82f6" },
  green: { bg: "bg-admin-success/10", text: "text-admin-success", stroke: "#22c55e" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-500", stroke: "#a855f7" },
  orange: { bg: "bg-admin-warning/10", text: "text-admin-warning", stroke: "#f59e0b" },
};

export function KpiCard({ title, value, change, trend, icon: Icon, color, sparkData }: KpiCardProps) {
  const c = colorMap[color];
  const data = (sparkData || [12, 18, 14, 22, 19, 25, 23]).map((v) => ({ v }));

  return (
    <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trend === "up" ? "text-admin-success" : "text-admin-danger")}>
            {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </div>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.bg)}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
      <div className="h-10 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.stroke} stopOpacity={0.2} />
                <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={c.stroke} strokeWidth={1.5} fill={`url(#grad-${color})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
