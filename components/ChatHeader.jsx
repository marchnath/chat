"use client";

import { ArrowLeft, MoreVertical, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useProfileStore from "@/lib/store";

export default function ChatHeader({
  contactName,
  contactAvatar,
  gradient,
  personality,
}) {
  const router = useRouter();
  const { streakDays } = useProfileStore();

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
              <span
                aria-hidden
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br ${gradient} ring-2 ring-slate-950 shadow shadow-black/50 animate-pulse`}
              />
            </div>
          ) : (
            <div
              className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white text-sm font-extrabold`}
            >
              {contactAvatar?.length <= 3 ? contactAvatar : contactAvatar[0]}
            </div>
          )}
          <div className="leading-tight max-w-[14rem]">
            <h1 className="font-extrabold tracking-tight text-white text-base sm:text-lg">
              {contactName}
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-400">
              {personality} practice partner
            </p>
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
