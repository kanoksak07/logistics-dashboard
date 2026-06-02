"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CostDonutProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#2563EB", "#F59E0B", "#16A34A", "#6366F1", "#EC4899", "#14B8A6", "#F97316", "#84CC16"];

export function CostDonut({ data }: CostDonutProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${Number(value).toLocaleString("th-TH")} บาท`, String(name)]}
          contentStyle={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6 }}
        />
        <Legend
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 11, color: "#6B7280" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
