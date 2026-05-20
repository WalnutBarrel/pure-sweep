"use client";

import { RevenueExpenseChart, NetProfitChart } from "@/components/admin/AdminCharts";

interface ReportsChartsProps {
  plData: { month: string; revenue: number; expenses: number; profit: number; gst: number }[];
}

export function ReportsCharts({ plData }: ReportsChartsProps) {
  const reData = plData.map((d) => ({ month: d.month, revenue: d.revenue, expenses: d.expenses }));
  const profitData = plData.map((d) => ({ month: d.month, profit: d.profit }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RevenueExpenseChart data={reData} />
      <NetProfitChart data={profitData} />
    </div>
  );
}
