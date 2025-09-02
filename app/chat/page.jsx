import { Suspense } from "react";
import ChatInterface from "@/components/ChatInterface";

export const metadata = {
  title: "Chat | Language Practice",
};

function ChatInterfaceWrapper() {
  return <ChatInterface />;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-slate-900">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ChatInterfaceWrapper />
    </Suspense>
  );
}
