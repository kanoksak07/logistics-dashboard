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
  featured?: boolean; // dark green card (like Total Projects in Donezo)
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
  featured = false,
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  if (featured) {
    return (
      <div className={cn(
        "rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden",
        "bg-[#1B4332] text-white",
        className
      )}>
        {/* Background accent circle */}
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 top-8 w-16 h-16 rounded-full bg-white/5" />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold text-green-200 uppercase tracking-wide">{label}</span>
          {icon && <span className="text-green-300 bg-white/20 rounded-lg p-1.5">{icon}</span>}
        </div>

        <div className="text-3xl font-bold leading-tight relative z-10">{value}</div>

        {subValue && (
          <div className="text-xs text-green-200 relative z-10">{subValue}</div>
        )}

        {change !== undefined && (
          <div className="flex items-center gap-1.5 relative z-10">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
              {isPositive && <TrendingUp size={10} className="text-green-200" />}
              {isNegative && <TrendingDown size={10} className="text-red-300" />}
              {!isPositive && !isNegative && <Minus size={10} className="text-green-200" />}
              <span className="text-[11px] font-medium text-green-100">
                {isPositive ? "+" : ""}{change.toFixed(1)}%
              </span>
            </div>
            {changeLabel && (
              <span className="text-[11px] text-green-200">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-2",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</span>
        {icon && <span className="text-[#9CA3AF]">{icon}</span>}
      </div>

      <div className={cn("text-2xl font-bold text-[#1A1A1A] leading-tight", valueColor)}>
        {value}
      </div>

      {subValue && (
        <div className="text-xs text-[#6B7280]">{subValue}</div>
      )}

      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp size={11} className="text-[#2D6A4F]" />}
          {isNegative && <TrendingDown size={11} className="text-red-500" />}
          {!isPositive && !isNegative && <Minus size={11} className="text-gray-400" />}
          <span className={cn(
            "text-xs font-medium",
            isPositive && "text-[#2D6A4F]",
            isNegative && "text-red-500",
            !isPositive && !isNegative && "text-gray-400"
          )}>
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-[#9CA3AF]">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
