/**
 * LOGISTICS DASHBOARD — Google Sheets Setup Script
 * รันครั้งเดียวเพื่อสร้าง Sheet ทั้งหมดพร้อม header
 *
 * วิธีใช้:
 * 1. เปิด Google Sheets ที่ต้องการใช้
 * 2. ไปที่ Extensions > Apps Script
 * 3. วาง code นี้ทั้งหมด แทนที่ code เดิม
 * 4. กด Run > setupAllSheets
 * 5. อนุมัติ Permission
 */

function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ==============================
  // Sheet: trips
  // ==============================
  createOrClearSheet(ss, "trips", [
    "trip_id", "job_id", "line_message_id", "job_date", "pickup_date",
    "pickup_time", "customer_name", "customer_phone", "pickup_address",
    "google_map_link", "warehouse_name", "assigned_driver_id",
    "assigned_driver_name", "vehicle_id", "trip_status",
    "trip_revenue", "driver_cost", "fuel_cost", "toll_fee", "other_cost",
    "fixed_cost_allocation", "total_cost", "net_profit", "profit_margin",
    "remark", "created_at", "updated_at"
  ]);

  // ==============================
  // Sheet: drivers
  // ==============================
  const driversSheet = createOrClearSheet(ss, "drivers", [
    "driver_id", "driver_name", "phone", "default_cost_per_trip",
    "active_status", "start_date", "remark"
  ]);
  // ใส่ตัวอย่างคนขับ
  driversSheet.appendRow(["DRV-001", "พี่เอก", "0891111111", 200, "TRUE", "2026-01-01", ""]);
  driversSheet.appendRow(["DRV-002", "พี่บอย", "0892222222", 200, "TRUE", "2026-01-15", ""]);

  // ==============================
  // Sheet: vehicles
  // ==============================
  const vehiclesSheet = createOrClearSheet(ss, "vehicles", [
    "vehicle_id", "vehicle_name", "license_plate", "vehicle_type",
    "purchase_cost", "purchase_date", "insurance_cost_per_year",
    "maintenance_budget_per_month", "active_status", "remark"
  ]);
  // ใส่ตัวอย่างรถ (แก้ตามจริง)
  vehiclesSheet.appendRow([
    "VEH-001", "รถกระบะปิด 1", "กข-1234", "Pickup Closed Box",
    800000, "2026-01-01", 20000, 3000, "TRUE", ""
  ]);

  // ==============================
  // Sheet: costs
  // ==============================
  createOrClearSheet(ss, "costs", [
    "cost_id", "cost_date", "cost_category", "cost_amount",
    "vehicle_id", "driver_id", "related_trip_id",
    "payment_method", "remark", "created_at"
  ]);

  // ==============================
  // Sheet: line_raw_messages
  // ==============================
  createOrClearSheet(ss, "line_raw_messages", [
    "line_message_id", "line_group_id", "sender_name",
    "message_text", "message_datetime",
    "imported_status", "parsed_status", "error_reason", "created_at"
  ]);

  // ==============================
  // Sheet: line_parsed_jobs
  // ==============================
  createOrClearSheet(ss, "line_parsed_jobs", [
    "parsed_job_id", "line_message_id", "job_id",
    "pickup_date", "customer_name", "customer_phone",
    "pickup_address", "google_map_link", "warehouse_name",
    "assigned_driver_name", "expected_fee", "remark",
    "parse_confidence", "validation_status", "created_at"
  ]);

  // ==============================
  // Sheet: settings
  // ==============================
  const settingsSheet = createOrClearSheet(ss, "settings", [
    "setting_name", "setting_value", "description", "updated_at"
  ]);
  const now = new Date().toISOString();
  const defaults = [
    ["default_revenue_per_trip",     "640",   "รายได้ตั้งต้นต่อรอบ (บาท)",        now],
    ["default_driver_cost_per_trip", "200",   "ค่าคนขับตั้งต้นต่อรอบ (บาท)",      now],
    ["monthly_vehicle_fixed_cost",   "17500", "ต้นทุนคงที่รายเดือน (บาท)",         now],
    ["monthly_target_profit",        "15000", "เป้ากำไรรายเดือน (บาท)",            now],
    ["fuel_cost_warning_threshold",  "120",   "เตือนเมื่อค่าน้ำมัน/รอบ > ค่านี้", now],
    ["minimum_profit_per_trip",      "150",   "เตือนเมื่อกำไร/รอบ < ค่านี้",      now],
    ["vehicle_purchase_cost",        "800000","ราคาซื้อรถ (บาท)",                  now],
    ["target_payback_months",        "24",    "เป้าหมายคืนทุน (เดือน)",            now],
    ["fixed_cost_per_trip",          "135",   "ต้นทุนคงที่ที่ allocate ต่อรอบ",   now],
  ];
  defaults.forEach(row => settingsSheet.appendRow(row));

  // จัด format หัว row ให้เป็น bold
  formatAllSheets(ss);

  SpreadsheetApp.getUi().alert(
    "✅ สร้าง Sheet สำเร็จ!\n\n" +
    "Sheets ที่สร้าง:\n" +
    "• trips\n• drivers (มีตัวอย่าง 2 คน)\n• vehicles (มีตัวอย่าง 1 คัน)\n" +
    "• costs\n• line_raw_messages\n• line_parsed_jobs\n• settings\n\n" +
    "ขั้นตอนต่อไป:\n" +
    "1. แก้ข้อมูลใน drivers และ vehicles ให้ตรงกับจริง\n" +
    "2. Copy Spreadsheet ID จาก URL แล้วใส่ใน .env.local\n" +
    "3. สร้าง Google Service Account แล้วแชร์ Sheet ให้"
  );
}

function createOrClearSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  } else {
    sheet.clearContents();
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}

function formatAllSheets(ss) {
  const sheetNames = ["trips","drivers","vehicles","costs","line_raw_messages","line_parsed_jobs","settings"];
  sheetNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    header.setFontWeight("bold");
    header.setBackground("#1B4332");
    header.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, sheet.getLastColumn());
  });
}

// ==============================
// WEBHOOK: รับข้อมูลจาก LINE Bot
// ==============================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(getSpreadsheetId());
    const rawSheet = ss.getSheetByName("line_raw_messages");
    const now = new Date().toISOString();

    // รับ events จาก LINE Messaging API
    const events = body.events || [];
    events.forEach(event => {
      if (event.type !== "message" || event.message.type !== "text") return;

      const messageId = event.message.id;
      const text = event.message.text;
      const sender = event.source.userId || "unknown";
      const groupId = event.source.groupId || "";
      const msgTime = new Date(event.timestamp).toISOString();

      // เช็ค duplicate
      const existing = rawSheet.getDataRange().getValues();
      const isDuplicate = existing.some(row => row[0] === messageId);
      if (isDuplicate) return;

      // parse message
      const parsed = parseJobMessage(text);
      const parsedStatus = parsed.confidence;
      const errorReason = parsed.errors.join(", ") || "";

      // บันทึก raw message
      rawSheet.appendRow([
        messageId, groupId, sender, text, msgTime,
        "success", parsedStatus, errorReason, now
      ]);

      // ถ้า parse ได้ บันทึก parsed job
      if (parsed.confidence !== "failed") {
        saveParsedJob(ss, messageId, parsed, now);
      }
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parseJobMessage(text) {
  const result = {
    job_id: "", pickup_date: "", customer_name: "", customer_phone: "",
    pickup_address: "", google_map_link: "", warehouse_name: "",
    assigned_driver_name: "", expected_fee: "640", remark: "",
    confidence: "success", errors: []
  };

  const lines = text.split("\n");
  const fieldMap = {
    "job id": "job_id", "วันที่รับ": "pickup_date", "เวลารับ": "pickup_time",
    "ชื่อลูกค้า": "customer_name", "เบอร์โทร": "customer_phone",
    "ที่อยู่รับ": "pickup_address", "google map": "google_map_link",
    "โกดัง": "warehouse_name", "คนขับ": "assigned_driver_name",
    "ค่าบริการ": "expected_fee", "หมายเหตุ": "remark"
  };

  lines.forEach(line => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const val = line.slice(colonIdx + 1).trim();
    const field = fieldMap[key];
    if (field) result[field] = val;
  });

  // Validation
  const required = ["pickup_date", "customer_name", "pickup_address", "warehouse_name"];
  required.forEach(f => {
    if (!result[f]) result.errors.push(`ขาด ${f}`);
  });

  if (!result.expected_fee) result.expected_fee = "640";
  if (result.errors.length > 0) {
    result.confidence = result.errors.length <= 2 ? "partial" : "failed";
  }

  return result;
}

function saveParsedJob(ss, messageId, parsed, now) {
  const sheet = ss.getSheetByName("line_parsed_jobs");
  const id = "PJ-" + Date.now();
  sheet.appendRow([
    id, messageId, parsed.job_id, parsed.pickup_date,
    parsed.customer_name, parsed.customer_phone, parsed.pickup_address,
    parsed.google_map_link, parsed.warehouse_name, parsed.assigned_driver_name,
    parsed.expected_fee, parsed.remark, parsed.confidence, "pending", now
  ]);
}

function getSpreadsheetId() {
  // ใส่ Spreadsheet ID ของคุณที่นี่
  return PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID")
    || SpreadsheetApp.getActiveSpreadsheet().getId();
}
