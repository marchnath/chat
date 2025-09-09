"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TongueIcon from "@/components/TongueIcon";

export default function CustomExercisePage() {
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
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur">
            <TongueIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-red-400 to-rose-500 text-transparent bg-clip-text">
            Custom Exercise
          </h1>
        </div>
      </header>
      <div className="max-w-2xl space-y-6">
        <p className="text-sm text-slate-400">
          Design and run tailored pronunciation, vocabulary, or grammar drills
          here. This is a placeholder.
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <p className="text-slate-300 font-medium">No custom exercises yet.</p>
          <p className="text-xs text-slate-500">
            Soon you'll be able to configure prompts, repetition counts, target
            words, and evaluation metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
