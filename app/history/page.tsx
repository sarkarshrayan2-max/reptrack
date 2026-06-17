import { createClient } from "@/lib/supabase/server";
import WorkoutCard from "@/components/WorkoutCard";
import type { WorkoutWithSets } from "@/lib/types";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workouts")
    .select("*, exercise_sets(*)")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
        {error.message}
      </div>
    );
  }

  const workouts = (data ?? []) as WorkoutWithSets[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workout History</h1>
        <p className="mt-2 text-slate-400">
          View all your past workouts grouped by date.
        </p>
      </div>

      {workouts.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          No workout history yet.
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}