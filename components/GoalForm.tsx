"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserGoal } from "@/lib/types";

const GOAL_OPTIONS = [
  "Gain Muscle",
  "Lose Fat",
  "Maintain Weight",
  "Gain Weight",
  "Improve Strength",
  "General Fitness",
];

const EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Pull Up",
  "Row",
];

export default function GoalForm({
  currentGoal,
}: {
  currentGoal: UserGoal | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [goalType, setGoalType] = useState(
    currentGoal?.goal_type ?? "Gain Muscle"
  );

  const [startWeight, setStartWeight] = useState(
    currentGoal?.start_weight_kg?.toString() ?? ""
  );

  const [targetWeight, setTargetWeight] = useState(
    currentGoal?.target_weight_kg?.toString() ?? ""
  );

  const [targetExercise, setTargetExercise] = useState(
    currentGoal?.target_exercise ?? "Bench Press"
  );

  const [targetLift, setTargetLift] = useState(
    currentGoal?.target_lift_kg?.toString() ?? ""
  );

  const [weeklyTarget, setWeeklyTarget] = useState(
    currentGoal?.weekly_workout_target?.toString() ?? "4"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setError("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("user_goals").upsert(
      {
        user_id: user.id,
        goal_type: goalType,
        start_weight_kg: startWeight ? Number(startWeight) : null,
        target_weight_kg: targetWeight ? Number(targetWeight) : null,
        target_exercise: targetExercise || null,
        target_lift_kg: targetLift ? Number(targetLift) : null,
        weekly_workout_target: Number(weeklyTarget) || 4,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">
          {currentGoal ? "Update Your Fitness Goal" : "Set Your Fitness Goal"}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Choose your main goal so RepTrack can personalize your dashboard,
          weekly insights, and progress tracking.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Fitness Goal
        </label>

        <select
          value={goalType}
          onChange={(e) => setGoalType(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
        >
          {GOAL_OPTIONS.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Starting Body Weight kg
          </label>

          <input
            type="number"
            step="0.1"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Example: 72"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Target Body Weight kg
          </label>

          <input
            type="number"
            step="0.1"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Example: 68"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Target Exercise
          </label>

          <select
            value={targetExercise}
            onChange={(e) => setTargetExercise(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          >
            {EXERCISES.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Target Lift kg
          </label>

          <input
            type="number"
            step="0.5"
            value={targetLift}
            onChange={(e) => setTargetLift(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Example: 100"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Weekly Workout Target
        </label>

        <input
          type="number"
          min={1}
          value={weeklyTarget}
          onChange={(e) => setWeeklyTarget(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
        />
      </div>

      <button
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving goal..." : currentGoal ? "Update Goal" : "Save Goal"}
      </button>
    </form>
  );
}