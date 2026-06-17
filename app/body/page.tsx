import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BodyMetricForm from "@/components/BodyMetricForm";
import type { BodyMetric } from "@/lib/types";

export default async function BodyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
        {error.message}
      </div>
    );
  }

  const metrics = (data ?? []) as BodyMetric[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Body Tracking</h1>
        <p className="mt-2 text-slate-400">
          Track body weight and waist to connect your workout progress with your fitness goal.
        </p>
      </div>

      <BodyMetricForm />

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Body Metric History
        </h2>

        {metrics.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No body metrics logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Weight</th>
                  <th className="px-4 py-3 text-left">Waist</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                </tr>
              </thead>

              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{metric.date}</td>
                    <td className="px-4 py-3">
                      {Number(metric.weight_kg).toFixed(1)} kg
                    </td>
                    <td className="px-4 py-3">
                      {metric.waist_cm
                        ? `${Number(metric.waist_cm).toFixed(1)} cm`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {metric.notes ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}