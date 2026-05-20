import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { SectionHeader } from "@/components/admin/DataTable";
import { ReportsCharts } from "./ReportsCharts";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [revenueAgg, expenseAgg, gstAgg, bookingsCount, customersCount, invoicesPaid, invoicesUnpaid] =
    await Promise.all([
      prisma.booking.aggregate({ _sum: { grandTotal: true, totalPrice: true } }).catch(() => ({ _sum: { grandTotal: null, totalPrice: null } })),
      prisma.expense.aggregate({ _sum: { amount: true, gstAmount: true } }).catch(() => ({ _sum: { amount: null, gstAmount: null } })),
      prisma.booking.aggregate({ _sum: { gstAmount: true } }).catch(() => ({ _sum: { gstAmount: null } })),
      prisma.booking.count().catch(() => 0),
      prisma.customer.count().catch(() => 0),
      prisma.invoice.count({ where: { status: "PAID" } }).catch(() => 0),
      prisma.invoice.count({ where: { status: "UNPAID" } }).catch(() => 0),
    ]);

  const totalRevenue = Number(revenueAgg._sum.grandTotal || 0);
  const subtotalRevenue = Number(revenueAgg._sum.totalPrice || 0);
  const totalExpenses = Number(expenseAgg._sum.amount || 0);
  const expenseGst = Number(expenseAgg._sum.gstAmount || 0);
  const revenueGst = Number(gstAgg._sum.gstAmount || 0);
  const netProfit = totalRevenue - totalExpenses;
  const netGst = revenueGst - expenseGst;

  // Monthly data for P&L chart
  const allBookings = await prisma.booking.findMany({ select: { grandTotal: true, totalPrice: true, gstAmount: true, createdAt: true } }).catch(() => []);
  const allExpenses = await prisma.expense.findMany({ select: { amount: true, gstAmount: true, date: true } }).catch(() => []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyPL: Record<string, { revenue: number; expenses: number; gst: number }> = {};

  for (const b of allBookings) {
    const m = monthNames[new Date(b.createdAt).getMonth()];
    if (!monthlyPL[m]) monthlyPL[m] = { revenue: 0, expenses: 0, gst: 0 };
    monthlyPL[m].revenue += Number(b.grandTotal);
    monthlyPL[m].gst += Number(b.gstAmount);
  }
  for (const e of allExpenses) {
    const m = monthNames[new Date(e.date).getMonth()];
    if (!monthlyPL[m]) monthlyPL[m] = { revenue: 0, expenses: 0, gst: 0 };
    monthlyPL[m].expenses += Number(e.amount);
  }

  const plData = Object.entries(monthlyPL).map(([month, data]) => ({
    month,
    revenue: Math.round(data.revenue * 100) / 100,
    expenses: Math.round(data.expenses * 100) / 100,
    profit: Math.round((data.revenue - data.expenses) * 100) / 100,
    gst: Math.round(data.gst * 100) / 100,
  }));

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Financial Reports"
        description="Profit & loss, GST summary, and operational metrics"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Gross Revenue" value={formatPrice(totalRevenue)} subValue={`Subtotal: ${formatPrice(subtotalRevenue)}`} />
        <StatCard label="Total Expenses" value={formatPrice(totalExpenses)} subValue={`Inc. GST: ${formatPrice(expenseGst)}`} />
        <StatCard
          label="Net Profit"
          value={formatPrice(netProfit)}
          trend={{ value: `${((netProfit / Math.max(totalRevenue, 1)) * 100).toFixed(1)}%`, positive: netProfit >= 0 }}
        />
        <StatCard label="Net GST Position" value={formatPrice(netGst)} subValue="Collected - Claimed" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Bookings" value={String(bookingsCount)} />
        <StatCard label="Total Customers" value={String(customersCount)} />
        <StatCard label="Invoices Paid" value={String(invoicesPaid)} />
        <StatCard label="Invoices Unpaid" value={String(invoicesUnpaid)} />
      </div>

      {/* P&L Chart */}
      <ReportsCharts plData={plData} />

      {/* P&L Table */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50/50">Month</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50/50 text-right">Revenue</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50/50 text-right">Expenses</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50/50 text-right">GST</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50/50 text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {plData.map((row) => (
              <tr key={row.month} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 text-[13px] font-medium text-stone-800">{row.month}</td>
                <td className="px-4 py-3 font-mono text-[13px] text-right">{formatPrice(row.revenue)}</td>
                <td className="px-4 py-3 font-mono text-[13px] text-right text-stone-500">{formatPrice(row.expenses)}</td>
                <td className="px-4 py-3 font-mono text-[13px] text-right text-stone-400">{formatPrice(row.gst)}</td>
                <td className={`px-4 py-3 font-mono text-[13px] text-right font-medium ${row.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {formatPrice(row.profit)}
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr className="bg-stone-50 border-t border-stone-300">
              <td className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-stone-600">Total</td>
              <td className="px-4 py-3 font-mono text-[13px] text-right font-semibold">{formatPrice(totalRevenue)}</td>
              <td className="px-4 py-3 font-mono text-[13px] text-right font-semibold text-stone-500">{formatPrice(totalExpenses)}</td>
              <td className="px-4 py-3 font-mono text-[13px] text-right font-semibold text-stone-400">{formatPrice(revenueGst)}</td>
              <td className={`px-4 py-3 font-mono text-[13px] text-right font-semibold ${netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
                {formatPrice(netProfit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
