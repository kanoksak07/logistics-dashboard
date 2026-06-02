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
  { href: "/",                label: "ภาพรวม",        icon: LayoutDashboard },
  { href: "/revenue",         label: "รายได้ & กำไร", icon: TrendingUp },
  { href: "/costs",           label: "ต้นทุน",        icon: Receipt },
  { href: "/drivers",         label: "คนขับ",         icon: Users },
  { href: "/trips",           label: "ติดตามงาน",     icon: ClipboardList },
  { href: "/vehicle",         label: "รถและต้นทุน",   icon: Truck },
  { href: "/line-import",     label: "LINE Import",   icon: MessageSquare },
  { href: "/data-management", label: "จัดการข้อมูล", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-[#E5E7EB] flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center">
            <Truck size={15} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#1A1A1A] leading-tight">Logistics</div>
            <div className="text-[10px] text-[#6B7280] leading-tight">Dashboard</div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-5 pt-5 pb-1">
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">เมนู</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative",
                    active
                      ? "bg-[#F0FDF4] text-[#1B4332] font-semibold"
                      : "text-[#4B5563] hover:bg-[#F4F6F5] hover:text-[#1A1A1A]"
                  )}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1B4332] rounded-r-full" />
                  )}
                  <Icon
                    size={16}
                    className={active ? "text-[#1B4332]" : "text-[#9CA3AF]"}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* General Section */}
      <div className="px-3 pb-4 border-t border-[#E5E7EB] pt-3">
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest px-3 pb-1">General</p>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            pathname === "/settings"
              ? "bg-[#F0FDF4] text-[#1B4332] font-semibold"
              : "text-[#4B5563] hover:bg-[#F4F6F5]"
          )}
        >
          <Settings size={16} className="text-[#9CA3AF]" />
          ตั้งค่า
        </Link>
      </div>
    </aside>
  );
}
