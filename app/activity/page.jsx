"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ActivityPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 px-4 sm:px-6 lg:px-10 pt-6 pb-24">
      <header className="mb-10 flex items-center gap-4">
        <button
          aria-label="Back"
          onClick={() => router.push("/")}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text">
          Activity
        </h1>
      </header>
      <div className="max-w-2xl space-y-6">
        <p className="text-sm text-slate-400">
          This page will show your practice streaks, exercises, and progress
          summaries. Coming soon.
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-slate-300 font-medium">No activity data yet.</p>
          <p className="text-xs text-slate-500 mt-2">
            Start a conversation to build your streak.
          </p>
        </div>
      </div>
    </div>
  );
}
