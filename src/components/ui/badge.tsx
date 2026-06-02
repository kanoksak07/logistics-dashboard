import { TripStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<TripStatus, { label: string; className: string }> = {
  completed:   { label: "เสร็จสิ้น",       className: "bg-green-50 text-green-700 border-green-200" },
  in_progress: { label: "กำลังดำเนินการ",  className: "bg-blue-50 text-blue-700 border-blue-200" },
  assigned:    { label: "มอบหมายแล้ว",     className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  pending:     { label: "รอยืนยัน",        className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  imported:    { label: "Import แล้ว",     className: "bg-purple-50 text-purple-700 border-purple-200" },
  cancelled:   { label: "ยกเลิก",          className: "bg-red-50 text-red-700 border-red-200" },
  incomplete:  { label: "ข้อมูลไม่ครบ",   className: "bg-gray-50 text-gray-600 border-gray-200" },
};

interface StatusBadgeProps {
  status: TripStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", config.className, className)}>
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
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  error:   "bg-red-50 text-red-700",
  info:    "bg-blue-50 text-blue-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variantStyles[variant], className)}>
      {children}
    </span>
  );
}
