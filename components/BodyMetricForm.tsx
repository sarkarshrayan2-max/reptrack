"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function BodyMetricForm() {
  const router = useRouter();
  const supabase = createClient();

  const [date, setDate] = useState(todayDate());
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [notes, setNotes] = useState("");

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

    if (!weight) {
      setLoading(false);
      setError("Please enter your body weight.");
      return;
    }

    const { error } = await supabase.from("body_metrics").insert({
      user_id: user.id,
      date,
      weight_kg: Number(weight),
      waist_cm: waist ? Number(waist) : null,
      notes: notes.trim() || null,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setWeight("");
    setWaist("");
    setNotes("");

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
    >
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Body Weight kg
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Example: 72.5"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Waist cm
          </label>
          <input
            type="number"
            step="0.1"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          placeholder="Optional notes"
        />
      </div>

      <button
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Body Metric"}
      </button>
    </form>
  );
}