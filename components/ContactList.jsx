"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ContactList({ contacts, theme }) {
  const router = useRouter();

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

  // Bubbly / bold style mapping
  const personalityGradients = {
    spouse: "from-pink-500 to-rose-500",
    friend: "from-indigo-500 to-purple-500",
    stranger: "from-teal-500 to-emerald-500",
    colleague: "from-amber-500 to-orange-500",
    client: "from-sky-500 to-cyan-500",
    neutral: "from-slate-500 to-slate-600",
  };

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
        const gradient =
          personalityGradients[contact.personality] ||
          personalityGradients.friend;
        const rotate = rotateClasses[idx % rotateClasses.length];
        // Occasionally feature a larger card for a playful spray effect
        const feature = idx % 7 === 0 ? "sm:col-span-2 sm:row-span-2" : "";
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
              " backdrop-blur border " +
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
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br ${gradient} opacity-30`}
              />
            </span>

            <div
              className={
                `relative mb-3 p-1 rounded-full bg-gradient-to-br ${gradient} shadow-lg shadow-black/10 ring-2 ` +
                (theme === "dark" ? "ring-white/10" : "ring-white/50")
              }
            >
              <Image
                src={contact.avatar}
                alt=""
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover select-none"
                draggable={false}
              />
              {/* Pulse status dot */}
              <span
                aria-hidden
                className={
                  `absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br ${gradient} shadow-inner shadow-black/30 animate-pulse` +
                  " ring-2 " +
                  (theme === "dark" ? "ring-gray-900" : "ring-white")
                }
              />
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
                (theme === "dark"
                  ? "text-gray-300 group-hover:text-gray-200"
                  : "text-gray-600 group-hover:text-gray-700")
              }
              title={contact.last}
            >
              {contact.last}
            </p>

            {/* Subtle underline accent */}
            <span
              aria-hidden
              className={
                `mt-4 mb-1 h-1 w-8 rounded-full bg-gradient-to-r ${gradient} opacity-70 group-hover:opacity-100 transition-opacity` +
                (feature ? " md:w-12" : "")
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
