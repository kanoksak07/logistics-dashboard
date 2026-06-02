import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  valueColor?: string;
}

export function KpiCard({
  label,
  value,
  subValue,
  change,
  changeLabel,
  icon,
  className,
  valueColor,
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div className={cn("bg-white rounded-lg border border-[#E5E7EB] p-4 flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</span>
        {icon && <span className="text-[#6B7280]">{icon}</span>}
      </div>

      <div className={cn("text-2xl font-bold text-[#111827] leading-tight", valueColor)}>
        {value}
      </div>

      {subValue && (
        <div className="text-xs text-[#6B7280]">{subValue}</div>
      )}

      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp size={12} className="text-green-600" />}
          {isNegative && <TrendingDown size={12} className="text-red-600" />}
          {isNeutral && <Minus size={12} className="text-gray-400" />}
          <span className={cn(
            "text-xs font-medium",
            isPositive && "text-green-600",
            isNegative && "text-red-600",
            isNeutral && "text-gray-400"
          )}>
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-[#6B7280]">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
