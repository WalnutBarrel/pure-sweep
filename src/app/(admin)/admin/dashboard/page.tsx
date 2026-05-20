import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { DashboardCharts } from "./DashboardCharts";

export const dynamic = "force-dynamic";

const GST_RATE = 0.15;

export default async function AdminDashboardPage() {
  // Fetch all metrics in parallel
  const [
    revenueAgg,
    expenseAgg,
    gstAgg,
    bookingsTotal,
    bookingsCompleted,
    bookingsPending,
    bookingsUpcoming,
    customersTotal,
    invoicesPending,
    recentBookings,
    recentInvoices,
    recentExpenses,
    recentCustomers,
    bookingsByService,
    allBookings,
    allExpenses,
    allCustomers,
    paymentData,
  ] = await Promise.all([
    prisma.booking.aggregate({ _sum: { grandTotal: true } }).catch(() => ({ _sum: { grandTotal: null } })),
    prisma.expense.aggregate({ _sum: { amount: true } }).catch(() => ({ _sum: { amount: null } })),
    prisma.booking.aggregate({ _sum: { gstAmount: true } }).catch(() => ({ _sum: { gstAmount: null } })),
    prisma.booking.count().catch(() => 0),
    prisma.booking.count({ where: { status: "COMPLETED" } }).catch(() => 0),
    prisma.booking.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.booking.count({ where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } } }).catch(() => 0),
    prisma.customer.count().catch(() => 0),
    prisma.invoice.count({ where: { status: "UNPAID" } }).catch(() => 0),
    prisma.booking.findMany({
      include: { customer: true, bookingItems: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.invoice.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.expense.findMany({
      orderBy: { date: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.bookingItem.groupBy({
      by: ["serviceName"],
      _count: { id: true },
    }).catch(() => []),
    prisma.booking.findMany({
      select: { grandTotal: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }).catch(() => []),
    prisma.expense.findMany({
      select: { amount: true, date: true },
      orderBy: { date: "asc" },
    }).catch(() => []),
    prisma.customer.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }).catch(() => []),
    prisma.invoice.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { totalAmount: true },
    }).catch(() => []),
  ]);

  const totalRevenue = Number(revenueAgg._sum.grandTotal || 0);
  const totalExpenses = Number(expenseAgg._sum.amount || 0);
  const totalGst = Number(gstAgg._sum.gstAmount || 0);
  const netProfit = totalRevenue - totalExpenses;

  // Build monthly data for charts
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue: Record<string, number> = {};
  const monthlyExpenses: Record<string, number> = {};
  const monthlyCustomers: Record<string, number> = {};

  for (const b of allBookings) {
    const m = monthNames[new Date(b.createdAt).getMonth()];
    monthlyRevenue[m] = (monthlyRevenue[m] || 0) + Number(b.grandTotal);
  }
  for (const e of allExpenses) {
    const m = monthNames[new Date(e.date).getMonth()];
    monthlyExpenses[m] = (monthlyExpenses[m] || 0) + Number(e.amount);
  }

  let cumCustomers = 0;
  for (const c of allCustomers) {
    const m = monthNames[new Date(c.createdAt).getMonth()];
    cumCustomers++;
    monthlyCustomers[m] = cumCustomers;
  }

  // Consolidate into chart-ready arrays
  const activeMonths = [...new Set([...Object.keys(monthlyRevenue), ...Object.keys(monthlyExpenses)])];
  if (activeMonths.length === 0) activeMonths.push("May");

  const revenueExpenseData = activeMonths.map((m) => ({
    month: m,
    revenue: Math.round((monthlyRevenue[m] || 0) * 100) / 100,
    expenses: Math.round((monthlyExpenses[m] || 0) * 100) / 100,
  }));

  const profitData = activeMonths.map((m) => ({
    month: m,
    profit: Math.round(((monthlyRevenue[m] || 0) - (monthlyExpenses[m] || 0)) * 100) / 100,
  }));

  const serviceData = bookingsByService.map((s) => ({
    name: s.serviceName,
    value: s._count.id,
  }));

  const paymentStatusData = paymentData.map((p) => ({
    status: p.status,
    count: p._count.id,
    amount: Number(p._sum.totalAmount || 0),
  }));

  const customerGrowthData = Object.entries(monthlyCustomers).map(([month, customers]) => ({
    month,
    customers,
  }));

  return (
    <div className="space-y-6 animate-enter-fade">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} />
        <StatCard label="Total Expenses" value={formatPrice(totalExpenses)} />
        <StatCard
          label="Net Profit"
          value={formatPrice(netProfit)}
          trend={{ value: formatPrice(netProfit), positive: netProfit >= 0 }}
        />
        <StatCard label="GST Collected" value={formatPrice(totalGst)} subValue={`${(GST_RATE * 100).toFixed(0)}% NZ GST`} />
        <StatCard label="Pending Invoices" value={String(invoicesPending)} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total Bookings" value={String(bookingsTotal)} />
        <StatCard label="Completed" value={String(bookingsCompleted)} />
        <StatCard label="Upcoming Jobs" value={String(bookingsUpcoming)} />
        <StatCard label="New Customers" value={String(customersTotal)} />
        <StatCard label="Pending Bookings" value={String(bookingsPending)} />
      </div>

      {/* Charts */}
      <DashboardCharts
        revenueExpenseData={revenueExpenseData}
        profitData={profitData}
        serviceData={serviceData}
        paymentStatusData={paymentStatusData}
        customerGrowthData={customerGrowthData}
      />

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Bookings */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">Recent Bookings</h3>
          <DataTable columns={["Client", "Service", "Total", "Status"]}>
            {recentBookings.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-800 text-[13px]">{b.customer.name}</p>
                  <p className="text-[11px] text-stone-400">{b.customer.email}</p>
                </td>
                <td className="px-4 py-3 text-[13px]">
                  {b.bookingItems.map((i) => i.serviceName).join(", ") || "Service"}
                </td>
                <td className="px-4 py-3 font-mono text-[13px] text-stone-700">
                  {formatPrice(Number(b.grandTotal))}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        {/* Recent Invoices */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">Recent Invoices</h3>
          <DataTable columns={["Invoice", "Customer", "Amount", "Status"]}>
            {recentInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-mono text-[13px] text-stone-700">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-[13px]">{inv.customer.name}</td>
                <td className="px-4 py-3 font-mono text-[13px] text-stone-700">{formatPrice(Number(inv.totalAmount))}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={inv.status} variant="payment" />
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        {/* Recent Expenses */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">Recent Expenses</h3>
          <DataTable columns={["Description", "Category", "Amount", "Date"]}>
            {recentExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 text-[13px] max-w-[200px] truncate">{exp.description}</td>
                <td className="px-4 py-3 text-[11px] uppercase tracking-wider text-stone-500">{exp.category}</td>
                <td className="px-4 py-3 font-mono text-[13px] text-stone-700">{formatPrice(Number(exp.amount))}</td>
                <td className="px-4 py-3 text-[12px] text-stone-500">
                  {new Date(exp.date).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        {/* Recent Customers */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">Recent Customers</h3>
          <DataTable columns={["Name", "Email", "Suburb", "Joined"]}>
            {recentCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-medium text-[13px] text-stone-800">{cust.name}</td>
                <td className="px-4 py-3 text-[13px]">{cust.email}</td>
                <td className="px-4 py-3 text-[13px] text-stone-500">{cust.suburb || "—"}</td>
                <td className="px-4 py-3 text-[12px] text-stone-500">
                  {new Date(cust.createdAt).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>
    </div>
  );
}
