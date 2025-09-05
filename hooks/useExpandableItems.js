import { useState, useCallback } from "react";

export function useExpandableItems() {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpansion = useCallback((itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const isExpanded = useCallback(
    (itemId) => {
      return expandedItems.has(itemId);
    },
    [expandedItems]
  );

  const clearExpanded = useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  return {
    expandedItems,
    toggleExpansion,
    isExpanded,
    clearExpanded,
  };
}
