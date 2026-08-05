import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";
import { fetchSiteSettings } from "@/lib/site-settings-server";
import { HomeClient } from "./HomeClient";

export const revalidate = 60;

// How many real completed orders we need before the "המוזמנים ביותר" section is
// computed from actual order data instead of the random placeholder fallback.
// Adjust this single number to taste.
const BESTSELLER_MIN_ORDERS = 5;
// How many products to show in the bestseller section (kept small, 3–4).
const BESTSELLER_COUNT = 4;
// Preferred mix across categories so one category doesn't dominate the section.
// Falls back gracefully (fills from the given order) when a category is short.
const BESTSELLER_MIX: { slug: string; count: number }[] = [
  { slug: "challah", count: 1 },
  { slug: "parve", count: 2 },
  { slug: "dairy", count: 1 },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick a category-diverse set from an already-prioritized list of products
 * (`ordered` = ranked by popularity, or shuffled for the random fallback).
 * First honors the per-category quotas in BESTSELLER_MIX (respecting order),
 * then tops up to `total` from whatever's left.
 */
function mixByCategory(
  ordered: Product[],
  catSlugById: Map<string, string>,
  total: number
): string[] {
  const chosen: string[] = [];
  const used = new Set<string>();
  for (const { slug, count } of BESTSELLER_MIX) {
    let taken = 0;
    for (const p of ordered) {
      if (taken >= count) break;
      if (used.has(p.id)) continue;
      if (catSlugById.get(p.category_id) === slug) {
        chosen.push(p.id);
        used.add(p.id);
        taken++;
      }
    }
  }
  for (const p of ordered) {
    if (chosen.length >= total) break;
    if (!used.has(p.id)) {
      chosen.push(p.id);
      used.add(p.id);
    }
  }
  return chosen.slice(0, total);
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const [
    { data: categories, error: catError },
    { data: products, error: prodError },
    { data: orders },
    siteSettings,
  ] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").eq("is_available", true).order("sort_order"),
    // Order items power the "most ordered" ranking.
    supabase.from("orders").select("items"),
    fetchSiteSettings(),
  ]);

  const availableProducts = (products ?? []) as Product[];
  const availableIds = new Set(availableProducts.map((p) => p.id));
  const catSlugById = new Map((categories ?? []).map((c) => [c.id, c.slug]));
  const orderCount = orders?.length ?? 0;

  // ---- Bestseller selection (category-diverse, capped at BESTSELLER_COUNT) ----
  let ordered: Product[];
  if (orderCount >= BESTSELLER_MIN_ORDERS) {
    // REAL DATA: rank products by total quantity ordered across all orders,
    // then append the rest (so the mix can still be filled if a category is short).
    const qtyByProduct = new Map<string, number>();
    for (const o of orders ?? []) {
      const items = (o as { items?: Array<{ product_id?: string; quantity?: number }> }).items ?? [];
      for (const it of items) {
        if (!it.product_id || !availableIds.has(it.product_id)) continue;
        qtyByProduct.set(it.product_id, (qtyByProduct.get(it.product_id) ?? 0) + (Number(it.quantity) || 0));
      }
    }
    const rankedIds = [...qtyByProduct.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
    const byId = new Map(availableProducts.map((p) => [p.id, p]));
    ordered = [
      ...rankedIds.map((id) => byId.get(id)).filter((p): p is Product => !!p),
      ...availableProducts.filter((p) => !qtyByProduct.has(p.id)),
    ];
  } else {
    // ⚠️ TEMPORARY RANDOM FALLBACK — not real data.
    // There aren't enough real orders yet (< BESTSELLER_MIN_ORDERS), so we start
    // from a shuffled pool. Category mixing (mixByCategory) is still applied so the
    // section looks sensible. This automatically switches to the real order-frequency
    // ranking above once enough orders exist.
    ordered = shuffle(availableProducts);
  }
  // Same category-diversity logic for both the real and random paths.
  const bestsellerIds = mixByCategory(ordered, catSlugById, BESTSELLER_COUNT);

  return (
    <HomeClient
      categories={(categories ?? []) as Category[]}
      products={availableProducts}
      bestsellerIds={bestsellerIds}
      loadError={!!catError || !!prodError}
      headerImageUrl={siteSettings.headerImageUrl}
      showInfoStrip={siteSettings.showInfoStrip}
    />
  );
}
