"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">{title}</h1>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#9CA3AF]">อัปเดตล่าสุด: 21 มิ.ย. 2569</span>
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
