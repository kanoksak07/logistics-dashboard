"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { trips, Trip, TripStatus } from "@/lib/mock-data";
import { formatThaiDateShort, formatBaht } from "@/lib/utils";
import { Search, X, MapPin, Phone, AlertTriangle } from "lucide-react";

const STATUS_OPTIONS: { value: TripStatus | "all"; label: string }[] = [
  { value: "all",        label: "ทุกสถานะ" },
  { value: "completed",  label: "เสร็จสิ้น" },
  { value: "in_progress",label: "กำลังดำเนินการ" },
  { value: "assigned",   label: "มอบหมายแล้ว" },
  { value: "pending",    label: "รอยืนยัน" },
  { value: "cancelled",  label: "ยกเลิก" },
  { value: "incomplete", label: "ข้อมูลไม่ครบ" },
];

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [selected, setSelected] = useState<Trip | null>(null);

  const filtered = trips.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.trip_id.toLowerCase().includes(q) ||
      t.customer_name.toLowerCase().includes(q) ||
      t.customer_phone.includes(q) ||
      (t.assigned_driver_name?.toLowerCase().includes(q) ?? false);
    const matchStatus = statusFilter === "all" || t.trip_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.job_date.localeCompare(a.job_date));

  return (
    <>
      <TopBar title="ติดตามงาน" subtitle={`ทั้งหมด ${trips.length} งาน`} />
      <div className="p-6 flex gap-4 h-[calc(100vh-56px)]">

        {/* Main Table */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Filters */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="ค้นหา Job ID, ลูกค้า, เบอร์, คนขับ"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#E5E7EB] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
              />
            </div>
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    statusFilter === s.value
                      ? "bg-[#1B4332] text-white border-[#1B4332]"
                      : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F4F6F5]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#6B7280] ml-auto">{sorted.length} รายการ</span>
          </div>

          {/* Table */}
          <Card className="p-0 overflow-hidden flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#FAFAFA] z-10">
                <tr>
                  {["Job ID", "วันที่", "ลูกค้า", "คนขับ", "โกดัง", "รายได้", "กำไร", "สถานะ", ""].map((h) => (
                    <th key={h} className={`py-2.5 px-3 text-xs font-semibold text-[#6B7280] border-b border-[#E5E7EB] ${["รายได้","กำไร"].includes(h) ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <tr
                    key={t.trip_id}
                    onClick={() => setSelected(t)}
                    className={`border-b border-[#F3F4F6] hover:bg-[#F4F6F5] cursor-pointer transition-colors ${selected?.trip_id === t.trip_id ? "bg-[#F0FDF4]" : ""}`}
                  >
                    <td className="py-2.5 px-3 text-xs font-mono text-[#9CA3AF]">{t.trip_id}</td>
                    <td className="py-2.5 px-3 text-xs text-[#374151]">{formatThaiDateShort(t.job_date)}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium">{t.customer_name}</div>
                      <div className="text-xs text-[#9CA3AF]">{t.customer_phone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-sm text-[#374151]">
                      {t.assigned_driver_name ?? (
                        <span className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertTriangle size={10} /> ไม่มีคนขับ
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#374151]">{t.warehouse_name}</td>
                    <td className="py-2.5 px-3 text-sm text-right">{t.trip_revenue.toLocaleString("th-TH")}</td>
                    <td className={`py-2.5 px-3 text-sm text-right font-medium ${t.net_profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {t.trip_status === "completed" ? t.net_profit.toLocaleString("th-TH") : "—"}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <StatusBadge status={t.trip_status} />
                        {!t.google_map_link && (
                          <span title="ไม่มี Google Map" className="text-yellow-500 text-xs">⚠️</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#9CA3AF]">›</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-sm text-[#6B7280]">
                      ไม่พบงานที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Side Panel */}
        {selected && (
          <div className="w-72 shrink-0">
            <Card className="h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#111827]">รายละเอียดงาน</h3>
                <button onClick={() => setSelected(null)} className="text-[#9CA3AF] hover:text-[#374151]">
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Job ID</p>
                  <p className="font-mono text-xs text-[#374151]">{selected.trip_id}</p>
                </div>

                <div className="flex gap-2">
                  <StatusBadge status={selected.trip_status} />
                  {!selected.google_map_link && (
                    <span className="text-xs text-yellow-600 flex items-center gap-0.5">
                      <AlertTriangle size={10} /> ไม่มี Map
                    </span>
                  )}
                </div>

                <hr className="border-[#F3F4F6]" />

                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">วันที่รับ</p>
                  <p>{formatThaiDateShort(selected.pickup_date)} เวลา {selected.pickup_time}</p>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">ลูกค้า</p>
                  <p className="font-medium">{selected.customer_name}</p>
                  <p className="text-xs text-[#6B7280] flex items-center gap-1">
                    <Phone size={10} /> {selected.customer_phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">ที่อยู่รับ</p>
                  <p className="text-xs text-[#374151] leading-relaxed">{selected.pickup_address}</p>
                  {selected.google_map_link ? (
                    <a href={selected.google_map_link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#1B4332] flex items-center gap-0.5 mt-0.5 hover:underline">
                      <MapPin size={10} /> ดูแผนที่
                    </a>
                  ) : (
                    <span className="text-xs text-yellow-600">ไม่มี Google Map</span>
                  )}
                </div>

                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">โกดัง</p>
                  <p>{selected.warehouse_name}</p>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">คนขับ</p>
                  {selected.assigned_driver_name ? (
                    <p>{selected.assigned_driver_name}</p>
                  ) : (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertTriangle size={10} /> ยังไม่มีคนขับ
                    </p>
                  )}
                </div>

                <hr className="border-[#F3F4F6]" />

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">การเงิน</p>
                  {[
                    { label: "รายได้", value: selected.trip_revenue, color: "" },
                    { label: "ค่าคนขับ", value: -selected.driver_cost, color: "text-red-600" },
                    { label: "ค่าน้ำมัน", value: -selected.fuel_cost, color: "text-red-600" },
                    { label: "ค่าทางด่วน", value: -selected.toll_fee, color: "text-red-600" },
                    { label: "ต้นทุนคงที่", value: -selected.fixed_cost_allocation, color: "text-[#6B7280]" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">{label}</span>
                      <span className={color}>{Math.abs(value).toLocaleString("th-TH")}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-[#E5E7EB] pt-1.5 mt-1">
                    <span>กำไรสุทธิ</span>
                    <span className={selected.net_profit >= 0 ? "text-green-700" : "text-red-600"}>
                      {selected.trip_status === "completed"
                        ? formatBaht(selected.net_profit)
                        : "—"}
                    </span>
                  </div>
                </div>

                {selected.remark && (
                  <>
                    <hr className="border-[#F3F4F6]" />
                    <div>
                      <p className="text-xs text-[#6B7280] mb-0.5">หมายเหตุ</p>
                      <p className="text-xs text-[#374151]">{selected.remark}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
