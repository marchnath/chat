"use client";

import { ArrowLeft, MoreVertical, Flame, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useProfileStore from "@/lib/store";
import { useState, useRef, useEffect } from "react";

export default function ChatHeader({
  contactName,
  contactAvatar,
  gradient,
  onClearChat,
}) {
  const router = useRouter();
  const { streakDays } = useProfileStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const menuRef = useRef(null);
  const dialogRef = useRef(null);

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (
        showConfirmDialog &&
        dialogRef.current &&
        !dialogRef.current.contains(event.target)
      ) {
        setShowConfirmDialog(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        setShowMenu(false);
        setShowConfirmDialog(false);
      }
    }

    if (showMenu || showConfirmDialog) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showMenu, showConfirmDialog]);

  const handleClearChat = () => {
    setShowMenu(false);
    setShowConfirmDialog(true);
  };

  const confirmClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
    setShowConfirmDialog(false);
  };

  const cancelClearChat = () => {
    setShowConfirmDialog(false);
  };

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
          </div>
        </div>
        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur border border-white/10 rounded-lg shadow-lg shadow-black/40 z-50">
              <div className="py-1">
                <button
                  onClick={handleClearChat}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-white/5 transition text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={dialogRef}
            className="bg-slate-800/95 backdrop-blur border border-white/10 rounded-xl shadow-xl shadow-black/40 max-w-sm w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Clear Chat</h3>
                <p className="text-slate-400 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to clear all messages in this conversation
              with {contactName}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelClearChat}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition text-sm font-medium"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
