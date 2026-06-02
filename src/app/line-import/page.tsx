import { TopBar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { lineMessages } from "@/lib/mock-data";
import { formatThaiDateShort } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

const total = lineMessages.length;
const importSuccess = lineMessages.filter((m) => m.imported_status === "success").length;
const importFailed = lineMessages.filter((m) => m.imported_status === "failed").length;
const parseSuccess = lineMessages.filter((m) => m.parsed_status === "success").length;
const parsePartial = lineMessages.filter((m) => m.parsed_status === "partial").length;
const parseFailed = lineMessages.filter((m) => m.parsed_status === "failed").length;

const parsedStatusConfig = {
  success: { label: "✅ Parse สำเร็จ", className: "bg-green-50 text-green-700 border-green-200" },
  partial: { label: "⚠️ ข้อมูลไม่ครบ", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  failed:  { label: "❌ Parse ล้มเหลว", className: "bg-red-50 text-red-700 border-red-200" },
};

export default function LineImportPage() {
  return (
    <>
      <TopBar title="LINE Import Monitoring" subtitle="ตรวจสอบการ import ข้อมูลจาก LINE" />
      <div className="p-6 space-y-5">

        {/* Status Summary */}
        <div className="grid grid-cols-5 gap-4">
          <KpiCard label="Import ล่าสุด" value="3 นาทีที่แล้ว" subValue="21 มิ.ย. 2569 07:15" />
          <KpiCard label="ข้อความทั้งหมด" value={`${total} ข้อความ`} />
          <KpiCard label="Import สำเร็จ" value={`${importSuccess} ข้อความ`} valueColor="text-green-700" />
          <KpiCard label="Import ล้มเหลว" value={`${importFailed} ข้อความ`} valueColor={importFailed > 0 ? "text-red-700" : undefined} />
          <KpiCard label="ข้อมูลไม่ครบ" value={`${parsePartial} ข้อความ`} valueColor={parsePartial > 0 ? "text-yellow-700" : undefined} />
        </div>

        {/* Parse Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#111827]">{parseSuccess}</p>
              <p className="text-xs text-[#6B7280]">Parse สำเร็จ</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#111827]">{parsePartial}</p>
              <p className="text-xs text-[#6B7280]">ข้อมูลไม่ครบ (ต้องตรวจสอบ)</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <XCircle size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#111827]">{parseFailed}</p>
              <p className="text-xs text-[#6B7280]">Parse ล้มเหลว</p>
            </div>
          </Card>
        </div>

        {/* Alert for partial/failed */}
        {(parsePartial > 0 || parseFailed > 0) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
            <AlertTriangle size={15} className="text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              มี <strong>{parsePartial}</strong> ข้อความที่ parse ได้บางส่วน และ <strong>{parseFailed}</strong> ข้อความที่ parse ล้มเหลว
              — กรุณาตรวจสอบและเพิ่มข้อมูลด้วยตนเอง
            </div>
          </div>
        )}

        {/* Raw Message Table */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <CardTitle>ข้อความ LINE ทั้งหมด</CardTitle>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {["Message ID", "เวลา", "ผู้ส่ง", "ข้อความ", "Import", "Parse", "เหตุผล"].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#6B7280] text-left border-b border-[#E5E7EB]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineMessages.map((m) => {
                const parsed = parsedStatusConfig[m.parsed_status];
                return (
                  <tr key={m.line_message_id} className="border-b border-[#F3F4F6] hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 text-xs font-mono text-[#9CA3AF]">{m.line_message_id}</td>
                    <td className="py-2.5 px-3 text-xs text-[#374151] whitespace-nowrap">
                      <div>{formatThaiDateShort(m.message_datetime.split("T")[0])}</div>
                      <div className="text-[#9CA3AF]">{m.message_datetime.split("T")[1]?.slice(0, 5)}</div>
                    </td>
                    <td className="py-2.5 px-3 text-sm">{m.sender_name}</td>
                    <td className="py-2.5 px-3 text-xs text-[#374151] max-w-xs">
                      <div className="truncate" title={m.message_text}>
                        {m.message_text.split("\n")[0]}
                        {m.message_text.includes("\n") && <span className="text-[#9CA3AF]"> ...</span>}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {m.imported_status === "success"
                        ? <span className="flex items-center gap-1 text-xs text-green-700"><CheckCircle size={11} /> สำเร็จ</span>
                        : <span className="flex items-center gap-1 text-xs text-red-600"><XCircle size={11} /> ล้มเหลว</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${parsed.className}`}>
                        {parsed.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#6B7280]">{m.error_reason ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Guide */}
        <Card>
          <CardHeader><CardTitle>รูปแบบข้อความที่ถูกต้อง</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#6B7280] mb-2">ตัวอย่างข้อความมาตรฐาน:</p>
              <pre className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded p-3 text-[#374151] leading-relaxed whitespace-pre-wrap">
{`Job ID: JOB-20260603-001
วันที่รับ: 2026-06-03
เวลารับ: 14:00
ชื่อลูกค้า: คุณสมชาย
เบอร์โทร: 0812345678
ที่อยู่รับ: 99/1 สุขุมวิท 10
Google Map: https://maps.google.com/...
โกดัง: โกดังบางนา
คนขับ: พี่เอก
ค่าบริการ: 640
หมายเหตุ: ของ 3 กล่อง`}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-[#6B7280] mb-2">Field ที่จำเป็น:</p>
              {[
                { field: "Job ID", required: false, note: "ถ้าไม่มีจะสร้างอัตโนมัติ" },
                { field: "วันที่รับ", required: true, note: "รูปแบบ YYYY-MM-DD" },
                { field: "ชื่อลูกค้า", required: true, note: "" },
                { field: "เบอร์โทร", required: true, note: "10 หลัก" },
                { field: "ที่อยู่รับ", required: true, note: "" },
                { field: "โกดัง", required: true, note: "" },
                { field: "คนขับ", required: true, note: "ต้องใส่ก่อนเริ่มงาน" },
                { field: "ค่าบริการ", required: false, note: "Default 640 บาท" },
              ].map((f) => (
                <div key={f.field} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${f.required ? "bg-red-500" : "bg-gray-300"}`} />
                  <span className="text-[#374151] font-medium w-24">{f.field}</span>
                  <span className={`${f.required ? "text-red-600" : "text-[#9CA3AF]"}`}>{f.required ? "จำเป็น" : "ไม่จำเป็น"}</span>
                  {f.note && <span className="text-[#9CA3AF]">— {f.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
