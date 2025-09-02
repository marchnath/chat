"use client";

import useProfileStore, { getSelectedChatLanguage } from "@/lib/store";

export default function LanguageDebug() {
  const {
    learningLanguage,
    _hasHydrated,
    nativeLanguage,
    setLearningLanguage,
  } = useProfileStore();

  const selectedChatLanguage = getSelectedChatLanguage();

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const testItalian = () => {
    setLearningLanguage("Italian");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        minWidth: "200px",
      }}
    >
      <div>Hydrated: {_hasHydrated ? "Yes" : "No"}</div>
      <div>Learning: {learningLanguage}</div>
      <div>Native: {nativeLanguage}</div>
      <div>Chat Language: {selectedChatLanguage}</div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={testItalian}
          style={{ marginRight: "5px", padding: "2px 5px" }}
        >
          Set Italian
        </button>
        <button onClick={clearStorage} style={{ padding: "2px 5px" }}>
          Clear Storage
        </button>
      </div>
    </div>
  );
}
