export type TripStatus =
  | "completed"
  | "cancelled"
  | "in_progress"
  | "assigned"
  | "pending"
  | "imported"
  | "incomplete";

export interface Trip {
  trip_id: string;
  job_id: string;
  job_date: string;
  pickup_date: string;
  pickup_time: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  google_map_link?: string;
  warehouse_name: string;
  assigned_driver_id: string | null;
  assigned_driver_name: string | null;
  vehicle_id: string;
  trip_status: TripStatus;
  trip_revenue: number;
  driver_cost: number;
  fuel_cost: number;
  toll_fee: number;
  other_cost: number;
  fixed_cost_allocation: number;
  total_cost: number;
  net_profit: number;
  profit_margin: number;
  remark: string;
  created_at: string;
}

export interface Driver {
  driver_id: string;
  driver_name: string;
  phone: string;
  default_cost_per_trip: number;
  active_status: boolean;
  start_date: string;
}

export interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  license_plate: string;
  purchase_cost: number;
  purchase_date: string;
  insurance_cost_per_year: number;
  maintenance_budget_per_month: number;
  active_status: boolean;
}

export interface CostRecord {
  cost_id: string;
  cost_date: string;
  cost_category: string;
  cost_amount: number;
  vehicle_id?: string;
  driver_id?: string;
  related_trip_id?: string;
  remark: string;
}

export interface LineMessage {
  line_message_id: string;
  sender_name: string;
  message_text: string;
  message_datetime: string;
  imported_status: "success" | "failed";
  parsed_status: "success" | "partial" | "failed";
  error_reason?: string;
}

const FIXED_COST_PER_TRIP = 135;

export const drivers: Driver[] = [
  { driver_id: "DRV-001", driver_name: "พี่เอก", phone: "0891111111", default_cost_per_trip: 200, active_status: true, start_date: "2026-01-01" },
  { driver_id: "DRV-002", driver_name: "พี่บอย", phone: "0892222222", default_cost_per_trip: 200, active_status: true, start_date: "2026-01-15" },
  { driver_id: "DRV-003", driver_name: "พี่นุ", phone: "0893333333", default_cost_per_trip: 200, active_status: true, start_date: "2026-02-01" },
  { driver_id: "DRV-004", driver_name: "พี่ดำ", phone: "0894444444", default_cost_per_trip: 200, active_status: true, start_date: "2026-02-15" },
  { driver_id: "DRV-005", driver_name: "พี่ก้อง", phone: "0895555555", default_cost_per_trip: 200, active_status: false, start_date: "2026-03-01" },
];

export const vehicles: Vehicle[] = [
  {
    vehicle_id: "VEH-001",
    vehicle_name: "รถกระบะปิด 1",
    license_plate: "กข-1234",
    purchase_cost: 800000,
    purchase_date: "2026-01-01",
    insurance_cost_per_year: 20000,
    maintenance_budget_per_month: 3000,
    active_status: true,
  },
];

function makeTrip(
  id: number,
  dateStr: string,
  driverId: string | null,
  driverName: string | null,
  status: TripStatus,
  revenue: number,
  fuel: number,
  toll: number,
  phone: string,
  customer: string,
  address: string,
  remark = ""
): Trip {
  const driverCost = driverId ? 200 : 0;
  const totalCost = driverCost + fuel + toll + FIXED_COST_PER_TRIP;
  const netProfit = revenue - totalCost;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  return {
    trip_id: `TRP-${String(id).padStart(3, "0")}`,
    job_id: `JOB-2026${dateStr.replace(/-/g, "").slice(4)}-${String(id).padStart(3, "0")}`,
    job_date: dateStr,
    pickup_date: dateStr,
    pickup_time: `${9 + (id % 8)}:00`,
    customer_name: customer,
    customer_phone: phone,
    pickup_address: address,
    google_map_link: id % 5 === 0 ? undefined : "https://maps.google.com/placeholder",
    warehouse_name: id % 3 === 0 ? "โกดังลาดกระบัง" : "โกดังบางนา",
    assigned_driver_id: driverId,
    assigned_driver_name: driverName,
    vehicle_id: "VEH-001",
    trip_status: status,
    trip_revenue: revenue,
    driver_cost: driverCost,
    fuel_cost: fuel,
    toll_fee: toll,
    other_cost: 0,
    fixed_cost_allocation: FIXED_COST_PER_TRIP,
    total_cost: totalCost,
    net_profit: netProfit,
    profit_margin: parseFloat(profitMargin.toFixed(1)),
    remark,
    created_at: `${dateStr}T08:00:00`,
  };
}

