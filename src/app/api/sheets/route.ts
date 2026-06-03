import { NextRequest, NextResponse } from "next/server";
import { fetchTrips, fetchDrivers, fetchVehicles, fetchCosts, fetchSettings, fetchLineMessages } from "@/lib/google-sheets";

// GET /api/sheets?sheet=trips
export async function GET(req: NextRequest) {
  const sheet = req.nextUrl.searchParams.get("sheet") || "all";

  const isConfigured =
    process.env.SPREADSHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!isConfigured) {
    return NextResponse.json(
      { error: "Google Sheets not configured. Set SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    if (sheet === "trips")    return NextResponse.json(await fetchTrips());
    if (sheet === "drivers")  return NextResponse.json(await fetchDrivers());
    if (sheet === "vehicles") return NextResponse.json(await fetchVehicles());
    if (sheet === "costs")    return NextResponse.json(await fetchCosts());
    if (sheet === "settings") return NextResponse.json(await fetchSettings());
    if (sheet === "line")     return NextResponse.json(await fetchLineMessages());

    // "all" — fetch everything in parallel
    const [trips, drivers, vehicles, costs, settings, line] = await Promise.all([
      fetchTrips(), fetchDrivers(), fetchVehicles(),
      fetchCosts(), fetchSettings(), fetchLineMessages(),
    ]);
    return NextResponse.json({ trips, drivers, vehicles, costs, settings, line });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
