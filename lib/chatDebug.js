// Debug utilities for chat storage
import {
  getAllSavedContacts,
  loadConversation,
  clearAllConversations,
} from "./chatStorage";

/**
 * Debug function to log all saved conversations
 * Use in browser console: debugChats()
 */
export function debugChats() {
  console.group("💬 Saved Conversations");

  const contacts = getAllSavedContacts();

  if (contacts.length === 0) {
    console.log("No saved conversations found");
  } else {
    contacts.forEach((contactName) => {
      const conversation = loadConversation(contactName);
      if (conversation) {
        console.group(`📱 ${contactName}`);
        console.log(`Messages: ${conversation.messages?.length || 0}`);
        console.log(`Current Hint: ${conversation.currentHint || "None"}`);
        console.log(`Last Updated: ${conversation.lastUpdated || "Unknown"}`);
        console.log("Full conversation:", conversation);
        console.groupEnd();
      }
    });
  }

  console.groupEnd();
}

/**
 * Debug function to get storage stats
 */
export function getStorageStats() {
  const contacts = getAllSavedContacts();
  let totalMessages = 0;
  let totalSize = 0;

  contacts.forEach((contactName) => {
    const conversation = loadConversation(contactName);
    if (conversation) {
      totalMessages += conversation.messages?.length || 0;
      // Estimate size in bytes (rough calculation)
      totalSize += JSON.stringify(conversation).length;
    }
  });

  return {
    totalContacts: contacts.length,
    totalMessages,
    estimatedSizeBytes: totalSize,
    estimatedSizeKB: Math.round((totalSize / 1024) * 100) / 100,
    contacts: contacts,
  };
}

/**
 * Debug function to clear all conversations (with confirmation)
 */
export function debugClearAll() {
  const stats = getStorageStats();

  if (stats.totalContacts === 0) {
    console.log("No conversations to clear");
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to clear all ${stats.totalContacts} conversations (${stats.totalMessages} messages total)?`
  );

  if (confirmed) {
    clearAllConversations();
    console.log("✅ All conversations cleared");
  } else {
    console.log("❌ Clear operation cancelled");
  }
}

// Make functions available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.debugChats = debugChats;
  window.getStorageStats = getStorageStats;
  window.debugClearAll = debugClearAll;

  console.log("💬 Chat debug utilities loaded! Try:");
  console.log("- debugChats() - View all saved conversations");
  console.log("- getStorageStats() - Get storage statistics");
  console.log("- debugClearAll() - Clear all conversations");
}