export const trips: Trip[] = [
  makeTrip(1,  "2026-06-01", "DRV-001", "พี่เอก", "completed",  640, 85,  40, "0811111111", "คุณสมชาย",  "99/1 สุขุมวิท 10 กรุงเทพฯ",    "ของ 3 กล่อง"),
  makeTrip(2,  "2026-06-01", "DRV-002", "พี่บอย", "completed",  640, 90,  40, "0822222222", "คุณสมหญิง", "5/2 ลาดพร้าว 71 กรุงเทพฯ"),
  makeTrip(3,  "2026-06-02", "DRV-003", "พี่นุ",  "completed",  640, 0,   0,  "0833333333", "คุณวิชัย",  "200 รามคำแหง 24 กรุงเทพฯ"),
  makeTrip(4,  "2026-06-02", "DRV-001", "พี่เอก", "completed",  640, 110, 80, "0844444444", "คุณประภา",  "10/5 พระราม 3 กรุงเทพฯ"),
  makeTrip(5,  "2026-06-03", "DRV-002", "พี่บอย", "completed",  640, 85,  0,  "0855555555", "คุณอนันต์", "77 ทองหล่อ 12 กรุงเทพฯ"),
  makeTrip(6,  "2026-06-03", "DRV-003", "พี่นุ",  "cancelled",  640, 0,   0,  "0866666666", "คุณมานี",   "33 บางนา-ตราด กม.5",          "ลูกค้ายกเลิก"),
  makeTrip(7,  "2026-06-04", null,       null,     "incomplete", 640, 0,   0,  "0877777777", "คุณปิยะ",   "45 เพชรบุรี 15 กรุงเทพฯ",     "ยังไม่มีคนขับ"),
  makeTrip(8,  "2026-06-04", "DRV-001", "พี่เอก", "completed",  800, 120, 80, "0888888888", "คุณกาญจนา", "8/1 สีลม 5 กรุงเทพฯ",         "ของพิเศษ"),
  makeTrip(9,  "2026-06-05", "DRV-004", "พี่ดำ",  "completed",  640, 85,  40, "0899999999", "คุณธนา",    "56 เอกมัย 8 กรุงเทพฯ"),
  makeTrip(10, "2026-06-05", "DRV-002", "พี่บอย", "completed",  640, 0,   40, "0810101010", "คุณวิภา",   "22 อ่อนนุช 60 กรุงเทพฯ"),
  makeTrip(11, "2026-06-06", "DRV-003", "พี่นุ",  "completed",  640, 95,  40, "0810202020", "คุณชาญ",    "12 ประชาอุทิศ 90 กรุงเทพฯ"),
  makeTrip(12, "2026-06-07", "DRV-001", "พี่เอก", "completed",  640, 85,  0,  "0810303030", "คุณสุนีย์",  "67 บรมราชชนนี 30 กรุงเทพฯ"),
  makeTrip(13, "2026-06-07", "DRV-004", "พี่ดำ",  "completed",  640, 100, 40, "0810404040", "คุณเจริญ",  "90 งามวงศ์วาน 20 นนทบุรี"),
  makeTrip(14, "2026-06-08", "DRV-002", "พี่บอย", "completed",  640, 85,  40, "0810505050", "คุณลัดดา",  "34 แจ้งวัฒนะ 14 นนทบุรี"),
  makeTrip(15, "2026-06-08", "DRV-001", "พี่เอก", "cancelled",  640, 0,   0,  "0810606060", "คุณสุรชัย", "11 รัตนาธิเบศร์ 10 นนทบุรี", "รถเสีย"),
  makeTrip(16, "2026-06-09", "DRV-003", "พี่นุ",  "completed",  640, 90,  40, "0810707070", "คุณนภา",    "55 ติวานนท์ 5 นนทบุรี"),
  makeTrip(17, "2026-06-10", "DRV-004", "พี่ดำ",  "completed",  640, 85,  0,  "0810808080", "คุณสมศักดิ์","78 รัชดา 18 กรุงเทพฯ"),
  makeTrip(18, "2026-06-10", "DRV-001", "พี่เอก", "completed",  640, 85,  40, "0810909090", "คุณพิมพ์",   "23 ห้วยขวาง 10 กรุงเทพฯ"),
  makeTrip(19, "2026-06-11", "DRV-002", "พี่บอย", "completed",  640, 150, 80, "0811010101", "คุณอรุณ",   "19 ดอนเมือง 10 กรุงเทพฯ",    "ค่าน้ำมันสูง"),
  makeTrip(20, "2026-06-12", "DRV-003", "พี่นุ",  "completed",  640, 85,  40, "0811111100", "คุณจิรา",    "44 มีนบุรี 5 กรุงเทพฯ"),
  makeTrip(21, "2026-06-13", "DRV-001", "พี่เอก", "completed",  640, 95,  40, "0811212120", "คุณบุญมี",  "66 หนองจอก 3 กรุงเทพฯ"),
  makeTrip(22, "2026-06-14", "DRV-004", "พี่ดำ",  "completed",  640, 85,  0,  "0811313130", "คุณสายใจ",  "88 ลาดกระบัง 20 กรุงเทพฯ"),
  makeTrip(23, "2026-06-15", "DRV-002", "พี่บอย", "completed",  640, 85,  40, "0811414140", "คุณเอกชัย", "30 สวนหลวง 10 กรุงเทพฯ"),
  makeTrip(24, "2026-06-16", "DRV-003", "พี่นุ",  "cancelled",  640, 0,   0,  "0811515150", "คุณดวงใจ",  "15 คลองสาน 5 กรุงเทพฯ",      "ลูกค้าเลื่อน"),
  makeTrip(25, "2026-06-17", "DRV-001", "พี่เอก", "completed",  640, 85,  40, "0811616160", "คุณมงคล",   "42 ธนบุรี 20 กรุงเทพฯ"),
  makeTrip(26, "2026-06-18", "DRV-004", "พี่ดำ",  "completed",  640, 85,  40, "0811717170", "คุณรัตนา",  "71 บางแค 10 กรุงเทพฯ"),
  makeTrip(27, "2026-06-19", "DRV-002", "พี่บอย", "in_progress",640, 85,  40, "0811818180", "คุณสุภาพ",  "58 ตลิ่งชัน 8 กรุงเทพฯ"),
  makeTrip(28, "2026-06-20", null,       null,     "pending",    640, 0,   0,  "0811919190", "คุณพัชรี",  "26 บางรัก 5 กรุงเทพฯ",       "รอยืนยันคนขับ"),
  makeTrip(29, "2026-06-20", "DRV-001", "พี่เอก", "assigned",   640, 0,   0,  "0812020200", "คุณสมบูรณ์","14 ปทุมวัน 3 กรุงเทพฯ"),
  makeTrip(30, "2026-06-21", "DRV-003", "พี่นุ",  "completed",  640, 90,  40, "0812121210", "คุณจันทร์",  "35 วังทองหลาง 6 กรุงเทพฯ"),
];

