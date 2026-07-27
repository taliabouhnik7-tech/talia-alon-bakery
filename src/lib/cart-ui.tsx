"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type CartUiValue = {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartUiContext = createContext<CartUiValue | null>(null);

export function CartUiProvider({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartUiValue>(
    () => ({ drawerOpen, openDrawer, closeDrawer }),
    [drawerOpen, openDrawer, closeDrawer]
  );

  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
}

export function useCartUi() {
  const ctx = useContext(CartUiContext);
  if (!ctx) throw new Error("useCartUi must be used within CartUiProvider");
  return ctx;
}
