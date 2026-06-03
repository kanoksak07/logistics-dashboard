# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Logistics Dashboard — ระบบติดตามธุรกิจรถรับส่งสินค้า

Dashboard สำหรับธุรกิจรถกระบะปิด ติดตามรายได้ ต้นทุน กำไร และประสิทธิภาพคนขับ
Production deploy on Vercel. Google Sheets เป็น database หลัก

```bash
npm run dev          # dev server at http://localhost:3000
npx tsc --noEmit     # type check
npm run build        # production build
npm run lint         # ESLint
```

## Environment Variables

ใส่ใน `.env.local` (ไม่ commit ขึ้น Git):

| Variable | Purpose |
|----------|---------|
| `SPREADSHEET_ID` | Google Sheets ID — ดูจาก URL ของ Spreadsheet |
| `GOOGLE_API_KEY` | Google API Key — ต้อง enable Google Sheets API และ Sheet ต้อง "Anyone with link can view" |

## Architecture

| Layer | Platform | Code |
|-------|----------|------|
| Frontend | Vercel (auto-deploy on `main` push) | `src/app/`, `src/components/`, `src/lib/` |
| Database | Google Sheets (gs.kanoksak@gmail.com) | Spreadsheet ID: `10MQ_-kHBy2vS4WtfF-H0Aw7Pyor4gHBISg6Xu0LbHBk` |
| LINE Automation | Google Apps Script webhook | `google-apps-script/setup_sheets.js` |

**Data flow:**
Google Sheets → `/api/sheets` (Next.js API route) → `useDashboardData` hook → Dashboard pages

**Fallback:** ถ้า Google Sheets API ไม่ตอบสนอง → ใช้ mock data จาก `src/lib/mock-data.ts` อัตโนมัติ

## Tech Stack

| Category | Library/Tool |
|----------|-------------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts v3 + custom SVG (donut) |
| Icons | Lucide React |
| Database | Google Sheets API v4 (REST, API Key) |
| Deploy | Vercel |

## Google Sheets Database

Spreadsheet: **Logistics Dashboard DB** (gs.kanoksak@gmail.com)

| Sheet | ข้อมูล |
|-------|--------|
| `trips` | ทุกรอบการเดินรถ (รายได้, ต้นทุน, คนขับ, สถานะ) |
| `drivers` | ข้อมูลคนขับ |
| `vehicles` | ข้อมูลรถและต้นทุนคงที่ |
| `costs` | ค่าใช้จ่ายเพิ่มเติม (ซ่อมรถ, ประกัน ฯลฯ) |
| `line_raw_messages` | ข้อความ LINE ดิบ |
| `line_parsed_jobs` | งานที่ parse จาก LINE แล้ว |
| `settings` | ค่าตั้งต้น (รายได้/รอบ, ค่าคนขับ, เป้าหมาย ฯลฯ) |

## API Routes

| Endpoint | Returns |
|----------|---------|
| `/api/sheets?sheet=all` | ข้อมูลทุก sheet พร้อมกัน |
| `/api/sheets?sheet=trips` | รายการงาน |
| `/api/sheets?sheet=drivers` | คนขับ |
| `/api/sheets?sheet=vehicles` | รถ |
| `/api/sheets?sheet=costs` | ต้นทุนเพิ่มเติม |
| `/api/sheets?sheet=settings` | ค่าตั้งต้น |
| `/api/sheets?sheet=line` | LINE raw messages |

## Dashboard Pages

| Route | หน้า | ข้อมูลหลัก |
|-------|------|-----------|
| `/` | ภาพรวม | KPI 8 cards, trend chart, donut, bar chart, insights |
| `/revenue` | รายได้ & กำไร | trend, monthly comparison, profit by driver |
| `/costs` | ต้นทุน | breakdown table, donut, abnormal cost alert |
| `/drivers` | คนขับ | ranking, performance cards, issue list |
| `/trips` | ติดตามงาน | table + search/filter + side panel |
| `/vehicle` | รถและต้นทุน | payback progress, break-even calculator |
| `/line-import` | LINE Import | message table, parse status |
| `/data-management` | จัดการข้อมูล | quality checklist, field dictionary |

## Key Business Logic

```
Fixed cost per trip = 17,500 บาท/เดือน ÷ ~130 trips = 135 บาท/trip
Total cost per trip = driver_cost + fuel + toll + fixed_allocation
Net profit per trip = trip_revenue - total_cost
Break-even trips = Monthly fixed cost ÷ Contribution margin per trip
```

**Cost allocation approach:** ใช้ per-trip allocation (135 บาท/รอบ) แทน full monthly fixed cost
เพื่อให้ตัวเลขถูกต้องเมื่อดูแบบ partial month

## Known Issues / Notes

- **Recharts v3 + Tailwind v4:** SVG sizing bug — แก้ด้วย `ChartContainer` custom component (`src/components/charts/chart-container.tsx`) ที่ใช้ ResizeObserver เอง
- **PieChart:** ใช้ custom SVG แทน Recharts Pie เพราะ v3 มี arc calculation bug เมื่อใช้ explicit pixel dimensions
- **Charts ใน screenshot:** dynamic import (`ssr: false`) ทำให้ screenshot tool capture ก่อน render แต่ browser จริงแสดงถูกต้อง

## Deploy

| Target | How | Time |
|--------|-----|------|
| Vercel (frontend) | Push to `main` branch | ~2 min auto |

```bash
git add -A && git commit -m "your message" && git push
# Vercel จะ deploy อัตโนมัติ
```

## Adding Real Trip Data

เพิ่มข้อมูลใน Google Sheets Sheet `trips`:

| Field | ตัวอย่าง | หมายเหตุ |
|-------|---------|---------|
| `trip_id` | `TRP-001` | unique |
| `job_date` | `2026-06-01` | YYYY-MM-DD |
| `trip_status` | `completed` | completed/cancelled/pending/incomplete |
| `trip_revenue` | `640` | บาท |
| `driver_cost` | `200` | บาท |
| `fuel_cost` | `85` | บาท |
| `assigned_driver_id` | `DRV-001` | ต้องตรงกับ drivers sheet |

## Pre-Deploy Checklist

- [ ] `npm run build` ผ่านโดยไม่มี error
- [ ] ตัวเลข KPI คำนวณถูกต้อง
- [ ] API route `/api/sheets` ตอบสนองได้
- [ ] `.env.local` ไม่ถูก commit ขึ้น Git
- [ ] Google Sheet เปิดเป็น "Anyone with link can view"

## Changelog

| Version | Date | Change |
|---------|------|--------|
| v1.3 | Jun 2026 | Connect Google Sheets API (API Key), useDashboardData hook, mock fallback |
| v1.2 | Jun 2026 | Dark green theme (Donezo-inspired), custom chart container, SVG donut |
| v1.1 | Jun 2026 | Google Sheets integration layer, Apps Script webhook setup |
| v1.0 | Jun 2026 | Initial MVP — 8 pages, mock data, Thai UI |
