import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: string[];
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ columns, children, className }: DataTableProps) {
  return (
    <div className={cn("bg-white border border-stone-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50/50 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-[13px] text-stone-700">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DataTableRowSkeleton({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className={cn("skeleton h-4", i === 0 ? "w-28" : "w-20")} />
        </td>
      ))}
    </tr>
  );
}

export function StatusBadge({
  status,
  variant = "default",
}: {
  status: string;
  variant?: "default" | "payment";
}) {
  let classes = "bg-stone-100 text-stone-500 border-stone-200";

  if (variant === "payment") {
    if (status === "PAID") classes = "bg-green-50 text-green-700 border-green-200";
    else if (status === "PARTIAL") classes = "bg-amber-50 text-amber-700 border-amber-200";
    else if (status === "REFUNDED") classes = "bg-violet-50 text-violet-700 border-violet-200";
    else classes = "bg-stone-100 text-stone-500 border-stone-200";
  } else {
    if (status === "CONFIRMED") classes = "bg-green-50 text-green-700 border-green-200";
    else if (status === "COMPLETED") classes = "bg-blue-50 text-blue-700 border-blue-200";
    else if (status === "IN_PROGRESS") classes = "bg-cyan-50 text-cyan-700 border-cyan-200";
    else if (status === "CANCELLED") classes = "bg-red-50 text-red-600 border-red-200";
    else if (status === "PENDING") classes = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
        classes
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border border-stone-200 p-6 space-y-4", className)}>
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-[200px] w-full" />
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-stone-200">
      <div>
        <h2 className="text-lg font-serif font-normal text-stone-900">{title}</h2>
        {description && (
          <p className="text-[12px] text-stone-400 mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