export const costRecords: CostRecord[] = [
  { cost_id: "CST-001", cost_date: "2026-06-01", cost_category: "Maintenance", cost_amount: 8000, vehicle_id: "VEH-001", remark: "เปลี่ยนยาง" },
  { cost_id: "CST-002", cost_date: "2026-06-05", cost_category: "Fuel",        cost_amount: 3200, vehicle_id: "VEH-001", remark: "เติมน้ำมันสัปดาห์แรก" },
  { cost_id: "CST-003", cost_date: "2026-06-07", cost_category: "Insurance",   cost_amount: 1667, vehicle_id: "VEH-001", remark: "ค่าประกันรายเดือน" },
  { cost_id: "CST-004", cost_date: "2026-06-10", cost_category: "Parking",     cost_amount: 2000, vehicle_id: "VEH-001", remark: "ค่าจอดรถเดือนมิถุนายน" },
  { cost_id: "CST-005", cost_date: "2026-06-12", cost_category: "Fuel",        cost_amount: 2800, vehicle_id: "VEH-001", remark: "เติมน้ำมันสัปดาห์สอง" },
  { cost_id: "CST-006", cost_date: "2026-06-15", cost_category: "Maintenance", cost_amount: 1200, vehicle_id: "VEH-001", remark: "เปลี่ยนน้ำมันเครื่อง" },
  { cost_id: "CST-007", cost_date: "2026-06-15", cost_category: "Phone/Internet", cost_amount: 500, remark: "ค่าโทรศัพท์" },
  { cost_id: "CST-008", cost_date: "2026-06-18", cost_category: "Fuel",        cost_amount: 3100, vehicle_id: "VEH-001", remark: "เติมน้ำมันสัปดาห์สาม" },
  { cost_id: "CST-009", cost_date: "2026-06-20", cost_category: "Other",       cost_amount: 500,  remark: "ค่าอุปกรณ์ผูกสินค้า" },
  { cost_id: "CST-010", cost_date: "2026-06-01", cost_category: "Vehicle Purchase", cost_amount: 13333, vehicle_id: "VEH-001", remark: "ค่าเสื่อมราคารถ (allocation)" },
];

