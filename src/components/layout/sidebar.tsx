"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Users,
  ClipboardList,
  Truck,
  MessageSquare,
  Database,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",                label: "ภาพรวม",           icon: LayoutDashboard },
  { href: "/revenue",         label: "รายได้ & กำไร",    icon: TrendingUp },
  { href: "/costs",           label: "ต้นทุน",           icon: Receipt },
  { href: "/drivers",         label: "คนขับ",            icon: Users },
  { href: "/trips",           label: "ติดตามงาน",        icon: ClipboardList },
  { href: "/vehicle",         label: "รถและต้นทุน",      icon: Truck },
  { href: "/line-import",     label: "LINE Import",      icon: MessageSquare },
  { href: "/data-management", label: "จัดการข้อมูล",    icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-[#E5E7EB] flex flex-col z-30">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center">
            <Truck size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#111827] leading-tight">Logistics</div>
            <div className="text-[10px] text-[#6B7280] leading-tight">Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                      : "text-[#374151] hover:bg-[#F8FAFC] hover:text-[#111827]"
                  )}
                >
                  <Icon size={15} className={active ? "text-[#2563EB]" : "text-[#6B7280]"} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-[#E5E7EB]">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#F8FAFC]"
        >
          <Settings size={15} className="text-[#6B7280]" />
          ตั้งค่า
        </Link>
      </div>
    </aside>
  );
}
