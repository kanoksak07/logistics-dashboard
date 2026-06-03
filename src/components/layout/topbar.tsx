"use client";

import { RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
  lastUpdated?: Date | null;
  isUsingMockData?: boolean;
  onRefresh?: () => void;
}

export function TopBar({ title, subtitle, lastUpdated, isUsingMockData, onRefresh }: TopBarProps) {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 1000);
  }

  const updatedText = lastUpdated
    ? lastUpdated.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น."
    : "21 มิ.ย. 2569";

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">{title}</h1>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Mock Data Badge */}
        {isUsingMockData && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            <AlertCircle size={11} />
            <span>ข้อมูลจำลอง — ยังไม่ได้เชื่อม Sheets</span>
          </div>
        )}
        {!isUsingMockData && lastUpdated && (
          <span className="text-xs text-[#9CA3AF]">อัปเดตล่าสุด: {updatedText}</span>
        )}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs font-medium text-[#1B4332] border border-[#C8D5C8] rounded-lg px-3 py-1.5 hover:bg-[#F0FDF4] transition-colors"
        >
          <RefreshCw size={12} className={cn(refreshing && "animate-spin")} />
          รีเฟรช
        </button>
      </div>
    </div>
  );
}
