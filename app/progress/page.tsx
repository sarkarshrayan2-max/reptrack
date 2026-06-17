import { createClient } from "@/lib/supabase/server";
import ProgressPanel from "@/components/ProgressPanel";
import type { ExerciseSetWithWorkout } from "@/lib/types";

export default async function ProgressPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exercise_sets")
    .select("*, workouts(date)")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
        {error.message}
      </div>
    );
  }

  const sets = (data ?? []) as ExerciseSetWithWorkout[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="mt-2 text-slate-400">
          Track your strength and volume for each exercise.
        </p>
      </div>

      <ProgressPanel sets={sets} />
    </div>
  );
}