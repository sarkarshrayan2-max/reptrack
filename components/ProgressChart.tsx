"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartLine = {
  dataKey: string;
  name: string;
  color: string;
};

type ProgressChartProps = {
  data: Record<string, string | number>[];
  lines: ChartLine[];
  xKey?: string;
};

export default function ProgressChart({
  data,
  lines,
  xKey = "date",
}: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-400">
        No chart data yet.
      </div>
    );
  }

  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
          />

          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}