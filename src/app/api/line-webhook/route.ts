import { NextRequest, NextResponse } from "next/server";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "";

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
      const sender: string = event.source?.userId || "unknown";
      const groupId: string = event.source?.groupId || "";
      const messageId: string = event.message.id;
      const now = new Date().toISOString();

      // Parse job message
      const parsed = parseJobMessage(text);

      // Write to Google Sheets via Apps Script (POST)
      await writeToSheets({
        messageId,
        groupId,
        sender,
        text,
        now,
        parsed,
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("LINE webhook error:", err);
    return NextResponse.json({ status: "error" }, { status: 200 }); // Always return 200 to LINE
  }
}

interface ParsedJob {
  job_id: string;
  pickup_date: string;
  pickup_time: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  google_map_link: string;
  warehouse_name: string;
  assigned_driver_name: string;
  expected_fee: string;
  remark: string;
  confidence: "success" | "partial" | "failed";
  errors: string[];
}

function parseJobMessage(text: string): ParsedJob {
  const result: ParsedJob = {
    job_id: "", pickup_date: "", pickup_time: "",
    customer_name: "", customer_phone: "", pickup_address: "",
    google_map_link: "", warehouse_name: "", assigned_driver_name: "",
    expected_fee: "640", remark: "",
    confidence: "success", errors: [],
  };

  const fieldMap: Record<string, keyof ParsedJob> = {
    "job id": "job_id", "วันที่รับ": "pickup_date", "เวลารับ": "pickup_time",
    "ชื่อลูกค้า": "customer_name", "เบอร์โทร": "customer_phone",
    "ที่อยู่รับ": "pickup_address", "google map": "google_map_link",
    "โกดัง": "warehouse_name", "คนขับ": "assigned_driver_name",
    "ค่าบริการ": "expected_fee", "หมายเหตุ": "remark",
  };

  text.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const val = line.slice(colonIdx + 1).trim();
    const field = fieldMap[key];
    if (field) (result as unknown as Record<string, string>)[field] = val;
  });

  ["pickup_date", "customer_name", "pickup_address", "warehouse_name"].forEach((f) => {
    if (!(result as unknown as Record<string, string>)[f]) result.errors.push(`ขาด ${f}`);
  });

  if (result.errors.length > 0) {
    result.confidence = result.errors.length <= 2 ? "partial" : "failed";
  }

  return result;
}

async function writeToSheets(data: {
  messageId: string; groupId: string; sender: string;
  text: string; now: string; parsed: ParsedJob;
}) {
  // Write via Google Sheets API (append to line_raw_messages)
  const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/line_raw_messages!A:I:append?valueInputOption=USER_ENTERED&key=${GOOGLE_API_KEY}`;

  // Note: For write operations we need OAuth2, not just API key
  // For now, log to console — full write needs Service Account
  console.log("LINE message received:", {
    messageId: data.messageId,
    confidence: data.parsed.confidence,
    customer: data.parsed.customer_name,
  });
}
