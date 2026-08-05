"use client";

import { useEffect, useRef } from "react";
import { useCartUi } from "@/lib/cart-ui";
import { CartContents } from "./CartContents";

export function CartDrawer() {
  const { drawerOpen, closeDrawer } = useCartUi();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    // lock background scroll while the drawer is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // move focus into the panel for keyboard users
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!drawerOpen}
    >
      {/* Scrim — click outside to close */}
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel — slides in from the LEFT (the RTL end / cart-icon side) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="סל הקניות"
        dir="rtl"
        className={`absolute inset-y-0 left-0 w-full max-w-md bg-themeBg shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-3">
          <h2 className="font-heb t-heading text-themeText">סיכום הזמנה</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="סגירת הסל"
            className="w-11 h-11 inline-flex items-center justify-center rounded-full text-themeText transition hover:brightness-95 active:brightness-90"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Remount on each open so quantity controls reset to the collapsed
            badge, the form starts fresh, and the scroll position returns to the
            top (CartContents also scrolls itself to top on mount). */}
        <CartContents
          key={drawerOpen ? "open" : "closed"}
          idPrefix="cart-drawer"
          onNavigateAway={closeDrawer}
        />
      </div>
    </div>
  );
}
