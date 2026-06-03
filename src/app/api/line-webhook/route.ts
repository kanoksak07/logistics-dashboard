import { NextRequest, NextResponse } from "next/server";

// Apps Script URL — รับข้อมูลจาก Vercel แล้วเขียนลง Google Sheets
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzbs_2cuVaO3JhisPdtorJxNg4BqYrQG63SrEVptkl7hRG1AGYs2UhcP8WxvssHIy_KIw/exec";

// LINE webhook verification (GET)
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Logistics Bot Webhook Ready" });
}

// LINE webhook events (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events || [];

    for (const event of events) {
      if (event.type !== "message" || event.message?.type !== "text") continue;

      const text: string = event.message.text;
      const senderId: string = event.source?.userId || "unknown";
      const groupId: string = event.source?.groupId || "";
      const messageId: string = event.message.id;
      const messageTime = new Date(event.timestamp).toISOString();

      // Parse ข้อความงาน
      const parsed = parseJobMessage(text);

      // ส่งไป Apps Script เพื่อบันทึกลง Google Sheets
      // ใช้ fetch แบบ no-wait เพื่อไม่ให้ LINE timeout
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveLineMessage",
          messageId,
          groupId,
          senderId,
          text,
          messageTime,
          parsed,
        }),
      }).catch(() => {}); // ignore Apps Script errors
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("LINE webhook error:", err);
    return NextResponse.json({ status: "ok" }); // Always 200 to LINE
  }
}

interface ParsedJob {
  maps_links: string[];
  phone: string;
  warehouse_code: string;
  time: string;
  quantity: string;
  vehicle_type: string;
  job_type: string; // "numbered" | "LH" | "unknown"
  raw_text: string;
  confidence: "success" | "partial" | "failed";
}

function parseJobMessage(text: string): ParsedJob {
  const result: ParsedJob = {
    maps_links: [],
    phone: "",
    warehouse_code: "",
    time: "",
    quantity: "",
    vehicle_type: "",
    job_type: "unknown",
    raw_text: text,
    confidence: "failed",
  };

  // Google Maps links
  const mapsRegex = /https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.com)\/[\w\-_?=&%./#]+/gi;
  result.maps_links = text.match(mapsRegex) || [];

  // เบอร์โทร (10 หลัก)
  const phoneMatch = text.match(/0[6-9]\d{8}/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // รหัสคลัง (6 หลัก เช่น 890129)
  const warehouseMatch = text.match(/\b8\d{5}\b/);
  if (warehouseMatch) result.warehouse_code = warehouseMatch[0];

  // เวลา (HH.MM น. หรือ HH:MM)
  const timeMatch = text.match(/\d{1,2}[.:]\d{2}(?:\s*-\s*\d{1,2}[.:]\d{2})?\s*น\.?/);
  if (timeMatch) result.time = timeMatch[0].trim();

  // จำนวนของ (เช่น 100+ กล่อง, 200+ ชิ้น)
  const qtyMatch = text.match(/\d+\+?\s*(?:กล่อง|ซอง|ชิ้น|ลัง|ถุง)[^,\n]*/i);
  if (qtyMatch) result.quantity = qtyMatch[0].trim();

  // ประเภทรถ
  const vehicleMatch = text.match(/กระบะ\s*\d*\s*คัน|รถ\w+/i);
  if (vehicleMatch) result.vehicle_type = vehicleMatch[0].trim();

  // ประเภทงาน
  if (/^LH/i.test(text.trim())) result.job_type = "LH";
  else if (/^\d+\s*\n/.test(text.trim())) result.job_type = "numbered";

  // confidence
  const found = [result.maps_links.length > 0, !!result.warehouse_code, !!result.time].filter(Boolean).length;
  result.confidence = found >= 2 ? "success" : found >= 1 ? "partial" : "failed";

  return result;
}
