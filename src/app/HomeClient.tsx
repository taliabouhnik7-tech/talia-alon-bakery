"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LogoHeader } from "@/components/LogoHeader";
import { InfoStrip } from "@/components/InfoStrip";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { kashrutLabel } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type Props = {
  categories: Category[];
  products: Product[];
  bestsellerIds: string[];
  loadError?: boolean;
  headerImageUrl?: string | null;
  showInfoStrip?: boolean;
};

const BESTSELLER_SLUG = "bestseller";

export function HomeClient({
  categories,
  products,
  bestsellerIds,
  loadError = false,
  headerImageUrl = null,
  showInfoStrip = true,
}: Props) {
  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const catSlugById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.slug])),
    [categories]
  );

  const bestsellerProducts = useMemo(
    () => bestsellerIds.map((id) => productById.get(id)).filter((p): p is Product => !!p),
    [bestsellerIds, productById]
  );

  // One continuous list: bestseller section first, then each category.
  const sections = useMemo(() => {
    const list: { slug: string; name: string; products: Product[] }[] = [];
    if (bestsellerProducts.length > 0) {
      list.push({ slug: BESTSELLER_SLUG, name: "המוזמנים ביותר", products: bestsellerProducts });
    }
    for (const c of categories) {
      list.push({ slug: c.slug, name: c.name, products: products.filter((p) => p.category_id === c.id) });
    }
    return list;
  }, [categories, products, bestsellerProducts]);

  const tabs = useMemo(() => sections.map((s) => ({ slug: s.slug, name: s.name })), [sections]);
  const [activeSlug, setActiveSlug] = useState<string>(sections[0]?.slug ?? "");
  // While a tab-click smooth-scroll is in flight, pause the spy so its per-frame
  // state updates don't interrupt the native smooth scroll.
  const spyPaused = useRef(false);

  // Scroll-spy: reflect whichever section sits under the sticky header/tab bar.
  useEffect(() => {
    if (sections.length === 0) return;
    const onScroll = () => {
      if (spyPaused.current) return;
      const nav = document.querySelector('nav[aria-label="קטגוריות"]');
      const offset = (nav?.getBoundingClientRect().bottom ?? 112) + 8;
      let current = sections[0].slug;
      for (const s of sections) {
        const el = document.getElementById(`cat-${s.slug}`);
        if (el && el.getBoundingClientRect().top <= offset) current = s.slug;
      }
      // The last section is often too short to ever reach the sticky bar, so it
      // would never activate. When we're at (or near) the bottom, force it active.
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (nearBottom) current = sections[sections.length - 1].slug;
      setActiveSlug(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // Clicking a tab scrolls (smoothly) to that section rather than filtering.
  // The offset accounts for the sticky header + sticky tab bar. The spy is
  // paused briefly so its per-frame state updates don't fight the scroll.
  const onSelect = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (!el) return;
    const nav = document.querySelector('nav[aria-label="קטגוריות"]');
    const navH = nav?.getBoundingClientRect().height ?? 60;
    const offset = 52 + navH + 8; // sticky header + sticky tab bar + small gap
    const targetY = Math.max(0, window.scrollY + el.getBoundingClientRect().top - offset);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    spyPaused.current = true;
    setActiveSlug(slug);
    window.scrollTo({ top: targetY, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => {
      spyPaused.current = false;
    }, 800);
  };

  if (categories.length === 0) {
    return (
      <>
        <TopBar />
        <LogoHeader imageUrl={headerImageUrl} />
        {showInfoStrip && <InfoStrip />}
        <main className="bg-themeBg p-6 min-h-[40vh] flex items-center justify-center">
          <p className="text-center text-themeText2 font-heb t-body max-w-xs">
            {loadError
              ? "התפריט אינו זמין כרגע. אנא נסו שוב מאוחר יותר."
              : "אין כרגע מוצרים להצגה."}
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <LogoHeader imageUrl={headerImageUrl} />
      {showInfoStrip && <InfoStrip />}
      <CategoryTabs tabs={tabs} activeSlug={activeSlug} onSelect={onSelect} />

      <main className="bg-themeBg" aria-live="polite">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-8 pb-10">
          {sections.map((s) => (
            <section
              key={s.slug}
              id={`cat-${s.slug}`}
              aria-labelledby={`h-${s.slug}`}
              className="scroll-mt-[116px] pt-6 lg:pt-10"
            >
              <h2
                id={`h-${s.slug}`}
                className="font-heb font-bold text-themeText text-right text-[18px] lg:text-[24px] mb-3 lg:mb-5"
              >
                {s.name}
              </h2>
              {s.products.length === 0 ? (
                <p className="text-themeText2 font-heb t-body">אין כרגע פריטים בקטגוריה זו.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-6">
                  {s.products.map((p) => (
                    <ProductCard
                      key={`${s.slug}-${p.id}`}
                      product={p}
                      categoryName={kashrutLabel(catSlugById.get(p.category_id), "")}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
