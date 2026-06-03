"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { trips, Trip, TripStatus } from "@/lib/mock-data";
import { formatThaiDateShort, formatBaht } from "@/lib/utils";
import { Search, X, MapPin, Phone, AlertTriangle, ChevronRight } from "lucide-react";

const STATUS_OPTIONS: { value: TripStatus | "all"; label: string }[] = [
  { value: "all",         label: "ทั้งหมด" },
  { value: "completed",   label: "เสร็จ" },
  { value: "in_progress", label: "กำลังทำ" },
  { value: "pending",     label: "รอ" },
  { value: "cancelled",   label: "ยกเลิก" },
  { value: "incomplete",  label: "ไม่ครบ" },
];

function TripDetailPanel({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#111827]">รายละเอียดงาน</h3>
        <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151] p-1">
          <X size={18} />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <StatusBadge status={trip.trip_status} />
        {!trip.google_map_link && (
          <span className="text-xs text-yellow-600 flex items-center gap-0.5 bg-yellow-50 px-2 py-0.5 rounded-full">
            <AlertTriangle size={10} /> ไม่มี Map
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-[#6B7280] mb-0.5">Job ID</p>
          <p className="text-xs font-mono">{trip.trip_id}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6B7280] mb-0.5">วันที่รับ</p>
          <p className="text-xs">{formatThaiDateShort(trip.pickup_date)} {trip.pickup_time}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] text-[#6B7280] mb-0.5">ลูกค้า</p>
        <p className="font-semibold">{trip.customer_name}</p>
        <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
          <Phone size={10} /> {trip.customer_phone}
        </p>
      </div>

      <div>
        <p className="text-[10px] text-[#6B7280] mb-0.5">ที่อยู่รับ</p>
        <p className="text-xs leading-relaxed">{trip.pickup_address}</p>
        {trip.google_map_link ? (
          <a href={trip.google_map_link} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#1B4332] flex items-center gap-0.5 mt-1 font-medium">
            <MapPin size={10} /> ดูแผนที่
          </a>
        ) : (
          <span className="text-xs text-yellow-600 mt-0.5 block">ไม่มี Google Map</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-[#6B7280] mb-0.5">โกดัง</p>
          <p className="text-xs">{trip.warehouse_name}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6B7280] mb-0.5">คนขับ</p>
          {trip.assigned_driver_name ? (
            <p className="text-xs font-medium">{trip.assigned_driver_name}</p>
          ) : (
            <p className="text-xs text-red-500 flex items-center gap-0.5">
              <AlertTriangle size={10} /> ไม่มีคนขับ
            </p>
          )}
        </div>
      </div>

      <div className="bg-[#F4F6F5] rounded-xl p-3 space-y-2">
        <p className="text-[10px] font-semibold text-[#6B7280] uppercase">การเงิน</p>
        {[
          { label: "รายได้", value: trip.trip_revenue, color: "text-[#1B4332] font-semibold" },
          { label: "ค่าคนขับ", value: -trip.driver_cost, color: "text-red-600" },
          { label: "ค่าน้ำมัน", value: -trip.fuel_cost, color: "text-red-600" },
          { label: "ค่าทางด่วน", value: -trip.toll_fee, color: "text-red-600" },
          { label: "ต้นทุนคงที่", value: -trip.fixed_cost_allocation, color: "text-[#9CA3AF]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-[#6B7280]">{label}</span>
            <span className={color}>{Math.abs(value).toLocaleString("th-TH")} ฿</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold border-t border-[#E5E7EB] pt-2 mt-1">
          <span>กำไรสุทธิ</span>
          <span className={trip.net_profit >= 0 ? "text-[#1B4332]" : "text-red-600"}>
            {trip.trip_status === "completed" ? formatBaht(trip.net_profit) : "—"}
          </span>
        </div>
      </div>

      {trip.remark && (
        <div>
          <p className="text-[10px] text-[#6B7280] mb-0.5">หมายเหตุ</p>
          <p className="text-xs text-[#374151]">{trip.remark}</p>
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [selected, setSelected] = useState<Trip | null>(null);

  const filtered = trips.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
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
      <TopBar title="ติดตามงาน" subtitle={`${trips.length} งาน`} />

      <div className="p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-4">

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">

          {/* Search + Filter */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="ค้นหา Job ID, ลูกค้า, เบอร์, คนขับ"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors flex-shrink-0 ${
                    statusFilter === s.value
                      ? "bg-[#1B4332] text-white border-[#1B4332]"
                      : "bg-white text-[#4B5563] border-[#E5E7EB]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <span className="text-xs text-[#9CA3AF] self-center ml-1 flex-shrink-0">{sorted.length} รายการ</span>
            </div>
          </div>

          {/* Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[320px]">
                <thead className="bg-[#FAFAFA] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">วันที่</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">ลูกค้า</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB] hidden sm:table-cell">คนขับ</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-right border-b border-[#E5E7EB] hidden sm:table-cell">กำไร</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">สถานะ</th>
                    <th className="py-2.5 px-1 border-b border-[#E5E7EB]"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((t) => (
                    <tr
                      key={t.trip_id}
                      onClick={() => setSelected(t)}
                      className={`border-b border-[#F3F4F6] active:bg-[#F0FDF4] cursor-pointer transition-colors ${selected?.trip_id === t.trip_id ? "bg-[#F0FDF4]" : "hover:bg-[#F4F6F5]"}`}
                    >
                      <td className="py-3 px-3 text-xs text-[#374151] whitespace-nowrap">{formatThaiDateShort(t.job_date)}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-sm">{t.customer_name}</div>
                        <div className="text-[10px] text-[#9CA3AF]">{t.customer_phone}</div>
                      </td>
                      <td className="py-3 px-3 text-sm text-[#374151] hidden sm:table-cell">
                        {t.assigned_driver_name ?? <span className="text-red-500 text-xs">ไม่มีคนขับ</span>}
                      </td>
                      <td className={`py-3 px-3 text-sm text-right font-medium hidden sm:table-cell ${t.net_profit >= 0 ? "text-[#1B4332]" : "text-red-600"}`}>
                        {t.trip_status === "completed" ? t.net_profit.toLocaleString("th-TH") : "—"}
                      </td>
                      <td className="py-3 px-3"><StatusBadge status={t.trip_status} /></td>
                      <td className="py-3 px-2 text-[#9CA3AF]"><ChevronRight size={14} /></td>
                    </tr>
                  ))}
                  {sorted.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-[#6B7280]">ไม่พบงานที่ตรงกับเงื่อนไข</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Desktop side panel */}
        {selected && (
          <div className="hidden md:block w-72 shrink-0">
            <Card className="sticky top-20 overflow-y-auto max-h-[calc(100vh-100px)]">
              <TripDetailPanel trip={selected} onClose={() => setSelected(null)} />
            </Card>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {selected && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mt-3 mb-1" />
            <div className="p-4 pb-8">
              <TripDetailPanel trip={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
