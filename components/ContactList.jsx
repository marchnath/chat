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

  return (
    <ul className="space-y-2">
      {contacts.map((contact, idx) => (
        <li
          key={contact.id}
          className="group cursor-pointer animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${80 + idx * 50}ms` }}
          onClick={() => handleContactClick(contact)}
        >
          <div className="flex items-center gap-3 p-3 transition-colors  ">
            <div className="relative">
              <Image
                src={contact.avatar}
                alt={contact.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p
                    className={
                      "font-medium truncate " +
                      (theme === "dark" ? "text-white" : "text-gray-900")
                    }
                  >
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate capitalize">
                    {contact.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400 ml-2 shrink-0">
                  {contact.time}
                </span>
              </div>
              <p
                className={
                  "text-sm truncate transition-colors " +
                  (theme === "dark"
                    ? "text-gray-300 group-hover:text-gray-200"
                    : "text-gray-600 group-hover:text-gray-700")
                }
              >
                {contact.last}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
