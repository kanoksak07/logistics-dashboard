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
    : null;

  return (
    <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
      <div>
        <h1 className="text-base md:text-lg font-bold text-[#1A1A1A]">{title}</h1>
        {subtitle && <p className="text-[10px] md:text-xs text-[#6B7280]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {isUsingMockData && (
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-1">
            <AlertCircle size={10} />
            <span>ข้อมูลจำลอง</span>
          </div>
        )}
        {!isUsingMockData && updatedText && (
          <span className="hidden sm:block text-xs text-[#9CA3AF]">{updatedText}</span>
        )}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-xs font-medium text-[#1B4332] border border-[#C8D5C8] rounded-lg px-2.5 py-1.5 hover:bg-[#F0FDF4] transition-colors"
        >
          <RefreshCw size={12} className={cn(refreshing && "animate-spin")} />
          <span className="hidden sm:inline">รีเฟรช</span>
        </button>
      </div>
    </div>
  );
}
