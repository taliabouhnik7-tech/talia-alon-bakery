"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LogoHeader } from "@/components/LogoHeader";
import { InfoStrip } from "@/components/InfoStrip";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { kashrutLabel } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type Props = {
  categories: Category[];
  products: Product[];
  loadError?: boolean;
};

export function HomeClient({ categories, products, loadError = false }: Props) {
  const defaultSlug = categories[0]?.slug ?? "parve";
  const [activeSlug, setActiveSlug] = useState<string>(defaultSlug);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug),
    [categories, activeSlug]
  );

  const visibleProducts = useMemo(
    () => products.filter((p) => p.category_id === activeCategory?.id),
    [products, activeCategory]
  );

  // No categories at all → the menu couldn't load or is empty.
  if (categories.length === 0) {
    return (
      <>
        <TopBar />
        <LogoHeader />
        <InfoStrip />
        <main className="bg-themeBg p-6 min-h-[40vh] flex items-center justify-center">
          <p className="text-center text-themeText2 font-heb t-body max-w-xs">
            {loadError
              ? "התפריט אינו זמין כרגע. אנא נסו שוב מאוחר יותר."
              : "אין כרגע מוצרים להצגה."}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <LogoHeader />
      <InfoStrip />
      <CategoryTabs
        categories={categories}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
      />

      <main className="bg-themeBg" aria-live="polite">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-6 py-3 lg:py-6">
          {visibleProducts.length === 0 ? (
            <p className="text-center text-themeText2 font-heb t-body py-8">
              אין כרגע פריטים בקטגוריה זו.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-4">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={kashrutLabel(activeCategory?.slug, activeCategory?.name ?? "")}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
