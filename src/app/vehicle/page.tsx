import { TopBar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { vehicles, costRecords, getCompletedTrips, getTotalRevenue, getNetProfit } from "@/lib/mock-data";
import { formatBaht, formatThaiDateShort } from "@/lib/utils";

const v = vehicles[0];
const completed = getCompletedTrips();
const totalRevenue = getTotalRevenue();
const netProfit = getNetProfit();
const avgMonthlyProfit = 9552; // avg of last 5 months
const paybackMonths = Math.ceil(v.purchase_cost / avgMonthlyProfit);
const monthsOwned = 6;
const recoveredSoFar = avgMonthlyProfit * monthsOwned;
const recoveryPct = Math.min((recoveredSoFar / v.purchase_cost) * 100, 100);

const monthlyFixed = 13333 + v.insurance_cost_per_year / 12 + 2000 + 500;
// Contribution margin = avg revenue/trip - avg variable cost/trip
const avgVarCost = completed.length > 0
  ? completed.reduce((s, t) => s + t.driver_cost + t.fuel_cost + t.toll_fee, 0) / completed.length
  : 325;
const avgContrib = (totalRevenue / Math.max(completed.length, 1)) - avgVarCost;
const breakEvenTrips = Math.ceil(monthlyFixed / Math.max(avgContrib, 1));

const maintenanceRecords = costRecords.filter((c) => c.cost_category === "Maintenance");

export default function VehiclePage() {
  return (
    <>
      <TopBar title="รถและต้นทุน" subtitle="Vehicle Cost & Payback" />
      <div className="p-6 space-y-5">

        {/* Vehicle Card */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#111827]">{v.vehicle_name}</h3>
                <p className="text-xs text-[#6B7280]">ทะเบียน {v.license_plate}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">Active</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#6B7280]">ราคาซื้อ</p>
                <p className="font-semibold">{formatBaht(v.purchase_cost)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">วันที่ซื้อ</p>
                <p>{formatThaiDateShort(v.purchase_date)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">ประกันรายปี</p>
                <p>{formatBaht(v.insurance_cost_per_year)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">งบซ่อมบำรุง/เดือน</p>
                <p>{formatBaht(v.maintenance_budget_per_month)}</p>
              </div>
            </div>
          </Card>

          <KpiCard label="รอบทั้งหมด" value={`${completed.length} รอบ`} subValue={`ตั้งแต่ซื้อรถ 6 เดือนที่แล้ว`} />
          <KpiCard label="กำไรสะสม" value={formatBaht(recoveredSoFar)} subValue={`ของเป้า ${formatBaht(v.purchase_cost)}`} />
        </div>

        {/* Payback Progress */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>ความคืบหน้าการคืนทุน</CardTitle>
              <span className="text-xs text-[#6B7280]">คาดว่าคืนทุนใน {paybackMonths} เดือน</span>
            </div>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>คืนทุนแล้ว</span>
              <span>{formatBaht(recoveredSoFar)} / {formatBaht(v.purchase_cost)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#F3F4F6] rounded-full h-3">
                <div
                  className="bg-[#1B4332] h-3 rounded-full transition-all"
                  style={{ width: `${recoveryPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[#1B4332] w-12 text-right">{recoveryPct.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>ซื้อมา {monthsOwned} เดือน</span>
              <span>เหลืออีก {paybackMonths - monthsOwned} เดือน (ถ้าทำกำไรเฉลี่ย {formatBaht(avgMonthlyProfit)}/เดือน)</span>
            </div>
          </div>
        </Card>

        {/* Fixed Cost + Break-even */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>ต้นทุนคงที่รายเดือน</CardTitle></CardHeader>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { name: "ค่าเสื่อมราคารถ (800,000 / 60 เดือน)", amount: 13333 },
                  { name: "ค่าประกันภัย (20,000 / 12 เดือน)", amount: Math.round(v.insurance_cost_per_year / 12) },
                  { name: "ค่าจอดรถ", amount: 2000 },
                  { name: "ค่าโทรศัพท์/internet", amount: 500 },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-[#F3F4F6]">
                    <td className="py-2 text-[#374151]">{row.name}</td>
                    <td className="py-2 text-right font-medium">{row.amount.toLocaleString("th-TH")} ฿</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-[#FAFAFA]">
                  <td className="py-2.5">รวมต้นทุนคงที่</td>
                  <td className="py-2.5 text-right">{monthlyFixed.toLocaleString("th-TH")} ฿</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHeader><CardTitle>Break-even Calculator</CardTitle></CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">ต้นทุนคงที่/เดือน</span>
                <span className="font-medium">{formatBaht(Math.round(monthlyFixed))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">รายได้เฉลี่ย/รอบ</span>
                <span className="font-medium">{formatBaht(640)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">ต้นทุนผันแปรเฉลี่ย/รอบ</span>
                <span className="font-medium">{formatBaht(331)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Contribution Margin/รอบ</span>
                <span className="font-medium text-green-700">{formatBaht(309)}</span>
              </div>
              <hr className="border-[#E5E7EB]" />
              <div className="flex justify-between text-base font-bold">
                <span>Break-even</span>
                <span className="text-[#1B4332]">{breakEvenTrips} รอบ/เดือน</span>
              </div>
              <div className="p-2.5 rounded-md border mt-2 text-xs" style={{ borderColor: completed.length >= breakEvenTrips ? "#BBF7D0" : "#FDE68A", backgroundColor: completed.length >= breakEvenTrips ? "#F0FDF4" : "#FFFBEB" }}>
                {completed.length >= breakEvenTrips
                  ? `✅ เดือนนี้รับงาน ${completed.length} รอบ — ถึง Break-even แล้ว`
                  : `⚠️ เดือนนี้รับงาน ${completed.length} รอบ — ต้องเพิ่มอีก ${breakEvenTrips - completed.length} รอบ`}
              </div>
            </div>
          </Card>
        </div>

        {/* Maintenance History */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <CardTitle>ประวัติการซ่อมบำรุง</CardTitle>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFA]">
              <tr>
                {["วันที่", "รายการ", "ค่าใช้จ่าย"].map((h) => (
                  <th key={h} className="py-2.5 px-4 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {maintenanceRecords.map((c) => (
                <tr key={c.cost_id} className="border-b border-[#F3F4F6] hover:bg-[#F4F6F5]">
                  <td className="py-2.5 px-4 text-xs">{formatThaiDateShort(c.cost_date)}</td>
                  <td className="py-2.5 px-4">{c.remark}</td>
                  <td className="py-2.5 px-4 font-medium">{c.cost_amount.toLocaleString("th-TH")} ฿</td>
                </tr>
              ))}
              {maintenanceRecords.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-sm text-[#6B7280]">ยังไม่มีประวัติการซ่อมบำรุง</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
