import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GoalForm from "@/components/GoalForm";
import type { UserGoal } from "@/lib/types";

export default async function GoalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
        {error.message}
      </div>
    );
  }

  const goal = (data ?? null) as UserGoal | null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Fitness Goals</h1>

        <p className="mt-2 text-slate-400">
          Set your goal so RepTrack can personalize your dashboard, insights,
          and progress tracking.
        </p>
      </div>

      <GoalForm currentGoal={goal} />
    </div>
  );
}