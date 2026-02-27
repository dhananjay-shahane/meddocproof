"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CertificateDistributionItem } from "@/types";

interface CertificateDistributionProps {
  data: CertificateDistributionItem[];
}

const COLORS: Record<string, string> = {
  sick_leave: "hsl(var(--chart-1))",
  fitness: "hsl(var(--chart-2))",
  work_from_home: "hsl(var(--chart-3))",
  caretaker: "hsl(var(--chart-4))",
  recovery: "hsl(var(--chart-5))",
  fit_to_fly: "hsl(var(--chart-1))",
  unfit_to_work: "hsl(var(--chart-2))",
  unfit_to_travel: "hsl(var(--chart-3))",
  medical_diagnosis: "hsl(var(--chart-4))",
};

const FALLBACK_COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ec4899"];

export function CertificateDistribution({ data }: CertificateDistributionProps) {
  const hasData = data.length > 0 && data.some((d) => d.count > 0);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-semibold">Certificate Distribution</h3>
      {!hasData ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No certificate data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
              nameKey="label"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.type}`}
                  fill={COLORS[entry.type] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} certificates`]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
