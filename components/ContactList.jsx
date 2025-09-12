"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { loadConversation } from "@/lib/chatStorage";
import { MESSAGE_SENDERS } from "@/lib/constants";

export default function ContactList({ contacts, theme }) {
  const router = useRouter();
  const [savedConversations, setSavedConversations] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  // Check which contacts have saved conversations and get their last messages
  useEffect(() => {
    const checkSavedConversations = () => {
      const saved = {};
      const lastMsgs = {};

      contacts.forEach((contact) => {
        const conversation = loadConversation(contact.name);
        if (
          conversation &&
          conversation.messages &&
          conversation.messages.length > 0
        ) {
          saved[contact.name] = conversation.messages.length;

          // Find the last message from the AI (PERSON_A)
          const lastAiMessage = conversation.messages
            .slice()
            .reverse()
            .find((msg) => msg.sender === MESSAGE_SENDERS.PERSON_A);

          if (lastAiMessage) {
            // Truncate long messages for display
            let displayText = lastAiMessage.text;
            if (displayText.length > 60) {
              displayText = displayText.substring(0, 60) + "...";
            }
            lastMsgs[contact.name] = displayText;
          }
        }
      });

      setSavedConversations(saved);
      setLastMessages(lastMsgs);
    };

    checkSavedConversations();

    // Listen for changes in localStorage (when returning from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key && e.key.includes("textipal-conversations")) {
        checkSavedConversations();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also refresh when the window regains focus
    const handleFocus = () => {
      checkSavedConversations();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [contacts]);

  const handleContactClick = (contact) => {
    router.push(
      `/chat?name=${encodeURIComponent(
        contact.name
      )}&avatar=${encodeURIComponent(contact.avatar)}`
    );
  };

  if (contacts.length === 0) {
    return (
      <div className="p-6 text-center ">
        <p className="text-sm text-gray-500">No conversations found.</p>
      </div>
    );
  }

  const rotateClasses = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", ""];

  return (
    <ul
      className={
        "grid gap-5 sm:gap-6 " +
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 " +
        "auto-rows-fr"
      }
    >
      {contacts.map((contact, idx) => {
        const rotate = rotateClasses[idx % rotateClasses.length];
        // Occasionally feature a larger card for a playful spray effect
        const feature = idx % 7 === 0 ? "sm:col-span-2 sm:row-span-2" : "";
        const hasMessages = savedConversations[contact.name] > 0;
        const messageCount = savedConversations[contact.name] || 0;

        // Use the actual last message if available, otherwise use predefined
        const displayMessage = lastMessages[contact.name] || contact.last;
        const isActualMessage = !!lastMessages[contact.name];

        return (
          <li
            key={contact.id}
            className={
              `group relative cursor-pointer animate-in fade-in zoom-in ${rotate} ` +
              `rounded-3xl p-4 flex flex-col items-center text-center overflow-hidden ` +
              `${feature} ` +
              (theme === "dark"
                ? "bg-white/5 hover:bg-white/10"
                : "bg-white/80 hover:bg-white/95") +
              " backdrop-blur " +
              (theme === "dark"
                ? "border-white/10 shadow-[0_4px_16px_-2px_rgba(0,0,0,0.6)]"
                : "border-white/60 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.15)]") +
              " transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:rotate-0"
            }
            style={{ animationDelay: `${80 + idx * 40}ms` }}
            onClick={() => handleContactClick(contact)}
            aria-label={`Open chat with ${contact.name}`}
          >
            {/* Glow blob */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <span
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br from-teal-500 to-emerald-500 opacity-30`}
              />
            </span>

            <div
              className={`relative mb-3 p-1 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-black/10 ring-2 ring-emerald-500`}
            >
              <Image
                src={contact.avatar}
                alt=""
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover select-none"
                draggable={false}
              />

              {/* Message indicator */}
              {hasMessages && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  <span className="text-white text-xs font-bold">
                    {messageCount > 99 ? "99+" : messageCount}
                  </span>
                </div>
              )}
            </div>

            <h3
              className={
                `font-extrabold tracking-tight leading-snug mb-1 max-w-full truncate ` +
                (feature ? "text-lg md:text-xl " : "text-base md:text-lg ") +
                (theme === "dark" ? "text-white" : "text-gray-900")
              }
              title={contact.name}
            >
              {contact.name}
            </h3>
            <p
              className={
                `text-xs md:text-sm font-medium line-clamp-3 max-w-[15ch] sm:max-w-[18ch] md:max-w-[22ch] ` +
                (isActualMessage
                  ? theme === "dark"
                    ? "text-blue-300 group-hover:text-blue-200"
                    : "text-blue-600 group-hover:text-blue-700"
                  : theme === "dark"
                  ? "text-gray-300 group-hover:text-gray-200"
                  : "text-gray-600 group-hover:text-gray-700")
              }
              title={displayMessage}
            >
              {displayMessage}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
