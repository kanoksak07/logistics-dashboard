import { TopBar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const settings = [
  { name: "default_revenue_per_trip",     value: "640",   description: "รายได้ตั้งต้นต่อรอบ (บาท)" },
  { name: "default_driver_cost_per_trip", value: "200",   description: "ค่าคนขับตั้งต้นต่อรอบ (บาท)" },
  { name: "monthly_vehicle_fixed_cost",   value: "17500", description: "ต้นทุนคงที่รายเดือน (บาท)" },
  { name: "monthly_target_profit",        value: "15000", description: "เป้ากำไรรายเดือน (บาท)" },
  { name: "fuel_cost_warning_threshold",  value: "120",   description: "เตือนเมื่อค่าน้ำมัน/รอบ สูงกว่านี้" },
  { name: "minimum_profit_per_trip",      value: "150",   description: "เตือนเมื่อกำไร/รอบ ต่ำกว่านี้" },
  { name: "vehicle_purchase_cost",        value: "800000","description": "ราคาซื้อรถ (บาท)" },
  { name: "target_payback_months",        value: "24",    description: "เป้าหมายคืนทุน (เดือน)" },
];

export default function SettingsPage() {
  return (
    <>
      <TopBar title="ตั้งค่า" subtitle="Business Assumptions & Defaults" />
      <div className="p-6 space-y-5">
        <Card>
          <CardHeader><CardTitle>ค่าตั้งต้นธุรกิจ</CardTitle></CardHeader>
          <p className="text-xs text-[#6B7280] mb-4">ค่าเหล่านี้ใช้ในการคำนวณ KPI ทั้งหมด แก้ไขใน Google Sheets Sheet "settings"</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {["Setting Name", "ค่าปัจจุบัน", "คำอธิบาย"].map((h) => (
                  <th key={h} className="py-2 px-3 text-xs font-semibold text-[#6B7280] text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settings.map((s) => (
                <tr key={s.name} className="border-b border-[#F3F4F6] hover:bg-[#F4F6F5]">
                  <td className="py-2.5 px-3 text-xs font-mono text-[#1B4332]">{s.name}</td>
                  <td className="py-2.5 px-3 font-semibold">{Number(s.value).toLocaleString("th-TH")}</td>
                  <td className="py-2.5 px-3 text-xs text-[#6B7280]">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader><CardTitle>Google Sheets Integration</CardTitle></CardHeader>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280] mb-1">Spreadsheet ID</p>
              <p className="font-mono text-xs text-[#374151]">ตั้งค่าใน environment variable: SPREADSHEET_ID</p>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280] mb-1">Service Account</p>
              <p className="font-mono text-xs text-[#374151]">ตั้งค่าใน environment variable: GOOGLE_SERVICE_ACCOUNT_KEY</p>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280] mb-1">LINE Webhook URL</p>
              <p className="font-mono text-xs text-[#374151]">https://script.google.com/macros/s/[SCRIPT_ID]/exec</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
