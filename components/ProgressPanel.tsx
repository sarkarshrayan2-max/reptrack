"use client";

import { useMemo, useState } from "react";
import ProgressChart from "@/components/ProgressChart";
import type { ExerciseSetWithWorkout } from "@/lib/types";

export default function ProgressPanel({
  sets,
}: {
  sets: ExerciseSetWithWorkout[];
}) {
  const exercises = useMemo(() => {
    return Array.from(new Set(sets.map((set) => set.exercise_name))).sort();
  }, [sets]);

  const [selectedExercise, setSelectedExercise] = useState(
    exercises[0] ?? "Bench Press"
  );

  const filteredSets = sets.filter(
    (set) => set.exercise_name === selectedExercise && set.workouts?.date
  );

  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; maxWeight: number; volume: number }>();

    filteredSets.forEach((set) => {
      const date = set.workouts?.date;
      if (!date) return;

      const current = map.get(date) ?? {
        date,
        maxWeight: 0,
        volume: 0,
      };

      current.maxWeight = Math.max(current.maxWeight, Number(set.weight_kg));
      current.volume += Number(set.reps) * Number(set.weight_kg);

      map.set(date, current);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [filteredSets]);

  const pr = filteredSets.reduce((max, set) => {
    return Math.max(max, Number(set.weight_kg));
  }, 0);

  if (sets.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        No workout data yet. Log a workout first.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Select Exercise
          </label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            {exercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <p className="text-sm text-emerald-300">Personal Record</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">{pr} kg</p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Max Weight Over Time
        </h2>

        <ProgressChart
          data={chartData}
          lines={[
            {
              dataKey: "maxWeight",
              name: "Max Weight",
              color: "#22c55e",
            },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Exercise Volume Over Time
        </h2>

        <ProgressChart
          data={chartData}
          lines={[
            {
              dataKey: "volume",
              name: "Volume",
              color: "#38bdf8",
            },
          ]}
        />
      </section>
    </div>
  );
}