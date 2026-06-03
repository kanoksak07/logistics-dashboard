/**
 * Google Sheets Integration
 * ใช้ API Key (ง่ายกว่า Service Account) — Sheet ต้อง "Anyone with link can view"
 */

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";
const API_KEY = process.env.GOOGLE_API_KEY || "";
const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

export async function getSheetData(sheetName: string): Promise<string[][]> {
  if (!SPREADSHEET_ID || !API_KEY) {
    throw new Error("SPREADSHEET_ID หรือ GOOGLE_API_KEY ยังไม่ได้ตั้งค่า");
  }

  const range = encodeURIComponent(`${sheetName}!A:Z`);
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return (data.values as string[][]) || [];
}

export function rowsToObjects<T extends Record<string, string>>(
  rows: string[][]
): T[] {
  if (rows.length < 2) return [];
  const [headers, ...data] = rows;
  return data
    .filter((row) => row.some((cell) => cell?.trim()))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = (row[i] ?? "").trim();
      });
      return obj as T;
    });
}

export async function fetchTrips() {
  return rowsToObjects(await getSheetData("trips"));
}

export async function fetchDrivers() {
  return rowsToObjects(await getSheetData("drivers"));
}

export async function fetchVehicles() {
  return rowsToObjects(await getSheetData("vehicles"));
}

export async function fetchCosts() {
  return rowsToObjects(await getSheetData("costs"));
}

export async function fetchSettings() {
  const rows = rowsToObjects<{ setting_name: string; setting_value: string }>(
    await getSheetData("settings")
  );
  const map: Record<string, string> = {};
  rows.forEach((s) => { map[s.setting_name] = s.setting_value; });
  return map;
}

export async function fetchLineMessages() {
  return rowsToObjects(await getSheetData("line_raw_messages"));
}
