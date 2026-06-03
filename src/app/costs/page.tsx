"use client";

import { useDashboardData } from "@/lib/use-dashboard-data";
import { TopBar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
const CostDonut = dynamic(() => import("@/components/charts/cost-donut").then(m => ({ default: m.CostDonut })), { ssr: false });
import { formatBaht, formatThaiDateShort } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

const FIXED_PER_TRIP = 135;

export default function CostsPage() {
  const { trips, costs, isLoading, isUsingMockData, lastUpdated, refresh } = useDashboardData();

  const completed = trips.filter(t => t.trip_status === "completed");
  const n = completed.length || 1;
  const driverCost = completed.reduce((s, t) => s + t.driver_cost, 0);
  const fuelCost = completed.reduce((s, t) => s + t.fuel_cost, 0);
  const tollCost = completed.reduce((s, t) => s + t.toll_fee, 0);
  const fixedCostAllocated = completed.length * FIXED_PER_TRIP;
  const totalCost = driverCost + fuelCost + tollCost + fixedCostAllocated;
  const abnormal = completed.filter(t => t.fuel_cost > 120);

  const donutData = [
    { name: "ค่าคนขับ", value: driverCost || 1 },
    { name: "ค่าน้ำมัน", value: fuelCost || 1 },
    { name: "ค่าทางด่วน", value: tollCost || 1 },
    { name: "ต้นทุนคงที่", value: fixedCostAllocated || 1 },
  ];

  return (
    <>
      <TopBar title="ต้นทุน" subtitle="มิถุนายน 2569" lastUpdated={lastUpdated} isUsingMockData={isUsingMockData} onRefresh={refresh} />
      <div className="p-3 md:p-6 space-y-3 md:space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <KpiCard label="ต้นทุนรวม" value={formatBaht(totalCost)} change={8.1} changeLabel="vs เดือนก่อน" />
          <KpiCard label="ต้นทุนเฉลี่ย/รอบ" value={formatBaht(Math.round(totalCost / n))} />
          <KpiCard label="ค่าน้ำมัน/รอบ" value={formatBaht(Math.round(fuelCost / n))} />
          <KpiCard label="ค่าทางด่วน/รอบ" value={formatBaht(Math.round(tollCost / n))} />
        </div>

        {/* Charts + Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardHeader><CardTitle>สัดส่วนต้นทุน</CardTitle></CardHeader>
            <CostDonut data={donutData} />
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>รายละเอียดต้นทุน</CardTitle></CardHeader>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["ประเภทต้นทุน", "ชนิด", "รวมเดือนนี้", "เฉลี่ย/รอบ", "% ของต้นทุนรวม"].map((h) => (
                    <th key={h} className="py-2 px-3 text-xs font-semibold text-[#6B7280] text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "ค่าคนขับ",   type: "Variable", amount: driverCost },
                  { name: "ค่าน้ำมัน",  type: "Variable", amount: fuelCost },
                  { name: "ค่าทางด่วน", type: "Variable", amount: tollCost },
                  { name: `ต้นทุนคงที่ (${FIXED_PER_TRIP} ฿/รอบ × ${completed.length} รอบ)`, type: "Fixed", amount: fixedCostAllocated },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-[#F3F4F6] hover:bg-[#F4F6F5]">
                    <td className="py-2.5 px-3 font-medium">{row.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${row.type === "Fixed" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{row.amount.toLocaleString("th-TH")} ฿</td>
                    <td className="py-2.5 px-3">{Math.round(row.amount / n).toLocaleString("th-TH")} ฿</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#F3F4F6] rounded-full h-1.5">
                          <div className="bg-[#1B4332] h-1.5 rounded-full" style={{ width: `${totalCost > 0 ? (row.amount / totalCost) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-[#6B7280]">{totalCost > 0 ? ((row.amount / totalCost) * 100).toFixed(1) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#FAFAFA] font-semibold">
                  <td className="py-2.5 px-3">รวมทั้งหมด</td>
                  <td className="py-2.5 px-3"></td>
                  <td className="py-2.5 px-3">{totalCost.toLocaleString("th-TH")} ฿</td>
                  <td className="py-2.5 px-3">{Math.round(totalCost / n).toLocaleString("th-TH")} ฿</td>
                  <td className="py-2.5 px-3 text-xs text-[#6B7280]">100%</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* Abnormal Cost Alert */}
        {abnormal.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-600" />
                <CardTitle>ต้นทุนผิดปกติ — ค่าน้ำมัน/รอบ &gt; 120 บาท</CardTitle>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {["Job ID", "วันที่", "คนขับ", "ค่าน้ำมัน", "หมายเหตุ"].map((h) => (
                      <th key={h} className="py-2 px-3 text-xs font-semibold text-[#6B7280] text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {abnormal.map((t) => (
                    <tr key={t.trip_id} className="border-b border-[#F3F4F6] bg-yellow-50/50">
                      <td className="py-2 px-3 text-xs font-mono text-[#9CA3AF]">{t.trip_id}</td>
                      <td className="py-2 px-3 text-xs">{formatThaiDateShort(t.job_date)}</td>
                      <td className="py-2 px-3 text-sm">{t.assigned_driver_name}</td>
                      <td className="py-2 px-3 text-sm font-medium text-yellow-700">{t.fuel_cost} ฿</td>
                      <td className="py-2 px-3 text-xs text-[#6B7280]">{t.remark || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Cost Records from Google Sheets */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
            <CardTitle>รายการต้นทุนเพิ่มเติม</CardTitle>
            <span className="text-xs text-[#6B7280]">{costs.length} รายการ</span>
          </div>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-[#6B7280]">กำลังโหลด...</div>
          ) : costs.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#6B7280]">
              <p>ยังไม่มีข้อมูล</p>
              <p className="text-xs mt-1">เพิ่มข้อมูลใน Google Sheets Sheet "costs"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-[#FAFAFA]">
                  <tr>
                    {["วันที่", "ประเภท", "รายการ", "จำนวน", "ผู้จ่าย", "หมายเหตุ"].map((h) => (
                      <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {costs.map((c, i) => (
                    <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F4F6F5]">
                      <td className="py-2.5 px-3 text-xs whitespace-nowrap">{formatThaiDateShort(c.cost_date)}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{c.cost_category}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium">{c.cost_name}</td>
                      <td className="py-2.5 px-3 font-medium whitespace-nowrap">{c.cost_amount.toLocaleString("th-TH")} ฿</td>
                      <td className="py-2.5 px-3 text-xs text-[#6B7280]">{c.who_paid || "—"}</td>
                      <td className="py-2.5 px-3 text-xs text-[#6B7280]">{c.remark || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
