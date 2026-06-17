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

type BodyWeightData = {
  date: string;
  weight: number;
};

export default function BodyWeightGraph({ data }: { data: BodyWeightData[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        No body weight data yet. Add body metrics to see your trend.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-1 text-xl font-semibold text-white">
        Body Weight Trend
      </h2>

      <p className="mb-6 text-sm text-slate-400">
        See whether your weight is moving according to your goal.
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

            <YAxis stroke="#94a3b8" fontSize={12} />

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

            <Line
              type="monotone"
              dataKey="weight"
              name="Body Weight"
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