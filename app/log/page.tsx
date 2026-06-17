import ExerciseForm from "@/components/ExerciseForm";

export default function LogWorkoutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Workout</h1>
        <p className="mt-2 text-slate-400">
          Add exercises, sets, reps, and weights for today’s session.
        </p>
      </div>

      <ExerciseForm />
    </div>
  );
}