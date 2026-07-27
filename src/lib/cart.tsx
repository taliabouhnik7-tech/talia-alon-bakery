"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "./types";

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  getQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "talia-alon-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.productId !== productId);
      return prev.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      );
    });
  }, []);

  const increment = useCallback(
    (productId: string) => {
      setItems((prev) =>
        prev.map((p) =>
          p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    },
    []
  );

  const decrement = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((p) => p.productId === productId);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter((p) => p.productId !== productId);
      return prev.map((p) =>
        p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
      );
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const getQuantity = useCallback(
    (productId: string) => items.find((p) => p.productId === productId)?.quantity ?? 0,
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const total = useMemo(
    () => items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount,
      total,
      addItem,
      setQuantity,
      increment,
      decrement,
      remove,
      clear,
      getQuantity,
    }),
    [items, totalCount, total, addItem, setQuantity, increment, decrement, remove, clear, getQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
