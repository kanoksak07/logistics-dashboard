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
    <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
      <div>
        <h1 className="text-base font-semibold text-[#111827]">{title}</h1>
        {subtitle && <p className="text-xs text-[#6B7280]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#6B7280]">อัปเดตล่าสุด: 21 มิ.ย. 2569</span>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded px-2.5 py-1.5 hover:bg-[#F8FAFC] transition-colors"
        >
          <RefreshCw size={12} className={cn(refreshing && "animate-spin")} />
          รีเฟรช
        </button>
      </div>
    </div>
  );
}
