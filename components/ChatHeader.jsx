"use client";

import { ArrowLeft, MoreVertical, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useProfileStore from "@/lib/store";
import { PERSONALITIES } from "@/lib/constants";
import { useState } from "react";

export default function ChatHeader({
  contactName,
  contactAvatar,
  gradient,
  personality,
}) {
  const router = useRouter();
  const {
    streakDays,
    personality: globalPersonality,
    setPersonality,
  } = useProfileStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 px-4 sm:px-6 pt-4 pb-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            aria-label="Back"
            onClick={() => router.push("/")}
            className="p-2 -ml-2 mr-1 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {/^\/.+\.(png|jpg|jpeg|svg|gif|webp)$/i.test(contactAvatar) ? (
            <div className="relative">
              <Image
                src={contactAvatar}
                alt={contactName}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-extrabold`}
            >
              {contactAvatar?.length <= 3 ? contactAvatar : contactAvatar[0]}
            </div>
          )}
          <div className="leading-tight max-w-[14rem]">
            <h1 className="font-extrabold tracking-tight text-white text-base sm:text-lg">
              {contactName}
            </h1>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-[10px] sm:text-xs font-semibold text-slate-300 hover:text-white focus:outline-none inline-flex items-center gap-1 group"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="capitalize">{globalPersonality}</span>
              <span className="opacity-40 group-hover:opacity-60">▼</span>
            </button>
            {open && (
              <ul
                role="listbox"
                className="absolute mt-1 z-30 w-40 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur shadow-xl p-1 animate-in fade-in"
              >
                {PERSONALITIES.map((p) => (
                  <li key={p}>
                    <button
                      role="option"
                      aria-selected={p === globalPersonality}
                      onClick={() => {
                        setPersonality(p);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs capitalize font-medium transition ${
                        p === globalPersonality
                          ? "bg-sky-500/20 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-sky-400 font-bold text-xs select-none">
            <Flame className="w-4 h-4 text-sky-500" />
            <span>{streakDays}</span>
          </div>
          <button className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
