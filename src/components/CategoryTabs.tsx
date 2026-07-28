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
      className="sticky z-20 bg-themeBtn py-2 lg:bg-themeBg lg:border-b lg:border-themeBorder"
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
                "shrink-0 whitespace-nowrap font-heb font-semibold rounded-pill transition text-themeText",
                "text-[14px] px-4 py-2 lg:text-[16px] lg:px-5",
                active
                  ? // mobile: cream pill on the blue bar · desktop: filled blue pill (add-to-cart style).
                    // matching border keeps the box the same size as the outline (inactive) pills.
                    "bg-themeBg lg:bg-themeBtn lg:text-themeBtnText lg:border lg:border-themeBtn"
                  : // mobile: flat · desktop: outline pill with hover
                    "hover:brightness-95 lg:bg-transparent lg:border lg:border-themeBorder lg:hover:brightness-100 lg:hover:bg-themeBg",
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
