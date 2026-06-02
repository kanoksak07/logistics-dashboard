"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendChartProps {
  data: { month: string; revenue: number; cost: number; profit: number }[];
}

function formatY(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value, name) => {
            const labels: Record<string, string> = { revenue: "รายได้", cost: "ต้นทุน", profit: "กำไร" };
            return [`${Number(value).toLocaleString("th-TH")} บาท`, labels[String(name)] || String(name)];
          }}
          contentStyle={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6 }}
        />
        <Legend
          formatter={(value) => {
            const labels: Record<string, string> = { revenue: "รายได้", cost: "ต้นทุน", profit: "กำไร" };
            return <span style={{ fontSize: 11, color: "#6B7280" }}>{labels[value] || value}</span>;
          }}
        />
        <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="cost"    stroke="#F59E0B" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="profit"  stroke="#16A34A" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
