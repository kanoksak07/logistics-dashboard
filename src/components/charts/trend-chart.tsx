"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from "recharts";
import { ChartContainer } from "./chart-container";

interface TrendChartProps {
  data: { month: string; revenue: number; cost: number; profit: number }[];
}

function formatY(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ChartContainer height={220}>
      {(width, height) => (
        <LineChart width={width} height={height} data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value, name) => {
              const labels: Record<string, string> = { revenue: "รายได้", cost: "ต้นทุน", profit: "กำไร" };
              return [`${Number(value).toLocaleString("th-TH")} บาท`, labels[String(name)] || String(name)];
            }}
            contentStyle={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Legend
            formatter={(value) => {
              const labels: Record<string, string> = { revenue: "รายได้", cost: "ต้นทุน", profit: "กำไร" };
              return <span style={{ fontSize: 11, color: "#6B7280" }}>{labels[value] || value}</span>;
            }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#1B4332" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="cost"    stroke="#F59E0B" strokeWidth={2.5} dot={false} strokeDasharray="5 3" />
          <Line type="monotone" dataKey="profit"  stroke="#52B788" strokeWidth={2.5} dot={false} />
        </LineChart>
      )}
    </ChartContainer>
  );
}
