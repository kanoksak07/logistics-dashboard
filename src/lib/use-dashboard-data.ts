"use client";

import { useEffect, useState, useCallback } from "react";
import type { Trip, Driver, Vehicle, CostRecord } from "./mock-data";

export interface DashboardData {
  trips: Trip[];
  drivers: Driver[];
  vehicles: Vehicle[];
  costs: CostRecord[];
  settings: Record<string, string>;
  lastUpdated: Date | null;
  isLoading: boolean;
  isUsingMockData: boolean;
  error: string | null;
  refresh: () => void;
}

function sheetRowToTrip(row: Record<string, string>): Trip {
  const num = (k: string) => parseFloat(row[k] || "0") || 0;
  const revenue = num("trip_revenue");
  const driverCost = num("driver_cost");
  const fuelCost = num("fuel_cost");
  const tollFee = num("toll_fee");
  const otherCost = num("other_cost");
  const fixedAlloc = num("fixed_cost_allocation") || 135;
  const totalCost = driverCost + fuelCost + tollFee + otherCost + fixedAlloc;
  const netProfit = revenue - totalCost;

  return {
    trip_id: row.trip_id || "",
    job_id: row.job_id || "",
    job_date: row.job_date || "",
    pickup_date: row.pickup_date || "",
    pickup_time: row.pickup_time || "",
    customer_name: row.customer_name || "",
    customer_phone: row.customer_phone || "",
    pickup_address: row.pickup_address || "",
    google_map_link: row.google_map_link || undefined,
    warehouse_name: row.warehouse_name || "",
    assigned_driver_id: row.assigned_driver_id || null,
    assigned_driver_name: row.assigned_driver_name || null,
    vehicle_id: row.vehicle_id || "VEH-001",
    trip_status: (row.trip_status as Trip["trip_status"]) || "pending",
    trip_revenue: revenue,
    driver_cost: driverCost,
    fuel_cost: fuelCost,
    toll_fee: tollFee,
    other_cost: otherCost,
    fixed_cost_allocation: fixedAlloc,
    total_cost: num("total_cost") || totalCost,
    net_profit: num("net_profit") || netProfit,
    profit_margin: revenue > 0 ? parseFloat(((netProfit / revenue) * 100).toFixed(1)) : 0,
    remark: row.remark || "",
    created_at: row.created_at || "",
  };
}

function sheetRowToDriver(row: Record<string, string>): Driver {
  return {
    driver_id: row.driver_id || "",
    driver_name: row.driver_name || "",
    phone: row.phone || "",
    default_cost_per_trip: parseFloat(row.default_cost_per_trip || "200"),
    active_status: row.active_status?.toLowerCase() === "true",
    start_date: row.start_date || "",
  };
}

function sheetRowToVehicle(row: Record<string, string>): Vehicle {
  return {
    vehicle_id: row.vehicle_id || "",
    vehicle_name: row.vehicle_name || "",
    license_plate: row.license_plate || "",
    purchase_cost: parseFloat(row.purchase_cost || "0"),
    purchase_date: row.purchase_date || "",
    insurance_cost_per_year: parseFloat(row.insurance_cost_per_year || "0"),
    maintenance_budget_per_month: parseFloat(row.maintenance_budget_per_month || "0"),
    active_status: row.active_status?.toLowerCase() === "true",
  };
}

function sheetRowToCost(row: Record<string, string>): CostRecord {
  return {
    cost_id: row.cost_id || "",
    cost_date: row.cost_date || "",
    cost_category: row.cost_category || "",
    cost_amount: parseFloat(row.cost_amount || "0"),
    vehicle_id: row.vehicle_id || undefined,
    driver_id: row.driver_id || undefined,
    remark: row.remark || "",
  };
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<Omit<DashboardData, "refresh">>({
    trips: [],
    drivers: [],
    vehicles: [],
    costs: [],
    settings: {},
    lastUpdated: null,
    isLoading: true,
    isUsingMockData: false,
    error: null,
  });

  const load = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch("/api/sheets?sheet=all");
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      const realTrips = (json.trips || []).map(sheetRowToTrip);

      // ถ้า Sheets ยังไม่มีข้อมูล trips ให้ใช้ mock data แทน
      if (realTrips.length === 0) {
        const { trips: mockTrips, drivers: mockDrivers, vehicles: mockVehicles, costRecords: mockCosts } = await import("./mock-data");
        setData({
          trips: mockTrips,
          drivers: (json.drivers || []).length > 0 ? (json.drivers || []).map(sheetRowToDriver) : mockDrivers,
          vehicles: (json.vehicles || []).length > 0 ? (json.vehicles || []).map(sheetRowToVehicle) : mockVehicles,
          costs: (json.costs || []).length > 0 ? (json.costs || []).map(sheetRowToCost) : mockCosts,
          settings: Object.keys(json.settings || {}).length > 0 ? json.settings : {},
          lastUpdated: new Date(),
          isLoading: false,
          isUsingMockData: true,
          error: null,
        });
        return;
      }

      setData({
        trips: realTrips,
        drivers: (json.drivers || []).map(sheetRowToDriver),
        vehicles: (json.vehicles || []).map(sheetRowToVehicle),
        costs: (json.costs || []).map(sheetRowToCost),
        settings: json.settings || {},
        lastUpdated: new Date(),
        isLoading: false,
        isUsingMockData: false,
        error: null,
      });
    } catch (err) {
      // Fallback to mock data
      const { trips, drivers, vehicles, costRecords } = await import("./mock-data");
      setData({
        trips,
        drivers,
        vehicles,
        costs: costRecords,
        settings: {
          default_revenue_per_trip: "640",
          default_driver_cost_per_trip: "200",
          monthly_vehicle_fixed_cost: "17500",
          monthly_target_profit: "15000",
          fuel_cost_warning_threshold: "120",
          minimum_profit_per_trip: "150",
          vehicle_purchase_cost: "800000",
          target_payback_months: "24",
        },
        lastUpdated: new Date(),
        isLoading: false,
        isUsingMockData: true,
        error: err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลได้",
      });
    }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh ทุก 10 นาที
    const interval = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  return { ...data, refresh: load };
}