export const lineMessages: LineMessage[] = [
  {
    line_message_id: "LM-001",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260601-001\nวันที่รับ: 2026-06-01\nเวลารับ: 09:00\nชื่อลูกค้า: คุณสมชาย\nเบอร์โทร: 0811111111\nที่อยู่รับ: 99/1 สุขุมวิท 10\nโกดัง: โกดังบางนา\nคนขับ: พี่เอก\nค่าบริการ: 640\nหมายเหตุ: ของ 3 กล่อง",
    message_datetime: "2026-06-01T07:30:00",
    imported_status: "success",
    parsed_status: "success",
  },
  {
    line_message_id: "LM-002",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260601-002\nวันที่รับ: 2026-06-01\nเวลารับ: 10:00\nชื่อลูกค้า: คุณสมหญิง\nเบอร์โทร: 0822222222\nที่อยู่รับ: 5/2 ลาดพร้าว 71\nโกดัง: โกดังบางนา\nคนขับ: พี่บอย\nค่าบริการ: 640",
    message_datetime: "2026-06-01T08:15:00",
    imported_status: "success",
    parsed_status: "success",
  },
  {
    line_message_id: "LM-003",
    sender_name: "Admin สาว",
    message_text: "วันที่รับ: 2026-06-04\nชื่อลูกค้า: คุณปิยะ\nที่อยู่รับ: 45 เพชรบุรี 15\nโกดัง: โกดังบางนา\nค่าบริการ: 640",
    message_datetime: "2026-06-04T07:00:00",
    imported_status: "success",
    parsed_status: "partial",
    error_reason: "ขาด Job ID, เบอร์โทร, คนขับ",
  },
  {
    line_message_id: "LM-004",
    sender_name: "คุณสมชาย",
    message_text: "ขอนัดรับพรุ่งนี้นะครับ ช่วงบ่ายได้ไหมครับ",
    message_datetime: "2026-06-05T11:00:00",
    imported_status: "success",
    parsed_status: "failed",
    error_reason: "ไม่ใช่รูปแบบข้อมูลงาน",
  },
  {
    line_message_id: "LM-005",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260608-014\nวันที่รับ: 2026-06-08\nเวลารับ: 13:00\nชื่อลูกค้า: คุณลัดดา\nเบอร์โทร: 0810505050\nที่อยู่รับ: 34 แจ้งวัฒนะ 14\nโกดัง: โกดังลาดกระบัง\nคนขับ: พี่บอย\nค่าบริการ: 640",
    message_datetime: "2026-06-08T09:00:00",
    imported_status: "success",
    parsed_status: "success",
  },
  {
    line_message_id: "LM-006",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260620-028\nวันที่รับ: 2026-06-20\nชื่อลูกค้า: คุณพัชรี\nเบอร์โทร: 0811919190\nที่อยู่รับ: 26 บางรัก 5\nโกดัง: โกดังบางนา\nค่าบริการ: 640",
    message_datetime: "2026-06-20T06:45:00",
    imported_status: "success",
    parsed_status: "partial",
    error_reason: "ขาดคนขับ, เวลารับ",
  },
  {
    line_message_id: "LM-007",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260620-029\nวันที่รับ: 2026-06-20\nเวลารับ: 11:00\nชื่อลูกค้า: คุณสมบูรณ์\nเบอร์โทร: 0812020200\nที่อยู่รับ: 14 ปทุมวัน 3\nโกดัง: โกดังบางนา\nคนขับ: พี่เอก\nค่าบริการ: 640",
    message_datetime: "2026-06-20T07:30:00",
    imported_status: "success",
    parsed_status: "success",
  },
  {
    line_message_id: "LM-008",
    sender_name: "ระบบ",
    message_text: "[System Error] Failed to process webhook",
    message_datetime: "2026-06-18T14:00:00",
    imported_status: "failed",
    parsed_status: "failed",
    error_reason: "Webhook timeout",
  },
  {
    line_message_id: "LM-009",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260621-030\nวันที่รับ: 2026-06-21\nเวลารับ: 09:30\nชื่อลูกค้า: คุณจันทร์\nเบอร์โทร: 0812121210\nที่อยู่รับ: 35 วังทองหลาง 6\nโกดัง: โกดังบางนา\nคนขับ: พี่นุ\nค่าบริการ: 640",
    message_datetime: "2026-06-21T07:00:00",
    imported_status: "success",
    parsed_status: "success",
  },
  {
    line_message_id: "LM-010",
    sender_name: "Admin สาว",
    message_text: "Job ID: JOB-20260619-027\nวันที่รับ: 2026-06-19\nเวลารับ: 10:00\nชื่อลูกค้า: คุณสุภาพ\nเบอร์โทร: 081818180\nที่อยู่รับ: 58 ตลิ่งชัน 8\nโกดัง: โกดังบางนา\nคนขับ: พี่บอย\nค่าบริการ: 640",
    message_datetime: "2026-06-19T07:15:00",
    imported_status: "success",
    parsed_status: "partial",
    error_reason: "เบอร์โทรไม่ถูกต้อง (9 หลัก)",
  },
];

