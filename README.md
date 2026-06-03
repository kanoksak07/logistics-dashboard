# 🚛 Logistics Dashboard

ระบบ Dashboard สำหรับธุรกิจรถกระบะปิดรับส่งสินค้า — ติดตามรายได้ ต้นทุน กำไร และประสิทธิภาพคนขับแบบ real-time

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![Google Sheets](https://img.shields.io/badge/Database-Google%20Sheets-34A853?logo=googlesheets)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## 📊 หน้า Dashboard

| หน้า | คำอธิบาย |
|------|----------|
| **ภาพรวม** | KPI รายได้/ต้นทุน/กำไร, trend chart, insights |
| **รายได้ & กำไร** | วิเคราะห์กำไรรายวัน/เดือน แยกตามคนขับ |
| **ต้นทุน** | Breakdown ต้นทุนทุกประเภท แจ้งเตือนผิดปกติ |
| **คนขับ** | Ranking, ผลงาน, อัตราสำเร็จ |
| **ติดตามงาน** | ตารางงานทั้งหมด ค้นหา/กรอง/ดูรายละเอียด |
| **รถและต้นทุน** | ความคืบหน้าคืนทุน, Break-even calculator |
| **LINE Import** | ตรวจสอบ LINE message parse status |
| **จัดการข้อมูล** | Data quality checklist, field dictionary |

---

## 🚀 เริ่มต้นใช้งาน

### 1. Clone & Install

```bash
git clone https://github.com/kanoksak07/logistics-dashboard.git
cd logistics-dashboard
npm install
```

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env.local
```

เปิดไฟล์ `.env.local` แล้วใส่ค่า:

```env
SPREADSHEET_ID=your_google_spreadsheet_id
GOOGLE_API_KEY=your_google_api_key
```

### 3. ตั้งค่า Google Sheets

1. สร้าง Google Spreadsheet ใหม่
2. ไปที่ **Extensions → Apps Script**
3. วาง code จาก `google-apps-script/setup_sheets.js`
4. รัน `setupAllSheets()` — จะสร้าง Sheet ทั้งหมดอัตโนมัติ
5. เปิด Sheet เป็น **Anyone with link → Viewer**

### 4. รัน Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

---

## 🗄️ โครงสร้าง Google Sheets

| Sheet | ข้อมูล |
|-------|--------|
| `trips` | ทุกรอบการเดินรถ |
| `drivers` | ข้อมูลคนขับ |
| `vehicles` | ข้อมูลรถ |
| `costs` | ค่าใช้จ่ายเพิ่มเติม |
| `line_raw_messages` | ข้อความ LINE ดิบ |
| `line_parsed_jobs` | งานที่ parse จาก LINE |
| `settings` | ค่าตั้งต้นธุรกิจ |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts v3 + Custom SVG |
| Icons | Lucide React |
| Database | Google Sheets API v4 |
| Hosting | Vercel |

---

## 📐 สูตรคำนวณหลัก

```
ต้นทุนต่อรอบ  = ค่าคนขับ + ค่าน้ำมัน + ค่าทางด่วน + ต้นทุนคงที่ (135 บาท)
กำไรต่อรอบ   = รายได้ต่อรอบ - ต้นทุนต่อรอบ
Break-even   = ต้นทุนคงที่รายเดือน ÷ Contribution margin ต่อรอบ
คืนทุนรถ     = ราคารถ ÷ กำไรสุทธิเฉลี่ยต่อเดือน
```

---

## 🔄 Deploy

Push to `main` → Vercel deploy อัตโนมัติ

```bash
git add -A
git commit -m "update: your message"
git push
```

---

## 📁 โครงสร้างโปรเจค

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # ภาพรวม (Overview)
│   ├── revenue/            # รายได้ & กำไร
│   ├── costs/              # ต้นทุน
│   ├── drivers/            # คนขับ
│   ├── trips/              # ติดตามงาน
│   ├── vehicle/            # รถและต้นทุน
│   ├── line-import/        # LINE Import
│   ├── data-management/    # จัดการข้อมูล
│   └── api/sheets/         # Google Sheets API route
├── components/
│   ├── charts/             # TrendChart, TripBar, CostDonut
│   ├── layout/             # Sidebar, TopBar
│   └── ui/                 # KpiCard, Card, Badge
├── lib/
│   ├── mock-data.ts        # Mock data + fallback
│   ├── google-sheets.ts    # Google Sheets API client
│   └── use-dashboard-data.ts # Data hook (real + fallback)
└── google-apps-script/
    └── setup_sheets.js     # Sheet setup + LINE webhook
```

---

## 📝 License

Private — สำหรับใช้งานภายในธุรกิจเท่านั้น
