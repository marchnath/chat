"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChatHeader({ contactName, contactAvatar }) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/90 backdrop-blur border-b border-slate-700/50 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => router.push("/")}
            className="p-2 -ml-2 mr-1 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          {/^\/.+\.(png|jpg|jpeg|svg|gif|webp)$/i.test(contactAvatar) ? (
            <Image
              src={contactAvatar}
              alt={contactName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {contactAvatar?.length <= 3 ? contactAvatar : contactAvatar[0]}
            </div>
          )}
          <div>
            <h1 className="font-semibold text-white leading-5">
              {contactName}
            </h1>
            <p className="text-xs text-slate-400">Conversation practice</p>
          </div>
        </div>

        {/* Decorative Menu Button */}
        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
