"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/log", label: "Log Workout" },
  { href: "/progress", label: "Progress" },
  { href: "/history", label: "History" },
  { href: "/body", label: "Body" },
  { href: "/goals", label: "Goals" },
];

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-xl font-bold text-emerald-400">
          RepTrack
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}

          <span className="text-xs text-slate-500">{email}</span>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm md:hidden"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-slate-800 px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-300 hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}

          <p className="text-xs text-slate-500">{email}</p>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}