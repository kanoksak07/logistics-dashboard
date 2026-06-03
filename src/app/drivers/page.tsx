import { TopBar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getDriverStats, trips } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { Trophy, AlertTriangle } from "lucide-react";

export default function DriversPage() {
  const stats = getDriverStats().sort((a, b) => b.completed - a.completed);

  const issueList = trips.filter(
    (t) => (t.trip_status === "incomplete" || !t.assigned_driver_id) && t.trip_status !== "cancelled"
  );

  return (
    <>
      <TopBar title="ผลงานคนขับ" subtitle={`active ${stats.length} คน`} />
      <div className="p-3 md:p-6 space-y-3 md:space-y-5">

        {/* Driver Cards — mobile: 2 col, desktop: 4 col */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {stats.map((d, i) => (
            <Card key={d.driver_id} className="relative p-3 md:p-4">
              {i === 0 && <Trophy size={13} className="text-yellow-500 absolute top-3 right-3" />}

              {/* Header */}
              <div className="mb-2 md:mb-3">
                <p className="text-sm font-bold text-[#111827]">{d.driver_name}</p>
                <p className="text-[10px] text-[#6B7280]">อันดับ {i + 1}</p>
              </div>

              {/* Stats grid */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">รับ</span>
                  <span className="font-medium">{d.assigned} รอบ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">เสร็จ</span>
                  <span className="font-semibold text-green-700">{d.completed} รอบ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">ยกเลิก</span>
                  <span className={d.cancelled > 2 ? "text-red-600 font-medium" : ""}>{d.cancelled} รอบ</span>
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                    <div className="bg-[#1B4332] h-1.5 rounded-full"
                      style={{ width: `${d.assigned > 0 ? (d.completed / d.assigned) * 100 : 0}%` }} />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5 text-right">
                    {d.assigned > 0 ? ((d.completed / d.assigned) * 100).toFixed(0) : 0}%
                  </p>
                </div>

                <hr className="border-[#F3F4F6]" />

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">กำไร</span>
                  <span className={`font-semibold ${d.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {formatNumber(Math.round(d.profit))} ฿
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">กำไร/รอบ</span>
                  <span className={`font-semibold ${d.avg_profit >= 150 ? "text-green-700" : "text-red-600"}`}>
                    {formatNumber(Math.round(d.avg_profit))} ฿
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Ranking Table — scrollable on mobile */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <CardTitle>ตารางอันดับคนขับ</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  {["#", "คนขับ", "รับ", "เสร็จ", "ยกเลิก", "กำไรรวม", "กำไร/รอบ", "สำเร็จ%"].map((h) => (
                    <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map((d, i) => {
                  const rate = d.assigned > 0 ? (d.completed / d.assigned) * 100 : 0;
                  return (
                    <tr key={d.driver_id} className="border-b border-[#F3F4F6] hover:bg-[#F4F6F5]">
                      <td className="py-2.5 px-3">
                        <span className={`text-xs font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-[#9CA3AF]"}`}>{i + 1}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold whitespace-nowrap">{d.driver_name}</td>
                      <td className="py-2.5 px-3 text-[#374151]">{d.assigned}</td>
                      <td className="py-2.5 px-3 text-green-700 font-medium">{d.completed}</td>
                      <td className={`py-2.5 px-3 ${d.cancelled > 2 ? "text-red-600 font-medium" : "text-[#374151]"}`}>{d.cancelled}</td>
                      <td className={`py-2.5 px-3 font-medium whitespace-nowrap ${d.profit >= 0 ? "text-green-700" : "text-red-600"}`}>{formatNumber(Math.round(d.profit))} ฿</td>
                      <td className={`py-2.5 px-3 font-medium whitespace-nowrap ${d.avg_profit >= 150 ? "text-green-700" : "text-red-600"}`}>{formatNumber(Math.round(d.avg_profit))} ฿</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-[#F3F4F6] rounded-full h-1.5">
                            <div className="bg-[#1B4332] h-1.5 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs text-[#6B7280]">{rate.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Issue List */}
        {issueList.length > 0 && (
          <Card>
            <CardHeader><CardTitle>งานที่ต้องตรวจสอบ</CardTitle></CardHeader>
            <div className="space-y-2">
              {issueList.map((t) => (
                <div key={t.trip_id} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <AlertTriangle size={13} className="text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-[#374151]">
                    <span className="font-semibold">{t.trip_id}</span> — {t.customer_name}
                    <span className="text-[#6B7280]"> · {!t.assigned_driver_id ? "ยังไม่มีคนขับ" : "ข้อมูลไม่ครบ"}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
