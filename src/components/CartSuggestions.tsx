"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart";
import { kashrutLabel } from "@/lib/format";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

/**
 * "אולי תרצי להוסיף גם..." — a gentle up-sell inside the cart.
 *
 * PLACEHOLDER HEURISTIC (not real "frequently bought together" data yet):
 * suggests up to 2 available products that aren't already in the cart,
 * preferring a category the cart doesn't contain. Deterministic (by sort_order)
 * so it doesn't jump around as the cart changes.
 *
 * TODO: replace `pickSuggestions` with real pairing logic once there's order
 * data — e.g. co-occurrence from `orders.items` / `product_add_events`.
 */
function pickSuggestions(
  products: Product[],
  cartProductIds: Set<string>,
  cartCategoryIds: Set<string>
): Product[] {
  const notInCart = products.filter((p) => !cartProductIds.has(p.id));
  const differentCategory = notInCart.filter((p) => !cartCategoryIds.has(p.category_id));
  const pool = differentCategory.length > 0 ? differentCategory : notInCart;
  return pool.slice(0, 2);
}

export function CartSuggestions() {
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Map<string, { slug: string; name: string }>>(new Map());

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let active = true;
    (async () => {
      const [{ data: prods }, { data: categories }] = await Promise.all([
        supabase.from("products").select("*").eq("is_available", true).order("sort_order"),
        supabase.from("categories").select("id, slug, name"),
      ]);
      if (!active) return;
      setProducts((prods ?? []) as Product[]);
      setCats(
        new Map((categories ?? []).map((c) => [c.id, { slug: c.slug, name: c.name }]))
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  const byId = new Map(products.map((p) => [p.id, p]));
  const cartProductIds = new Set(items.map((i) => i.productId));
  const cartCategoryIds = new Set(
    items.map((i) => byId.get(i.productId)?.category_id).filter((v): v is string => !!v)
  );
  const suggestions = pickSuggestions(products, cartProductIds, cartCategoryIds);

  if (suggestions.length === 0) return null;

  return (
    <section aria-label="הצעות להוספה">
      <p className="font-heb font-semibold t-body text-themeText text-right mb-3">
        אולי תרצי להוסיף גם...
      </p>
      {/* Same ProductCard as the home page, arranged 2-up and in compact layout. */}
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((p) => {
          const cat = cats.get(p.category_id);
          return (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={kashrutLabel(cat?.slug, cat?.name ?? "")}
              compact
            />
          );
        })}
      </div>
    </section>
  );
}
