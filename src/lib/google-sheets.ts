import { google } from "googleapis";

// ====================================
// Google Sheets Client (Server-side only)
// ====================================

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");

  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getSheetData(sheetName: string): Promise<string[][]> {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("SPREADSHEET_ID is not set");

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  return (response.data.values as string[][]) || [];
}

// ====================================
// Parse helpers — converts raw 2D array to typed objects
// ====================================

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
        obj[h.trim()] = row[i]?.trim() ?? "";
      });
      return obj as T;
    });
}

// ====================================
// Typed fetchers
// ====================================

export async function fetchTrips() {
  const rows = await getSheetData("trips");
  return rowsToObjects(rows);
}

export async function fetchDrivers() {
  const rows = await getSheetData("drivers");
  return rowsToObjects(rows);
}

export async function fetchVehicles() {
  const rows = await getSheetData("vehicles");
  return rowsToObjects(rows);
}

export async function fetchCosts() {
  const rows = await getSheetData("costs");
  return rowsToObjects(rows);
}

export async function fetchSettings() {
  const rows = await getSheetData("settings");
  const objects = rowsToObjects<{ setting_name: string; setting_value: string }>(rows);
  const map: Record<string, string> = {};
  objects.forEach((s) => { map[s.setting_name] = s.setting_value; });
  return map;
}

export async function fetchLineMessages() {
  const rows = await getSheetData("line_raw_messages");
  return rowsToObjects(rows);
}
