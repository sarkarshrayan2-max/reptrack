"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const COMMON_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Pull Up",
  "Row",
];

type SetEntry = {
  reps: string;
  weight_kg: string;
};

type ExerciseEntry = {
  exercise_name: string;
  sets: SetEntry[];
};

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function ExerciseForm() {
  const router = useRouter();
  const supabase = createClient();

  const [date, setDate] = useState(todayDate());
  const [notes, setNotes] = useState("");

  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    {
      exercise_name: "Bench Press",
      sets: [{ reps: "", weight_kg: "" }],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateExerciseName(index: number, value: string) {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === index ? { ...exercise, exercise_name: value } : exercise
      )
    );
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetEntry,
    value: string
  ) {
    setExercises((prev) =>
      prev.map((exercise, i) => {
        if (i !== exerciseIndex) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set, j) =>
            j === setIndex ? { ...set, [field]: value } : set
          ),
        };
      })
    );
  }

  function updateSetCount(exerciseIndex: number, count: number) {
    if (count < 1) return;

    setExercises((prev) =>
      prev.map((exercise, i) => {
        if (i !== exerciseIndex) return exercise;

        const nextSets = [...exercise.sets];

        while (nextSets.length < count) {
          nextSets.push({ reps: "", weight_kg: "" });
        }

        while (nextSets.length > count) {
          nextSets.pop();
        }

        return {
          ...exercise,
          sets: nextSets,
        };
      })
    );
  }

  function addExercise() {
    setExercises((prev) => [
      ...prev,
      {
        exercise_name: "Squat",
        sets: [{ reps: "", weight_kg: "" }],
      },
    ]);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

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
      setError("You must be logged in to save a workout.");
      return;
    }

    const cleanedExercises = exercises.filter((exercise) =>
      exercise.exercise_name.trim()
    );

    if (cleanedExercises.length === 0) {
      setLoading(false);
      setError("Please add at least one exercise.");
      return;
    }

    for (const exercise of cleanedExercises) {
      for (const set of exercise.sets) {
        if (!set.reps || !set.weight_kg) {
          setLoading(false);
          setError("Please fill all reps and weight fields.");
          return;
        }
      }
    }

    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        date,
        notes: notes.trim() || null,
      })
      .select("id")
      .single();

    if (workoutError || !workout) {
      setLoading(false);
      setError(workoutError?.message || "Could not create workout.");
      return;
    }

    const setRows = cleanedExercises.flatMap((exercise) =>
      exercise.sets.map((set, index) => ({
        workout_id: workout.id,
        exercise_name: exercise.exercise_name.trim(),
        set_number: index + 1,
        reps: Number(set.reps),
        weight_kg: Number(set.weight_kg),
      }))
    );

    const { error: setsError } = await supabase
      .from("exercise_sets")
      .insert(setRows);

    setLoading(false);

    if (setsError) {
      setError(setsError.message);
      return;
    }

    router.refresh();
    router.push("/history");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
    >
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Date</label>
          <input
            type="date"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Notes</label>
          <input
            type="text"
            placeholder="Optional notes"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <datalist id="common-exercises">
        {COMMON_EXERCISES.map((exercise) => (
          <option key={exercise} value={exercise} />
        ))}
      </datalist>

      <div className="space-y-5">
        {exercises.map((exercise, exerciseIndex) => (
          <div
            key={exerciseIndex}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="mb-4 grid gap-4 md:grid-cols-[1fr_140px_auto]">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Exercise Name
                </label>
                <input
                  list="common-exercises"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
                  value={exercise.exercise_name}
                  onChange={(e) =>
                    updateExerciseName(exerciseIndex, e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Number of Sets
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
                  value={exercise.sets.length}
                  onChange={(e) =>
                    updateSetCount(exerciseIndex, Number(e.target.value))
                  }
                />
              </div>

              <div className="flex items-end">
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(exerciseIndex)}
                    className="rounded-lg border border-red-500/40 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className="grid gap-3 md:grid-cols-[80px_1fr_1fr]"
                >
                  <div className="flex items-center text-sm text-slate-400">
                    Set {setIndex + 1}
                  </div>

                  <input
                    type="number"
                    min={1}
                    placeholder="Reps"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
                    value={set.reps}
                    onChange={(e) =>
                      updateSet(exerciseIndex, setIndex, "reps", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    placeholder="Weight kg"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
                    value={set.weight_kg}
                    onChange={(e) =>
                      updateSet(
                        exerciseIndex,
                        setIndex,
                        "weight_kg",
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addExercise}
        className="rounded-lg border border-emerald-500/40 px-4 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10"
      >
        Add More Exercises
      </button>

      <button
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving workout..." : "Save Workout"}
      </button>
    </form>
  );
}