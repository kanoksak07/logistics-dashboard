"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { ChartContainer } from "./chart-container";

interface TripBarProps {
  data: { day: string; trips: number }[];
}

export function TripBar({ data }: TripBarProps) {
  const max = Math.max(...data.map((d) => d.trips));
  return (
    <ChartContainer height={160}>
      {(width, height) => (
        <BarChart width={width} height={height} data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(value) => [`${Number(value)} รอบ`, "จำนวนรอบ"]}
            contentStyle={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.trips === max ? "#1B4332" : entry.trips > 0 ? "#74C69D" : "#E5E7EB"} />
            ))}
          </Bar>
        </BarChart>
      )}
    </ChartContainer>
  );
}
