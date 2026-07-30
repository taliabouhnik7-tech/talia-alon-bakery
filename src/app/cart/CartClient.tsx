"use client";

import Link from "next/link";
import { CartContents } from "@/components/CartContents";

function BackButton() {
  return (
    <Link
      href="/"
      aria-label="חזרה לתפריט"
      className="inline-flex items-center justify-start self-start w-11 h-11 rounded-full text-themeText2 transition hover:text-themeText active:brightness-90"
    >
      <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
        {/* RTL back = arrow points right, cropped flush to the right edge */}
        <path
          d="M3 12h16M12 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </Link>
  );
}

export function CartClient() {
  return (
    <main className="bg-themeBg min-h-[100dvh] flex flex-col">
      <div className="mx-auto w-full max-w-lg flex flex-col gap-4 px-4 pt-8 pb-6">
        <BackButton />
        <h1 className="font-heb t-heading text-themeText text-right">סיכום הזמנה</h1>
        <CartContents idPrefix="cart-page" />
      </div>
    </main>
  );
}
