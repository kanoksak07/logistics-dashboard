"use client";

import { TopBar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const TrendChart = dynamic(() => import("@/components/charts/trend-chart").then(m => ({ default: m.TrendChart })), { ssr: false });
const CostDonut  = dynamic(() => import("@/components/charts/cost-donut").then(m => ({ default: m.CostDonut })),   { ssr: false });
const TripBar    = dynamic(() => import("@/components/charts/trip-bar").then(m => ({ default: m.TripBar })),       { ssr: false });
import {
  trips,
  monthlyTrend,
  getCompletedTrips,
  getTotalRevenue,
  getTotalCost,
  getNetProfit,
  getProfitMargin,
  getTotalDriverCost,
  getTotalFuelCost,
  getTotalTollCost,
  getMonthlyFixedCost,
} from "@/lib/mock-data";
import { formatBaht, formatNumber, formatPercent, formatThaiDateShort } from "@/lib/utils";
import { DollarSign, TrendingUp, Percent, Hash, AlertTriangle, CheckCircle, Info } from "lucide-react";

const trendData = monthlyTrend.map((m) => {
  if (m.month === "มิ.ย.") {
    const rev = getTotalRevenue();
    const cost = getTotalCost();
    return { month: m.month, revenue: rev, cost, profit: rev - cost };
  }
  return m;
});

const totalDriverCost = getTotalDriverCost();
const totalFuelCost = getTotalFuelCost();
const totalTollCost = getTotalTollCost();
const fixedCost = getMonthlyFixedCost();

const costDonutData = [
  { name: "ค่าคนขับ", value: totalDriverCost },
  { name: "ค่าน้ำมัน", value: totalFuelCost },
  { name: "ค่าทางด่วน", value: totalTollCost },
  { name: "ต้นทุนคงที่", value: fixedCost },
];

const tripsByDay: Record<string, number> = {};
trips.forEach((t) => {
  if (t.trip_status === "completed") {
    const day = t.job_date.slice(8);
    tripsByDay[day] = (tripsByDay[day] || 0) + 1;
  }
});
const tripBarData = Array.from({ length: 21 }, (_, i) => {
  const day = String(i + 1).padStart(2, "0");
  return { day: `${i + 1}`, trips: tripsByDay[day] || 0 };
});

const completed = getCompletedTrips();
const totalRevenue = getTotalRevenue();
const totalCost = getTotalCost();
const netProfit = getNetProfit();
const profitMargin = getProfitMargin();
const avgRevPerTrip = completed.length > 0 ? totalRevenue / completed.length : 0;
const avgCostPerTrip = completed.length > 0 ? totalCost / completed.length : 0;
const avgProfitPerTrip = completed.length > 0 ? netProfit / completed.length : 0;

const monthlyFixedCost = getMonthlyFixedCost();
// Contribution margin = revenue/trip - variable cost/trip (excl. fixed allocation)
const avgVariableCostPerTrip = completed.length > 0
  ? completed.reduce((s, t) => s + t.driver_cost + t.fuel_cost + t.toll_fee, 0) / completed.length
  : 325;
const avgContribMargin = avgRevPerTrip - avgVariableCostPerTrip;
const breakEvenTrips = Math.ceil(monthlyFixedCost / Math.max(avgContribMargin, 1));
const prevMonthProfit = 11260;
const profitChange = prevMonthProfit > 0 ? ((netProfit - prevMonthProfit) / prevMonthProfit) * 100 : 0;
const avgMonthlyNetProfit = 9552; // avg of last 5 months
const paybackMonths = Math.ceil(800000 / avgMonthlyNetProfit);

const insights = [
  {
    type: netProfit > prevMonthProfit ? "success" : "warning",
    text: `กำไรเดือนนี้ ${netProfit > prevMonthProfit ? "สูงกว่า" : "ต่ำกว่า"}เดือนที่แล้ว ${Math.abs(profitChange).toFixed(1)}%`,
  },
  {
    type: completed.length < breakEvenTrips ? "warning" : "success",
    text: completed.length < breakEvenTrips
      ? `ต้องรับงานเพิ่มอีก ${breakEvenTrips - completed.length} รอบเพื่อ Break-even`
      : "รับงานถึง Break-even แล้วเดือนนี้",
  },
  {
    type: avgProfitPerTrip < 150 ? "error" : "info",
    text: `กำไรเฉลี่ยต่อรอบอยู่ที่ ${formatBaht(Math.round(avgProfitPerTrip))}`,
  },
  { type: "info", text: `คาดว่ารถจะคืนทุนใน ${paybackMonths} เดือน (ซื้อมา 6 เดือนแล้ว)` },
];

const insightIcons = {
  success: <CheckCircle size={13} className="text-[#2D6A4F] shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />,
  error:   <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />,
  info:    <Info size={13} className="text-[#40916C] shrink-0 mt-0.5" />,
};

export default function OverviewPage() {
  const recentTrips = [...trips].sort((a, b) => b.job_date.localeCompare(a.job_date)).slice(0, 10);
  const cancelledCount = trips.filter((t) => t.trip_status === "cancelled").length;
  const pendingCount = trips.filter((t) => ["pending", "assigned", "in_progress"].includes(t.trip_status)).length;
  const incompleteCount = trips.filter((t) => t.trip_status === "incomplete").length;
  const noDriverPending = trips.filter((t) => !t.assigned_driver_id && !["cancelled", "incomplete"].includes(t.trip_status)).length;

  return (
    <>
      <TopBar title="ภาพรวมธุรกิจ" subtitle="มิถุนายน 2569" />
      <div className="p-6 space-y-5">

        {/* KPI Row 1 — first card is featured (dark green) */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard featured label="รายได้รวม" value={formatBaht(totalRevenue)} change={12.4} changeLabel="vs เดือนก่อน" icon={<DollarSign size={14} />} />
          <KpiCard label="ต้นทุนรวม" value={formatBaht(totalCost)} change={8.1} changeLabel="vs เดือนก่อน" icon={<DollarSign size={14} />} />
          <KpiCard label="กำไรสุทธิ" value={formatBaht(netProfit)} change={profitChange} changeLabel="vs เดือนก่อน" icon={<TrendingUp size={14} />} valueColor={netProfit >= 0 ? "text-[#1B4332]" : "text-red-600"} />
          <KpiCard label="Profit Margin" value={formatPercent(profitMargin)} change={1.5} changeLabel="vs เดือนก่อน" icon={<Percent size={14} />} />
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            label="จำนวนรอบ"
            value={`${formatNumber(trips.length)} รอบ`}
            subValue={`เสร็จ ${completed.length} | ยกเลิก ${cancelledCount} | รอ ${pendingCount}`}
            icon={<Hash size={14} />}
          />
          <KpiCard label="รายได้เฉลี่ย/รอบ" value={formatBaht(Math.round(avgRevPerTrip))} icon={<DollarSign size={14} />} />
          <KpiCard label="ต้นทุนเฉลี่ย/รอบ" value={formatBaht(Math.round(avgCostPerTrip))} icon={<DollarSign size={14} />} />
          <KpiCard label="กำไรเฉลี่ย/รอบ" value={formatBaht(Math.round(avgProfitPerTrip))} valueColor={avgProfitPerTrip >= 150 ? "text-[#1B4332]" : "text-red-600"} icon={<TrendingUp size={14} />} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader><CardTitle>รายได้ ต้นทุน และกำไร (6 เดือน)</CardTitle></CardHeader>
            <TrendChart data={trendData} />
          </Card>
          <Card>
            <CardHeader><CardTitle>สัดส่วนต้นทุน</CardTitle></CardHeader>
            <CostDonut data={costDonutData} />
          </Card>
        </div>

        {/* Trip Volume */}
        <Card>
          <CardHeader><CardTitle>จำนวนรอบรายวัน (มิถุนายน 2569)</CardTitle></CardHeader>
          <TripBar data={tripBarData} />
        </Card>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Recent Jobs Table */}
          <div className="col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <CardTitle>งานล่าสุด</CardTitle>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFAFA]">
                    {["Job ID", "วันที่", "ลูกค้า", "คนขับ", "รายได้", "กำไร", "สถานะ"].map((h) => (
                      <th key={h} className={`py-2 px-3 text-xs font-semibold text-[#6B7280] ${["รายได้","กำไร"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((t) => (
                    <tr key={t.trip_id} className="border-t border-[#F3F4F6] hover:bg-[#F4F6F5] transition-colors">
                      <td className="py-2 px-3 text-xs font-mono text-[#9CA3AF]">{t.trip_id}</td>
                      <td className="py-2 px-3 text-xs text-[#374151]">{formatThaiDateShort(t.job_date)}</td>
                      <td className="py-2 px-3 text-sm">{t.customer_name}</td>
                      <td className="py-2 px-3 text-sm text-[#374151]">
                        {t.assigned_driver_name ?? <span className="text-red-500 text-xs">ไม่มีคนขับ</span>}
                      </td>
                      <td className="py-2 px-3 text-sm text-right">{t.trip_revenue.toLocaleString("th-TH")}</td>
                      <td className={`py-2 px-3 text-sm text-right font-medium ${t.net_profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                        {t.trip_status === "completed" ? t.net_profit.toLocaleString("th-TH") : "—"}
                      </td>
                      <td className="py-2 px-3"><StatusBadge status={t.trip_status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Insights Panel */}
          <Card>
            <CardHeader><CardTitle>ข้อมูลเชิงธุรกิจ</CardTitle></CardHeader>
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="flex gap-2 text-sm text-[#374151] leading-snug">
                  {insightIcons[ins.type as keyof typeof insightIcons]}
                  <span>{ins.text}</span>
                </div>
              ))}

              <div className="mt-4 pt-3 border-t border-[#F3F4F6]">
                <div className="flex justify-between text-xs text-[#6B7280] mb-1.5">
                  <span>ความคืบหน้า Break-even</span>
                  <span>{completed.length} / {breakEvenTrips} รอบ</span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                  <div
                    className="bg-[#1B4332] h-2 rounded-full"
                    style={{ width: `${Math.min((completed.length / breakEvenTrips) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[#6B7280] mt-1">ต้องรับ {breakEvenTrips} รอบ/เดือน</p>
              </div>

              {incompleteCount > 0 && (
                <div className="p-2.5 bg-red-50 rounded-md border border-red-100">
                  <p className="text-xs text-red-700 font-medium">⚠️ มี {incompleteCount} งานที่ข้อมูลไม่ครบ</p>
                </div>
              )}
              {noDriverPending > 0 && (
                <div className="p-2.5 bg-yellow-50 rounded-md border border-yellow-100">
                  <p className="text-xs text-yellow-700 font-medium">⚠️ มี {noDriverPending} งานที่ยังไม่มีคนขับ</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
