import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ label, value, subValue, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-white border border-stone-200 p-5 space-y-3", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <p className="text-2xl font-mono font-medium text-stone-900 tracking-tight leading-none truncate">
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "text-[11px] font-mono font-medium",
              trend.positive ? "text-green-700" : "text-red-600"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      {subValue && (
        <p className="text-[11px] text-stone-400 font-mono">{subValue}</p>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 p-5 space-y-3">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton h-7 w-32" />
      <div className="skeleton h-3 w-16" />
    </div>
  );
}
