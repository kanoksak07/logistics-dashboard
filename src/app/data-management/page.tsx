import { TopBar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { trips, drivers, vehicles, costRecords, lineMessages } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle, Database } from "lucide-react";

const sheets = [
  { name: "trips",             records: trips.length,        description: "ข้อมูลการเดินรถทุกรอบ" },
  { name: "drivers",           records: drivers.length,      description: "ข้อมูลคนขับ" },
  { name: "vehicles",          records: vehicles.length,     description: "ข้อมูลรถ" },
  { name: "costs",             records: costRecords.length,  description: "ต้นทุนเพิ่มเติม" },
  { name: "line_raw_messages", records: lineMessages.length, description: "ข้อความ LINE ดิบ" },
  { name: "line_parsed_jobs",  records: lineMessages.filter(m => m.parsed_status !== "failed").length, description: "งานที่ parse จาก LINE" },
  { name: "settings",          records: 8,                   description: "ค่าตั้งต้นและเป้าหมาย" },
];

const issues = [
  { type: "error",   count: trips.filter(t => !t.assigned_driver_id && !["cancelled","incomplete"].includes(t.trip_status)).length, label: "งานที่ไม่มีคนขับ",         action: "ไปที่ Trip Tracking" },
  { type: "error",   count: trips.filter(t => t.trip_status === "incomplete").length, label: "งานที่ข้อมูลไม่ครบ",       action: "ไปที่ Trip Tracking" },
  { type: "warning", count: trips.filter(t => !t.google_map_link).length, label: "งานที่ไม่มี Google Map",   action: "เพิ่ม Google Map Link" },
  { type: "warning", count: lineMessages.filter(m => m.parsed_status === "partial").length, label: "LINE message ข้อมูลไม่ครบ", action: "ไปที่ LINE Import" },
  { type: "error",   count: lineMessages.filter(m => m.imported_status === "failed").length, label: "LINE import ล้มเหลว",       action: "ตรวจสอบ Webhook" },
  { type: "success", count: 0, label: "Job ID ซ้ำ", action: "—" },
];

const fieldDictionary = [
  { sheet: "trips", field: "trip_id",         type: "String",   required: true,  example: "TRP-001" },
  { sheet: "trips", field: "job_id",          type: "String",   required: true,  example: "JOB-20260603-001" },
  { sheet: "trips", field: "trip_status",     type: "Enum",     required: true,  example: "completed" },
  { sheet: "trips", field: "trip_revenue",    type: "Number",   required: true,  example: "640" },
  { sheet: "trips", field: "driver_cost",     type: "Number",   required: true,  example: "200" },
  { sheet: "trips", field: "net_profit",      type: "Number",   required: false, example: "180 (Auto)" },
  { sheet: "drivers", field: "driver_id",     type: "String",   required: true,  example: "DRV-001" },
  { sheet: "drivers", field: "driver_name",   type: "String",   required: true,  example: "พี่เอก" },
  { sheet: "vehicles", field: "purchase_cost",type: "Number",   required: true,  example: "800000" },
  { sheet: "settings", field: "setting_name", type: "String",   required: true,  example: "default_revenue_per_trip" },
];

export default function DataManagementPage() {
  return (
    <>
      <TopBar title="จัดการข้อมูล" subtitle="Google Sheets Database" />
      <div className="p-6 space-y-5">

        {/* Sheet Summary */}
        <div className="grid grid-cols-4 gap-3">
          {sheets.map((s) => (
            <Card key={s.name} className="flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded bg-[#EFF6FF] flex items-center justify-center shrink-0">
                <Database size={14} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{s.name}</p>
                <p className="text-xs text-[#6B7280]">{s.records} records — {s.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Data Quality */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Data Quality Checklist</CardTitle>
              <span className="text-xs text-[#6B7280]">
                {issues.filter(i => i.type !== "success" && i.count > 0).length} ปัญหาที่ต้องแก้ไข
              </span>
            </div>
          </CardHeader>
          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue.label}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  issue.type === "error" && issue.count > 0 ? "bg-red-50 border-red-100" :
                  issue.type === "warning" && issue.count > 0 ? "bg-yellow-50 border-yellow-100" :
                  "bg-green-50 border-green-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {issue.count === 0
                    ? <CheckCircle size={14} className="text-green-600" />
                    : <AlertTriangle size={14} className={issue.type === "error" ? "text-red-600" : "text-yellow-600"} />}
                  <span className="text-sm text-[#374151]">{issue.label}</span>
                  {issue.count > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${issue.type === "error" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {issue.count}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#6B7280]">{issue.action}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Field Dictionary */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <CardTitle>Field Dictionary (ตัวอย่าง)</CardTitle>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {["Sheet", "Field", "ประเภท", "จำเป็น", "ตัวอย่าง"].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fieldDictionary.map((f, i) => (
                <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F8FAFC]">
                  <td className="py-2 px-3 text-xs font-mono text-[#2563EB]">{f.sheet}</td>
                  <td className="py-2 px-3 text-xs font-mono text-[#374151]">{f.field}</td>
                  <td className="py-2 px-3">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{f.type}</span>
                  </td>
                  <td className="py-2 px-3">
                    {f.required
                      ? <span className="text-xs text-red-600 font-medium">จำเป็น</span>
                      : <span className="text-xs text-[#9CA3AF]">ไม่จำเป็น</span>}
                  </td>
                  <td className="py-2 px-3 text-xs text-[#6B7280] font-mono">{f.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Manual Guide */}
        <Card>
          <CardHeader><CardTitle>คู่มือแก้ไขข้อมูลด้วยตนเอง</CardTitle></CardHeader>
          <div className="space-y-3 text-sm text-[#374151]">
            {[
              { step: "1", title: "งานที่ข้อมูลไม่ครบ", detail: "ไปที่ Sheet 'trips' → หา trip_status = 'incomplete' → เพิ่มข้อมูลที่ขาด → เปลี่ยน status เป็น 'pending' หรือ 'assigned'" },
              { step: "2", title: "งานที่ไม่มีคนขับ", detail: "ไปที่ Sheet 'trips' → กรอง assigned_driver_id ที่ว่าง → เพิ่ม driver_id จาก Sheet 'drivers'" },
              { step: "3", title: "LINE import ล้มเหลว", detail: "ไปที่ Sheet 'line_raw_messages' → หา imported_status = 'failed' → copy ข้อมูลมากรอกใน Sheet 'trips' ด้วยตนเอง" },
              { step: "4", title: "เพิ่มต้นทุนเพิ่มเติม", detail: "ไปที่ Sheet 'costs' → เพิ่มแถวใหม่ → กรอก cost_date, cost_category, cost_amount" },
            ].map((g) => (
              <div key={g.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0">
                  {g.step}
                </div>
                <div>
                  <p className="font-medium text-[#111827]">{g.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{g.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
