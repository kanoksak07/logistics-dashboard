"use client";

import { useDashboardData } from "@/lib/use-dashboard-data";
import { TopBar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { monthlyTrend } from "@/lib/mock-data";
import { Trip } from "@/lib/mock-data";
import { formatBaht, formatNumber, formatPercent, formatThaiDateShort } from "@/lib/utils";
import { DollarSign, TrendingUp, Percent, Hash, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";

const TrendChart = dynamic(() => import("@/components/charts/trend-chart").then(m => ({ default: m.TrendChart })), { ssr: false });
const CostDonut  = dynamic(() => import("@/components/charts/cost-donut").then(m => ({ default: m.CostDonut })),   { ssr: false });
const TripBar    = dynamic(() => import("@/components/charts/trip-bar").then(m => ({ default: m.TripBar })),       { ssr: false });

const FIXED_PER_TRIP = 135;

function calcStats(trips: Trip[]) {
  const completed = trips.filter(t => t.trip_status === "completed");
  const totalRevenue = completed.reduce((s, t) => s + t.trip_revenue, 0);
  const totalCost = completed.reduce((s, t) => s + t.total_cost, 0);
  const netProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const n = completed.length || 1;
  const driverCost = completed.reduce((s, t) => s + t.driver_cost, 0);
  const fuelCost = completed.reduce((s, t) => s + t.fuel_cost, 0);
  const tollCost = completed.reduce((s, t) => s + t.toll_fee, 0);
  const fixedAllocated = completed.length * FIXED_PER_TRIP;
  const monthlyFixedCost = 17500;
  const avgVarCost = completed.reduce((s, t) => s + t.driver_cost + t.fuel_cost + t.toll_fee, 0) / n;
  const avgRevPerTrip = totalRevenue / n;
  const avgContrib = avgRevPerTrip - avgVarCost;
  const breakEvenTrips = Math.ceil(monthlyFixedCost / Math.max(avgContrib, 1));
  return {
    completed, totalRevenue, totalCost, netProfit, profitMargin, n,
    driverCost, fuelCost, tollCost, fixedAllocated,
    avgRevPerTrip: totalRevenue / n,
    avgCostPerTrip: totalCost / n,
    avgProfitPerTrip: netProfit / n,
    breakEvenTrips,
  };
}

const insightIcons = {
  success: <CheckCircle size={13} className="text-[#2D6A4F] shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />,
  error:   <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />,
  info:    <Info size={13} className="text-[#40916C] shrink-0 mt-0.5" />,
};

export default function OverviewPage() {
  const { trips, isLoading, isUsingMockData, lastUpdated, refresh } = useDashboardData();

  const s = calcStats(trips);
  const cancelledCount = trips.filter(t => t.trip_status === "cancelled").length;
  const pendingCount = trips.filter(t => ["pending","assigned","in_progress"].includes(t.trip_status)).length;
  const incompleteCount = trips.filter(t => t.trip_status === "incomplete").length;
  const noDriverPending = trips.filter(t => !t.assigned_driver_id && !["cancelled","incomplete"].includes(t.trip_status)).length;

  const prevMonthProfit = 11260;
  const profitChange = prevMonthProfit > 0 ? ((s.netProfit - prevMonthProfit) / prevMonthProfit) * 100 : 0;
  const paybackMonths = Math.ceil(800000 / 9552);

  const trendData = monthlyTrend.map(m => {
    if (m.month === "มิ.ย.") return { month: m.month, revenue: s.totalRevenue, cost: s.totalCost, profit: s.netProfit };
    return m;
  });

  const costDonutData = [
    { name: "ค่าคนขับ", value: s.driverCost || 1 },
    { name: "ค่าน้ำมัน", value: s.fuelCost || 1 },
    { name: "ค่าทางด่วน", value: s.tollCost || 1 },
    { name: "ต้นทุนคงที่", value: s.fixedAllocated || 1 },
  ];

  const tripsByDay: Record<string, number> = {};
  trips.forEach(t => {
    if (t.trip_status === "completed" && t.job_date) {
      const day = t.job_date.slice(8);
      tripsByDay[day] = (tripsByDay[day] || 0) + 1;
    }
  });
  const tripBarData = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return { day: `${i + 1}`, trips: tripsByDay[day] || 0 };
  }).filter((_, i) => i < 21);

  const recentTrips = [...trips].sort((a, b) => b.job_date.localeCompare(a.job_date)).slice(0, 10);

  const insights = [
    {
      type: s.netProfit > prevMonthProfit ? "success" : "warning",
      text: `กำไรเดือนนี้ ${s.netProfit > prevMonthProfit ? "สูงกว่า" : "ต่ำกว่า"}เดือนที่แล้ว ${Math.abs(profitChange).toFixed(1)}%`,
    },
    {
      type: s.completed.length < s.breakEvenTrips ? "warning" : "success",
      text: s.completed.length < s.breakEvenTrips
        ? `ต้องรับงานเพิ่มอีก ${s.breakEvenTrips - s.completed.length} รอบเพื่อ Break-even`
        : "รับงานถึง Break-even แล้วเดือนนี้",
    },
    {
      type: s.avgProfitPerTrip < 150 ? "error" : "info",
      text: `กำไรเฉลี่ยต่อรอบอยู่ที่ ${formatBaht(Math.round(s.avgProfitPerTrip))}`,
    },
    { type: "info", text: `คาดว่ารถจะคืนทุนใน ${paybackMonths} เดือน` },
  ];

  return (
    <>
      <TopBar
        title="ภาพรวมธุรกิจ"
        subtitle="มิถุนายน 2569"
        lastUpdated={lastUpdated}
        isUsingMockData={isUsingMockData}
        onRefresh={refresh}
      />
      <div className="p-6 space-y-5">

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Loader2 size={14} className="animate-spin" />
            กำลังโหลดข้อมูลจาก Google Sheets...
          </div>
        )}

        {/* KPI Row 1 */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard featured label="รายได้รวม" value={formatBaht(s.totalRevenue)} change={12.4} changeLabel="vs เดือนก่อน" icon={<DollarSign size={14} />} />
          <KpiCard label="ต้นทุนรวม" value={formatBaht(s.totalCost)} change={8.1} changeLabel="vs เดือนก่อน" icon={<DollarSign size={14} />} />
          <KpiCard label="กำไรสุทธิ" value={formatBaht(s.netProfit)} change={profitChange} changeLabel="vs เดือนก่อน" icon={<TrendingUp size={14} />} valueColor={s.netProfit >= 0 ? "text-[#1B4332]" : "text-red-600"} />
          <KpiCard label="Profit Margin" value={formatPercent(s.profitMargin)} change={1.5} changeLabel="vs เดือนก่อน" icon={<Percent size={14} />} />
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            label="จำนวนรอบ"
            value={`${formatNumber(trips.length)} รอบ`}
            subValue={`เสร็จ ${s.completed.length} | ยกเลิก ${cancelledCount} | รอ ${pendingCount}`}
            icon={<Hash size={14} />}
          />
          <KpiCard label="รายได้เฉลี่ย/รอบ" value={formatBaht(Math.round(s.avgRevPerTrip))} icon={<DollarSign size={14} />} />
          <KpiCard label="ต้นทุนเฉลี่ย/รอบ" value={formatBaht(Math.round(s.avgCostPerTrip))} icon={<DollarSign size={14} />} />
          <KpiCard label="กำไรเฉลี่ย/รอบ" value={formatBaht(Math.round(s.avgProfitPerTrip))} valueColor={s.avgProfitPerTrip >= 150 ? "text-[#1B4332]" : "text-red-600"} icon={<TrendingUp size={14} />} />
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
          <div className="col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <CardTitle>งานล่าสุด</CardTitle>
              </div>
              {recentTrips.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#6B7280]">
                  <p className="mb-1">ยังไม่มีข้อมูลงาน</p>
                  <p className="text-xs">เพิ่มข้อมูลใน Google Sheets Sheet "trips"</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#FAFAFA]">
                      {["Job ID","วันที่","ลูกค้า","คนขับ","รายได้","กำไร","สถานะ"].map(h => (
                        <th key={h} className={`py-2 px-3 text-xs font-semibold text-[#6B7280] ${["รายได้","กำไร"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrips.map(t => (
                      <tr key={t.trip_id} className="border-t border-[#F3F4F6] hover:bg-[#F4F6F5] transition-colors">
                        <td className="py-2 px-3 text-xs font-mono text-[#9CA3AF]">{t.trip_id}</td>
                        <td className="py-2 px-3 text-xs text-[#374151]">{formatThaiDateShort(t.job_date)}</td>
                        <td className="py-2 px-3 text-sm">{t.customer_name}</td>
                        <td className="py-2 px-3 text-sm text-[#374151]">
                          {t.assigned_driver_name ?? <span className="text-red-500 text-xs">ไม่มีคนขับ</span>}
                        </td>
                        <td className="py-2 px-3 text-sm text-right">{t.trip_revenue.toLocaleString("th-TH")}</td>
                        <td className={`py-2 px-3 text-sm text-right font-medium ${t.net_profit >= 0 ? "text-[#1B4332]" : "text-red-600"}`}>
                          {t.trip_status === "completed" ? t.net_profit.toLocaleString("th-TH") : "—"}
                        </td>
                        <td className="py-2 px-3"><StatusBadge status={t.trip_status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>

          {/* Insights */}
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
                  <span>Break-even Progress</span>
                  <span>{s.completed.length} / {s.breakEvenTrips} รอบ</span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                  <div className="bg-[#1B4332] h-2 rounded-full" style={{ width: `${Math.min((s.completed.length / Math.max(s.breakEvenTrips, 1)) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-[#6B7280] mt-1">ต้องรับ {s.breakEvenTrips} รอบ/เดือน</p>
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
