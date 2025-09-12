// Chat storage utilities for persisting conversations locally

const CHAT_STORAGE_KEY = "textipal-conversations";

/**
 * Get the storage key for a specific contact's conversation
 * @param {string} contactName - The name of the contact
 * @returns {string} - The storage key
 */
function getContactKey(contactName) {
  return `${CHAT_STORAGE_KEY}-${contactName
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

/**
 * Save a conversation for a specific contact
 * @param {string} contactName - The name of the contact
 * @param {Object} conversationData - The conversation data to save
 */
export function saveConversation(contactName, conversationData) {
  try {
    const key = getContactKey(contactName);
    const dataToSave = {
      ...conversationData,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
}

/**
 * Load a conversation for a specific contact
 * @param {string} contactName - The name of the contact
 * @returns {Object|null} - The loaded conversation data or null if not found
 */
export function loadConversation(contactName) {
  try {
    const key = getContactKey(contactName);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error("Error loading conversation:", error);
    return null;
  }
}

/**
 * Clear a conversation for a specific contact
 * @param {string} contactName - The name of the contact
 */
export function clearConversation(contactName) {
  try {
    const key = getContactKey(contactName);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing conversation:", error);
  }
}

/**
 * Get all saved conversation keys (for debugging or management)
 * @returns {Array} - Array of contact names that have saved conversations
 */
export function getAllSavedContacts() {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter((key) => key.startsWith(CHAT_STORAGE_KEY))
      .map((key) => key.replace(`${CHAT_STORAGE_KEY}-`, "").replace(/-/g, " "))
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1));
  } catch (error) {
    console.error("Error getting saved contacts:", error);
    return [];
  }
}

/**
 * Clear all conversations (for complete reset)
 */
export function clearAllConversations() {
  try {
    const keys = Object.keys(localStorage);
    keys
      .filter((key) => key.startsWith(CHAT_STORAGE_KEY))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error clearing all conversations:", error);
  }
}
