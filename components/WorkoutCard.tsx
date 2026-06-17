"use client";

import { useState } from "react";
import type { WorkoutWithSets } from "@/lib/types";

function getWorkoutVolume(workout: WorkoutWithSets) {
  return workout.exercise_sets.reduce((total, set) => {
    return total + Number(set.reps) * Number(set.weight_kg);
  }, 0);
}

export default function WorkoutCard({ workout }: { workout: WorkoutWithSets }) {
  const [open, setOpen] = useState(false);

  const totalVolume = getWorkoutVolume(workout);

  const grouped = workout.exercise_sets.reduce<Record<string, typeof workout.exercise_sets>>(
    (acc, set) => {
      if (!acc[set.exercise_name]) acc[set.exercise_name] = [];
      acc[set.exercise_name].push(set);
      return acc;
    },
    {}
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <h3 className="font-semibold text-white">{workout.date}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {Object.keys(grouped).join(", ") || "No exercises"}
          </p>
          {workout.notes && (
            <p className="mt-2 text-sm text-slate-500">{workout.notes}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">Volume</p>
          <p className="font-bold text-emerald-400">
            {totalVolume.toFixed(1)} kg
          </p>
        </div>
      </button>

      {open && (
        <div className="mt-5 space-y-4 border-t border-slate-800 pt-4">
          {Object.entries(grouped).map(([exercise, sets]) => (
            <div key={exercise}>
              <h4 className="mb-2 font-semibold text-blue-400">{exercise}</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-2 text-left">Set</th>
                      <th className="py-2 text-left">Reps</th>
                      <th className="py-2 text-left">Weight</th>
                      <th className="py-2 text-left">Volume</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sets
                      .sort((a, b) => a.set_number - b.set_number)
                      .map((set) => (
                        <tr key={set.id} className="border-t border-slate-800">
                          <td className="py-2">{set.set_number}</td>
                          <td className="py-2">{set.reps}</td>
                          <td className="py-2">{Number(set.weight_kg)} kg</td>
                          <td className="py-2">
                            {Number(set.reps) * Number(set.weight_kg)} kg
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}