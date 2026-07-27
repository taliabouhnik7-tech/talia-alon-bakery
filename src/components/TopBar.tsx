"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCartUi } from "@/lib/cart-ui";

export function TopBar() {
  const { totalCount } = useCart();
  const { openDrawer } = useCartUi();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(totalCount);

  // Pulse the cart icon when an item is added.
  useEffect(() => {
    if (totalCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 420);
      prevCount.current = totalCount;
      return () => clearTimeout(t);
    }
    prevCount.current = totalCount;
  }, [totalCount]);

  // On desktop, open the slide-in drawer instead of navigating to /cart.
  const onCartClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      e.preventDefault();
      openDrawer();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-themeBtn border-b border-themeBorder h-[52px]">
      <div className="mx-auto w-full max-w-6xl h-full flex items-center justify-between px-4">
        {/* Logo on the RIGHT (RTL start) */}
        <Link
          href="/"
          className="font-logo text-[16px] leading-none text-themeText transition hover:opacity-80"
          aria-label="חזרה לדף הבית"
        >
          טליה אלון
        </Link>

        {/* Cart on the LEFT (RTL end) — 44×44 tap target */}
        <Link
          href="/cart"
          onClick={onCartClick}
          aria-label={`עגלת קניות, ${totalCount} פריטים`}
          className="relative inline-flex items-center justify-center w-11 h-11 rounded-chip transition hover:brightness-95 active:brightness-90"
        >
          <span className={`relative ${bump ? "cart-bump" : ""}`}>
            <img src="/icons/cart.svg" alt="" aria-hidden="true" width={18} height={18} className="block" />
            {totalCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-themeBg text-themeText text-[10px] leading-none font-bold flex items-center justify-center font-heb drop-shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
              >
                {totalCount}
              </span>
            )}
          </span>
        </Link>
      </div>
    </header>
  );
}
