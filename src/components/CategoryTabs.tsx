"use client";

type Tab = { slug: string; name: string };

type Props = {
  tabs: Tab[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function CategoryTabs({ tabs, activeSlug, onSelect }: Props) {
  return (
    <nav
      className="sticky z-20 bg-themeBtn py-2"
      style={{ top: 52 }}
      aria-label="קטגוריות"
    >
      <div
        role="tablist"
        className="no-scrollbar mx-auto w-full max-w-6xl px-4 lg:px-8 flex gap-2 overflow-x-auto lg:overflow-visible lg:justify-start lg:gap-3"
      >
        {tabs.map((t) => {
          const active = t.slug === activeSlug;
          return (
            <button
              key={t.slug}
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(t.slug)}
              className={[
                "shrink-0 whitespace-nowrap font-heb font-semibold rounded-pill transition text-controlText",
                "text-[14px] px-4 py-2 lg:text-[16px] lg:px-5",
                // Teal bar with a themeable pill for the active tab, transparent
                // (hover-highlighted) for the rest — same treatment on all breakpoints.
                active ? "bg-accentPill" : "hover:bg-themeBg/40",
              ].join(" ")}
            >
              {t.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
