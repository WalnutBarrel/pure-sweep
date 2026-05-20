"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

const defaultData = [
  { date: "Mon", revenue: 160 },
  { date: "Tue", revenue: 320 },
  { date: "Wed", revenue: 320 },
  { date: "Thu", revenue: 480 },
  { date: "Fri", revenue: 760 },
  { date: "Sat", revenue: 1070 },
  { date: "Sun", revenue: 1070 },
];

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F3D3E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0F3D3E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD6CC" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280" 
            fontSize={10}
            tickLine={false} 
            axisLine={false}
            dy={10}
            style={{ fontFamily: "var(--font-sans)" }}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={10}
            tickLine={false} 
            axisLine={false}
            dx={-10}
            tickFormatter={(value) => `$${value}`}
            style={{ fontFamily: "var(--font-sans)" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              border: "1px solid #DDD6CC",
              borderRadius: "0px",
              fontFamily: "var(--font-sans)",
              fontSize: "11px"
            }}
            labelStyle={{ fontWeight: "bold", color: "#111827" }}
            itemStyle={{ color: "#0F3D3E" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`$${value}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0F3D3E"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
