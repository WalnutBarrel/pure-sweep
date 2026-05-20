"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = {
  primary: "#0F3D3E",
  accent: "#B58A4A",
  stone300: "#D6D3D1",
  stone200: "#E7E5E4",
  green: "#2F855A",
  red: "#B42318",
  blue: "#3B82F6",
  amber: "#D97706",
};

const PIE_COLORS = ["#0F3D3E", "#B58A4A", "#2F855A", "#3B82F6", "#D97706", "#6B7280"];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-white border border-stone-200 p-5 space-y-4 ${className}`}>
      <h3 className="text-[13px] font-semibold text-stone-700 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MonoTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 text-white px-3 py-2 text-[11px] font-mono shadow-sm">
      <p className="text-stone-400 mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, i: number) => (
        <p key={i}>
          <span className="text-stone-400">{entry.name}: </span>
          <span className="font-medium">
            ${typeof entry.value === "number" ? entry.value.toLocaleString("en-NZ", { minimumFractionDigits: 2 }) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function RevenueExpenseChart({
  data,
}: {
  data: { month: string; revenue: number; expenses: number }[];
}) {
  return (
    <ChartCard title="Revenue vs Expenses" className="col-span-2">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.stone200} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <Tooltip content={<MonoTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.08} strokeWidth={1.5} name="Revenue" />
          <Area type="monotone" dataKey="expenses" stroke={CHART_COLORS.accent} fill={CHART_COLORS.accent} fillOpacity={0.06} strokeWidth={1.5} name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function NetProfitChart({
  data,
}: {
  data: { month: string; profit: number }[];
}) {
  return (
    <ChartCard title="Monthly Net Profit">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.stone200} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <Tooltip content={<MonoTooltip />} />
          <Bar dataKey="profit" name="Net Profit" radius={[1, 1, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.profit >= 0 ? CHART_COLORS.primary : CHART_COLORS.red} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BookingsByServiceChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ChartCard title="Bookings by Service">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            strokeWidth={1}
            stroke="#F5F4F1"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<MonoTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-500">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

export function PaymentStatusChart({
  data,
}: {
  data: { status: string; count: number; amount: number }[];
}) {
  return (
    <ChartCard title="Payment Status">
      <div className="space-y-3">
        {data.map((item) => {
          const total = data.reduce((s, d) => s + d.count, 0);
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          let barColor = CHART_COLORS.stone300;
          if (item.status === "PAID") barColor = CHART_COLORS.green;
          else if (item.status === "PARTIAL") barColor = CHART_COLORS.amber;
          else if (item.status === "REFUNDED") barColor = CHART_COLORS.blue;

          return (
            <div key={item.status} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-600 font-medium">{item.status}</span>
                <span className="font-mono text-stone-400">
                  {item.count} &middot; ${item.amount.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="h-1.5 bg-stone-100 w-full">
                <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

export function CustomerGrowthChart({
  data,
}: {
  data: { month: string; customers: number }[];
}) {
  return (
    <ChartCard title="Customer Growth">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.stone200} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <Tooltip content={<MonoTooltip />} />
          <Area type="monotone" dataKey="customers" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.06} strokeWidth={1.5} name="Customers" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
