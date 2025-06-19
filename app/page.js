"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactsPage() {
  const router = useRouter();
  const contacts = [
    {
      id: 1,
      name: "Emie",
      label: "friend",
    },
    {
      id: 2,
      name: "Alex",
      label: "Colleague",
    },
    {
      id: 3,
      name: "Johnson",
      label: "Stranger",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Contact List */}
        <div className="space-y-4 mb-8">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => router.push(`/chat/`)}
              className="flex items-center space-x-4  p-4 border-b border-gray-200   hover:bg-emerald-50 transition-shadow duration-200"
            >
              {/* Avatar */}
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>

              {/* Contact Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {contact.name}
                </h3>
                <p className="text-gray-600 text-sm">{contact.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lesson Button */}
        <div className="fixed bottom-0 left-0 right-0  p-4 shadow-lg flex justify-center">
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
            onClick={() => router.push(`/chat/`)}
          >
            Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
