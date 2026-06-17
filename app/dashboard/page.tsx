import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WorkoutCard from "@/components/WorkoutCard";
import DashboardProgressGraph from "@/components/DashboardProgressGraph";
import BodyWeightGraph from "@/components/BodyWeightGraph";
import type { BodyMetric, UserGoal, WorkoutWithSets } from "@/lib/types";

function getWorkoutVolume(workout: WorkoutWithSets) {
  return workout.exercise_sets.reduce((total, set) => {
    return total + Number(set.reps) * Number(set.weight_kg);
  }, 0);
}

function getWorkoutMaxWeight(workout: WorkoutWithSets) {
  if (workout.exercise_sets.length === 0) return 0;

  return Math.max(...workout.exercise_sets.map((set) => Number(set.weight_kg)));
}

function getDaysAgo(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  return diff / (1000 * 60 * 60 * 24);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getBodyGoalProgress(goal: UserGoal | null, latestWeight: number | null) {
  if (
    !goal ||
    latestWeight === null ||
    goal.start_weight_kg === null ||
    goal.target_weight_kg === null
  ) {
    return null;
  }

  const start = Number(goal.start_weight_kg);
  const target = Number(goal.target_weight_kg);

  if (start === target) return null;

  // Direction-aware formula:
  // Lose fat example: start 65, target 58, latest 63
  // (63 - 65) / (58 - 65) = 28.5%
  //
  // Gain weight example: start 58, target 65, latest 60
  // (60 - 58) / (65 - 58) = 28.5%
  const progress = ((latestWeight - start) / (target - start)) * 100;

  return clamp(progress, 0, 100);
}

function buildInsights({
  goal,
  workoutsThisWeek,
  weeklyTarget,
  volumeThisWeek,
  volumePreviousWeek,
  latestWeight,
  firstWeight,
  bodyMetricCount,
}: {
  goal: UserGoal | null;
  workoutsThisWeek: number;
  weeklyTarget: number;
  volumeThisWeek: number;
  volumePreviousWeek: number;
  latestWeight: number | null;
  firstWeight: number | null;
  bodyMetricCount: number;
}) {
  const insights: string[] = [];

  if (!goal) {
    insights.push("Set your fitness goal to unlock personalized insights.");
  }

  if (workoutsThisWeek >= weeklyTarget) {
    insights.push(
      `Great consistency. You completed ${workoutsThisWeek}/${weeklyTarget} workouts this week.`
    );
  } else {
    insights.push(
      `You completed ${workoutsThisWeek}/${weeklyTarget} workouts this week. Try to hit your weekly target.`
    );
  }

  if (volumePreviousWeek > 0) {
    const change =
      ((volumeThisWeek - volumePreviousWeek) / volumePreviousWeek) * 100;

    if (change > 0) {
      insights.push(
        `Your training volume is up ${change.toFixed(1)}% compared to last week.`
      );
    } else if (change < 0) {
      insights.push(
        `Your training volume is down ${Math.abs(change).toFixed(1)}% compared to last week.`
      );
    }
  }

  if (goal && latestWeight !== null && firstWeight !== null) {
    const goalText = goal.goal_type.toLowerCase();

    if (bodyMetricCount < 2) {
      insights.push(
        "You logged your starting body weight. Add another body metric after a few days to calculate your real trend."
      );
      return insights.slice(0, 4);
    }

    const weightChange = latestWeight - firstWeight;

    if (goalText.includes("lose") || goalText.includes("fat")) {
      if (weightChange < 0) {
        insights.push(
          `You are down ${Math.abs(weightChange).toFixed(1)} kg from your first logged weight.`
        );
      } else {
        insights.push(
          "Your weight has not decreased yet. Keep training consistently and track body metrics weekly."
        );
      }
    }

    if (goalText.includes("gain")) {
      if (weightChange > 0) {
        insights.push(
          `You are up ${weightChange.toFixed(1)} kg from your first logged weight.`
        );
      } else {
        insights.push(
          "Your weight has not increased yet. Track food intake and training consistency."
        );
      }
    }

    if (goalText.includes("maintain")) {
      insights.push(
        `Your current weight is ${latestWeight.toFixed(1)} kg. Try to keep it near your target range.`
      );
    }
  }

  return insights.slice(0, 4);
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: workoutsData, error: workoutsError } = await supabase
    .from("workouts")
    .select("*, exercise_sets(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const { data: goalData } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: bodyData } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (workoutsError) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
        {workoutsError.message}
      </div>
    );
  }

  const workouts = (workoutsData ?? []) as WorkoutWithSets[];
  const goal = (goalData ?? null) as UserGoal | null;
  const bodyMetrics = (bodyData ?? []) as BodyMetric[];

  const totalWorkouts = workouts.length;

  const workoutsThisWeekList = workouts.filter((workout) => {
    const daysAgo = getDaysAgo(workout.date);
    return daysAgo >= 0 && daysAgo <= 7;
  });

  const workoutsPreviousWeekList = workouts.filter((workout) => {
    const daysAgo = getDaysAgo(workout.date);
    return daysAgo > 7 && daysAgo <= 14;
  });

  const workoutsThisWeek = workoutsThisWeekList.length;
  const weeklyTarget = goal?.weekly_workout_target ?? 4;

  const volumeThisWeek = workoutsThisWeekList.reduce(
    (total, workout) => total + getWorkoutVolume(workout),
    0
  );

  const volumePreviousWeek = workoutsPreviousWeekList.reduce(
    (total, workout) => total + getWorkoutVolume(workout),
    0
  );

  const graphData = workouts
    .map((workout) => ({
      date: workout.date,
      volume: getWorkoutVolume(workout),
      maxWeight: getWorkoutMaxWeight(workout),
    }))
    .reverse();

  const bodyWeightGraphData = bodyMetrics
    .map((metric) => ({
      date: metric.date,
      weight: Number(metric.weight_kg),
    }))
    .reverse();

  const latestWeight =
    bodyMetrics.length > 0 ? Number(bodyMetrics[0].weight_kg) : null;

  const firstWeight =
    bodyMetrics.length > 0
      ? Number(bodyMetrics[bodyMetrics.length - 1].weight_kg)
      : null;

  const bodyGoalProgress = getBodyGoalProgress(goal, latestWeight);

  const weeklyProgress = Math.min(
    100,
    Math.round((workoutsThisWeek / weeklyTarget) * 100)
  );

  const bestLift = workouts.reduce((max, workout) => {
    return Math.max(max, getWorkoutMaxWeight(workout));
  }, 0);

  const insights = buildInsights({
    goal,
    workoutsThisWeek,
    weeklyTarget,
    volumeThisWeek,
    volumePreviousWeek,
    latestWeight,
    firstWeight,
    bodyMetricCount: bodyMetrics.length,
  });

  const lastFiveWorkouts = workouts.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{" "}
            <span className="text-emerald-400">{user.email}</span>
          </h1>

          <p className="mt-2 text-slate-400">
            Track workouts, body weight, goal progress, and weekly consistency.
          </p>
        </div>

        {!goal && (
          <Link
            href="/goals"
            className="rounded-lg bg-emerald-500 px-4 py-3 text-center font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Set Your Goal
          </Link>
        )}
      </section>

      {goal && (
        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm text-emerald-300">Current Goal</p>

          <h2 className="mt-1 text-2xl font-bold text-emerald-400">
            {goal.goal_type}
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Weekly target: {weeklyTarget} workouts
            {goal.target_weight_kg
              ? ` · Target body weight: ${Number(goal.target_weight_kg)} kg`
              : ""}
            {goal.target_lift_kg
              ? ` · ${goal.target_exercise}: ${Number(goal.target_lift_kg)} kg`
              : ""}
          </p>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>
                {bodyGoalProgress !== null
                  ? "Body Goal Progress"
                  : "Weekly Target Progress"}
              </span>

              <span>
                {bodyGoalProgress !== null
                  ? `${bodyGoalProgress.toFixed(0)}%`
                  : `${weeklyProgress}%`}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{
                  width: `${
                    bodyGoalProgress !== null
                      ? bodyGoalProgress
                      : weeklyProgress
                  }%`,
                }}
              />
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <p className="text-sm text-slate-400">Total Workouts</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-400">
            {totalWorkouts}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <p className="text-sm text-slate-400">This Week</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {workoutsThisWeek}/{weeklyTarget}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <p className="text-sm text-slate-400">Weekly Volume</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-400">
            {volumeThisWeek.toFixed(0)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <p className="text-sm text-slate-400">
            {latestWeight !== null ? "Current Weight" : "Best Lift Overall"}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {latestWeight !== null
              ? `${latestWeight.toFixed(1)} kg`
              : `${bestLift} kg`}
          </h2>

          {bodyGoalProgress !== null && (
            <p className="mt-2 text-xs text-slate-400">
              Body goal progress: {bodyGoalProgress.toFixed(0)}%
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Smart Insights
        </h2>

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300"
            >
              {insight}
            </div>
          ))}
        </div>
      </section>

      <DashboardProgressGraph data={graphData} />

      {goal && bodyMetrics.length === 0 && (
        <section className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
          <h2 className="text-xl font-semibold text-blue-300">
            Add Body Weight
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            To calculate your {goal.goal_type.toLowerCase()} progress, add your
            current body weight in the Body Tracking page.
          </p>

          <Link
            href="/body"
            className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-3 font-semibold text-slate-950 hover:bg-blue-400"
          >
            Add Body Metric
          </Link>
        </section>
      )}

      {bodyMetrics.length > 0 && (
        <BodyWeightGraph data={bodyWeightGraphData} />
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Last 5 Workouts
        </h2>

        {lastFiveWorkouts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No workouts yet. Go to Log Workout and add your first session.
          </div>
        ) : (
          <div className="space-y-4">
            {lastFiveWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}