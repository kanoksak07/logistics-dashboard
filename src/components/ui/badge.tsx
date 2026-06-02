import { TripStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<TripStatus, { label: string; className: string }> = {
  completed:   { label: "เสร็จสิ้น",      className: "bg-[#D8F3DC] text-[#1B4332]" },
  in_progress: { label: "กำลังดำเนินการ", className: "bg-blue-50 text-blue-700" },
  assigned:    { label: "มอบหมายแล้ว",    className: "bg-indigo-50 text-indigo-700" },
  pending:     { label: "รอยืนยัน",       className: "bg-amber-50 text-amber-700" },
  imported:    { label: "Import แล้ว",    className: "bg-purple-50 text-purple-700" },
  cancelled:   { label: "ยกเลิก",         className: "bg-red-50 text-red-700" },
  incomplete:  { label: "ข้อมูลไม่ครบ",  className: "bg-gray-100 text-gray-600" },
};

interface StatusBadgeProps {
  status: TripStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-[#D8F3DC] text-[#1B4332]",
  warning: "bg-amber-50 text-amber-700",
  error:   "bg-red-50 text-red-700",
  info:    "bg-blue-50 text-blue-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}
