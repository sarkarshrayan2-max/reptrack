"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardGraphData = {
  date: string;
  volume: number;
  maxWeight: number;
};

export default function DashboardProgressGraph({
  data,
}: {
  data: DashboardGraphData[];
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        No progress data yet. Log your first workout to see the graph.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-1 text-xl font-semibold text-white">
        Progress Graph
      </h2>

      <p className="mb-6 text-sm text-slate-400">
        Total workout volume and max weight lifted over time.
      </p>

      <div className="h-80 w-full" style={{ height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickMargin={10}
            />

            <YAxis
              yAxisId="volume"
              stroke="#22c55e"
              fontSize={12}
              tickMargin={8}
            />

            <YAxis
              yAxisId="weight"
              orientation="right"
              stroke="#38bdf8"
              fontSize={12}
              tickMargin={8}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#e5e7eb",
              }}
              labelStyle={{
                color: "#22c55e",
              }}
            />

            <Legend />

            <Line
              yAxisId="volume"
              type="monotone"
              dataKey="volume"
              name="Total Volume"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="maxWeight"
              name="Max Weight"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}