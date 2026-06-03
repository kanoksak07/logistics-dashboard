"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, ClipboardList, Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mainNav = [
  { href: "/",       label: "ภาพรวม",    icon: LayoutDashboard },
  { href: "/revenue",label: "รายได้",    icon: TrendingUp },
  { href: "/trips",  label: "งาน",       icon: ClipboardList },
  { href: "/drivers",label: "คนขับ",     icon: Users },
];

const moreNav = [
  { href: "/costs",           label: "ต้นทุน" },
  { href: "/vehicle",         label: "รถ" },
  { href: "/line-import",     label: "LINE Import" },
  { href: "/data-management", label: "จัดการข้อมูล" },
  { href: "/settings",        label: "ตั้งค่า" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More drawer */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-lg rounded-t-2xl p-4"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {moreNav.map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setShowMore(false)}
                  className={cn(
                    "flex flex-col items-center py-3 px-2 rounded-xl text-xs font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[#F0FDF4] text-[#1B4332]"
                      : "text-[#4B5563] hover:bg-[#F4F6F5]"
                  )}>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainNav.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-[60px]",
                  active ? "text-[#1B4332]" : "text-[#9CA3AF]"
                )}>
                <Icon size={20} className={active ? "text-[#1B4332]" : "text-[#9CA3AF]"} />
                <span className={cn("text-[10px] font-medium", active ? "text-[#1B4332]" : "text-[#9CA3AF]")}>
                  {item.label}
                </span>
                {active && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#1B4332]" />}
              </Link>
            );
          })}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[60px]",
              showMore ? "text-[#1B4332]" : "text-[#9CA3AF]"
            )}>
            <MoreHorizontal size={20} />
            <span className="text-[10px] font-medium">เพิ่มเติม</span>
          </button>
        </div>
      </nav>
    </>
  );
}
