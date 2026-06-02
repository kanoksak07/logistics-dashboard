import { TopBar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { TrendChart } from "@/components/charts/trend-chart";
import {
  trips,
  monthlyTrend,
  getCompletedTrips,
  getTotalRevenue,
  getTotalCost,
  getNetProfit,
  getProfitMargin,
  getDriverStats,
} from "@/lib/mock-data";
import { formatBaht, formatPercent, formatThaiDateShort } from "@/lib/utils";

const completed = getCompletedTrips();
const totalRevenue = getTotalRevenue();
const totalCost = getTotalCost();
const netProfit = getNetProfit();
const profitMargin = getProfitMargin();
const n = completed.length || 1;
const avgRevPerTrip = totalRevenue / n;
const avgProfitPerTrip = netProfit / n;

const profitable = completed.filter((t) => t.net_profit >= 0);
const unprofitable = completed.filter((t) => t.net_profit < 0);

const driverStats = getDriverStats();

const trendData = monthlyTrend.map((m) => {
  if (m.month === "มิ.ย.") {
    return { month: m.month, revenue: totalRevenue, cost: totalCost, profit: netProfit };
  }
  return m;
});

export default function RevenuePage() {
  return (
    <>
      <TopBar title="รายได้ & กำไร" subtitle="มิถุนายน 2569" />
      <div className="p-6 space-y-5">

        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="รายได้รวม" value={formatBaht(totalRevenue)} change={12.4} changeLabel="vs เดือนก่อน" />
          <KpiCard label="กำไรสุทธิ" value={formatBaht(netProfit)} valueColor="text-green-700" change={11.2} changeLabel="vs เดือนก่อน" />
          <KpiCard label="Profit Margin" value={formatPercent(profitMargin)} change={1.5} changeLabel="vs เดือนก่อน" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="รายได้เฉลี่ย/รอบ" value={formatBaht(Math.round(avgRevPerTrip))} />
          <KpiCard label="กำไรเฉลี่ย/รอบ" value={formatBaht(Math.round(avgProfitPerTrip))} valueColor={avgProfitPerTrip >= 150 ? "text-green-700" : "text-red-700"} />
          <div className="grid grid-cols-2 gap-4">
            <KpiCard label="รอบที่กำไร" value={`${profitable.length} รอบ`} valueColor="text-green-700" />
            <KpiCard label="รอบที่ขาดทุน" value={`${unprofitable.length} รอบ`} valueColor="text-red-700" />
          </div>
        </div>

        {/* Trend */}
        <Card>
          <CardHeader><CardTitle>แนวโน้มรายได้และกำไร (6 เดือน)</CardTitle></CardHeader>
          <TrendChart data={trendData} />
        </Card>

        {/* Monthly Comparison */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <CardTitle>เปรียบเทียบรายเดือน</CardTitle>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {["เดือน", "รายได้", "ต้นทุน", "กำไร", "จำนวนรอบ", "กำไร/รอบ"].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trendData.filter((m) => m.revenue > 0).map((m) => (
                <tr key={m.month} className={`border-b border-[#F3F4F6] hover:bg-[#F8FAFC] ${m.month === "มิ.ย." ? "bg-blue-50/50" : ""}`}>
                  <td className="py-2.5 px-3 font-medium">{m.month}{m.month === "มิ.ย." && <span className="ml-1 text-xs text-[#2563EB]">(ปัจจุบัน)</span>}</td>
                  <td className="py-2.5 px-3">{m.revenue.toLocaleString("th-TH")} ฿</td>
                  <td className="py-2.5 px-3">{m.cost.toLocaleString("th-TH")} ฿</td>
                  <td className={`py-2.5 px-3 font-medium ${m.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {m.profit.toLocaleString("th-TH")} ฿
                  </td>
                  <td className="py-2.5 px-3">{"trips" in m && m.trips > 0 ? m.trips : completed.length}</td>
                  <td className="py-2.5 px-3 text-[#6B7280]">
                    {"trips" in m && m.trips > 0 ? Math.round(m.profit / m.trips).toLocaleString("th-TH") : Math.round(netProfit / n).toLocaleString("th-TH")} ฿
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {/* Profit by Driver */}
          <Card>
            <CardHeader><CardTitle>กำไรแยกตามคนขับ</CardTitle></CardHeader>
            <div className="space-y-3">
              {driverStats.sort((a, b) => b.profit - a.profit).map((d) => (
                <div key={d.driver_id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#374151]">{d.driver_name}</span>
                    <span className={`font-medium ${d.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {d.profit.toLocaleString("th-TH")} ฿
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                    <div
                      className="bg-[#2563EB] h-1.5 rounded-full"
                      style={{ width: `${(d.profit / Math.max(...driverStats.map(ds => ds.profit))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Unprofitable Trips */}
          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <CardTitle>รอบที่ขาดทุน ({unprofitable.length} รอบ)</CardTitle>
            </div>
            {unprofitable.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#6B7280]">ไม่มีรอบที่ขาดทุน 🎉</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    {["Job ID", "วันที่", "คนขับ", "รายได้", "ต้นทุน", "ขาดทุน"].map((h) => (
                      <th key={h} className="py-2 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unprofitable.map((t) => (
                    <tr key={t.trip_id} className="border-b border-[#F3F4F6] bg-red-50/30">
                      <td className="py-2 px-3 text-xs font-mono text-[#9CA3AF]">{t.trip_id}</td>
                      <td className="py-2 px-3 text-xs">{formatThaiDateShort(t.job_date)}</td>
                      <td className="py-2 px-3">{t.assigned_driver_name}</td>
                      <td className="py-2 px-3">{t.trip_revenue.toLocaleString("th-TH")}</td>
                      <td className="py-2 px-3">{t.total_cost.toLocaleString("th-TH")}</td>
                      <td className="py-2 px-3 text-red-600 font-medium">{t.net_profit.toLocaleString("th-TH")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