// Aggregation helpers
export function getCompletedTrips(data: Trip[] = trips) {
  return data.filter((t) => t.trip_status === "completed");
}

export function getTotalRevenue(data: Trip[] = trips) {
  return getCompletedTrips(data).reduce((s, t) => s + t.trip_revenue, 0);
}

export function getTotalDriverCost(data: Trip[] = trips) {
  return getCompletedTrips(data).reduce((s, t) => s + t.driver_cost, 0);
}

export function getTotalFuelCost(data: Trip[] = trips) {
  return getCompletedTrips(data).reduce((s, t) => s + t.fuel_cost, 0);
}

export function getTotalTollCost(data: Trip[] = trips) {
  return getCompletedTrips(data).reduce((s, t) => s + t.toll_fee, 0);
}

export function getMonthlyFixedCost() {
  // 800,000 / 60 months depreciation + insurance + parking + phone
  return 13333 + 1667 + 2000 + 500; // = 17,500
}

export function getTotalCost(data: Trip[] = trips) {
  // Uses per-trip total_cost (includes 135 fixed allocation per trip)
  return getCompletedTrips(data).reduce((s, t) => s + t.total_cost, 0);
}

export function getTotalVariableCost(data: Trip[] = trips) {
  return getCompletedTrips(data).reduce(
    (s, t) => s + t.driver_cost + t.fuel_cost + t.toll_fee + t.other_cost,
    0
  );
}

export function getNetProfit(data: Trip[] = trips) {
  return getTotalRevenue(data) - getTotalCost(data);
}

export function getProfitMargin(data: Trip[] = trips) {
  const rev = getTotalRevenue(data);
  if (rev === 0) return 0;
  return (getNetProfit(data) / rev) * 100;
}

export function getDriverStats(data: Trip[] = trips) {
  return drivers
    .filter((d) => d.active_status)
    .map((d) => {
      const driverTrips = data.filter((t) => t.assigned_driver_id === d.driver_id);
      const completed = driverTrips.filter((t) => t.trip_status === "completed");
      const cancelled = driverTrips.filter((t) => t.trip_status === "cancelled");
      const revenue = completed.reduce((s, t) => s + t.trip_revenue, 0);
      const cost = completed.reduce((s, t) => s + t.driver_cost, 0);
      const profit = completed.reduce((s, t) => s + t.net_profit, 0);
      return {
        driver_id: d.driver_id,
        driver_name: d.driver_name,
        assigned: driverTrips.length,
        completed: completed.length,
        cancelled: cancelled.length,
        revenue,
        cost,
        profit,
        avg_profit: completed.length > 0 ? profit / completed.length : 0,
      };
    });
}

// Monthly trend (last 6 months simulated)
export const monthlyTrend = [
  { month: "ม.ค.", revenue: 32000, cost: 24100, profit: 7900,  trips: 50 },
  { month: "ก.พ.", revenue: 35840, cost: 26500, profit: 9340,  trips: 56 },
  { month: "มี.ค.", revenue: 38400, cost: 27800, profit: 10600, trips: 60 },
  { month: "เม.ย.", revenue: 34560, cost: 25900, profit: 8660,  trips: 54 },
  { month: "พ.ค.", revenue: 40960, cost: 29700, profit: 11260, trips: 64 },
  { month: "มิ.ย.", revenue: 0,     cost: 0,     profit: 0,     trips: 0 }, // calculated live
];
