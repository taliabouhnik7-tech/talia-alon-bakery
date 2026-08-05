"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Tracks which single AddControl (across the whole app — home cards, cart drawer,
 * recommendations) is currently expanded. Opening one control collapses any
 * other; an expanded control otherwise stays open indefinitely (no timer).
 */
type Ctx = {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
};

const AddControlExpansionContext = createContext<Ctx | null>(null);

export function AddControlExpansionProvider({ children }: { children: React.ReactNode }) {
  const [expandedId, setId] = useState<string | null>(null);
  const setExpandedId = useCallback((id: string | null) => setId(id), []);
  const value = useMemo(() => ({ expandedId, setExpandedId }), [expandedId, setExpandedId]);
  return (
    <AddControlExpansionContext.Provider value={value}>
      {children}
    </AddControlExpansionContext.Provider>
  );
}

export function useAddControlExpansion() {
  const ctx = useContext(AddControlExpansionContext);
  if (!ctx) {
    throw new Error("useAddControlExpansion must be used within AddControlExpansionProvider");
  }
  return ctx;
}
