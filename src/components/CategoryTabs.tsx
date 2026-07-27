"use client";

import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function CategoryTabs({ categories, activeSlug, onSelect }: Props) {
  return (
    <nav
      className="sticky z-20 bg-themeBtn py-2"
      style={{ top: 52 }}
      aria-label="קטגוריות"
    >
      <div
        className="mx-auto w-full max-w-6xl px-4 grid lg:max-w-md"
        style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}
        role="tablist"
      >
        {categories.map((c) => {
          const active = c.slug === activeSlug;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(c.slug)}
              className={`
                h-11 flex items-center justify-center font-heb font-semibold text-[14px] leading-5
                transition text-themeText
                ${active ? "bg-themeBg rounded-pill" : "bg-themeBtn border-b-[1.6px] border-transparent hover:brightness-95 active:brightness-90"}
              `}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
