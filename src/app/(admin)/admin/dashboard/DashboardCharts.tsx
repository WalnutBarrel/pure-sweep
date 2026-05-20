"use client";

import {
  RevenueExpenseChart,
  NetProfitChart,
  BookingsByServiceChart,
  PaymentStatusChart,
  CustomerGrowthChart,
} from "@/components/admin/AdminCharts";

interface DashboardChartsProps {
  revenueExpenseData: { month: string; revenue: number; expenses: number }[];
  profitData: { month: string; profit: number }[];
  serviceData: { name: string; value: number }[];
  paymentStatusData: { status: string; count: number; amount: number }[];
  customerGrowthData: { month: string; customers: number }[];
}

export function DashboardCharts({
  revenueExpenseData,
  profitData,
  serviceData,
  paymentStatusData,
  customerGrowthData,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <RevenueExpenseChart data={revenueExpenseData} />
      <NetProfitChart data={profitData} />
      <BookingsByServiceChart data={serviceData} />
      <PaymentStatusChart data={paymentStatusData} />
      <CustomerGrowthChart data={customerGrowthData} />
    </div>
  );
}
