"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { QuantityCounter } from "./QuantityCounter";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Product;
  categoryName: string;
  // compact = always the vertical (image-on-top) layout, for narrow grid cells
  // (e.g. the 2-col recommendations grid in the cart drawer).
  compact?: boolean;
};

export function ProductCard({ product, categoryName, compact = false }: Props) {
  const cart = useCart();
  const qty = cart.getQuantity(product.id);

  const onAdd = () => {
    cart.addItem({
      productId: product.id,
      name: product.name,
      categoryName,
      packageInfo: product.package_info,
      price: product.price ?? null,
      imageUrl: product.image_url ?? null,
    });
    // fire-and-forget analytics
    fetch("/api/track-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    // Mobile: horizontal row (image left, text right, per RTL).
    // Desktop (lg+): vertical card (image on top) — flex-col-reverse flips the
    // DOM [text, image] so the image sits above the text.
    <article
      className={
        compact
          ? "bg-themeBg border-[0.8px] border-themeBorder rounded-card shadow-card overflow-hidden flex flex-col-reverse h-full transition duration-200 hover:shadow-lg"
          : "bg-themeBg border-[0.8px] border-themeBorder rounded-card shadow-card overflow-hidden flex min-h-32 h-full lg:flex-col-reverse lg:min-h-0 lg:transition lg:duration-200 lg:hover:-translate-y-1 lg:hover:shadow-lg"
      }
    >
      {/* Text side */}
      <div className="flex-1 p-3 flex flex-col items-end justify-between min-w-0">
        <div className="w-full min-w-0">
          {/* Title row: name first (rightmost in RTL), category label after it */}
          <div className="flex items-center justify-start gap-2">
            <h3 className="font-heb t-product-name text-themeText truncate text-right">
              {product.name}
            </h3>
            <span
              className={`inline-block ${
                categoryName === "חלבי" ? "bg-beige" : "bg-sand"
              } t-label text-themeText font-heb rounded-chip px-1.5 py-0.5 shrink-0`}
            >
              {categoryName}
            </span>
          </div>
          {product.description && (
            <p className="pt-1 font-heb t-description text-themeText2 line-clamp-2 text-right">
              {product.description}
            </p>
          )}
          {product.package_info && (
            <p className="pt-1 font-heb font-medium t-caption text-themeText2 truncate text-right">
              {product.package_info}
            </p>
          )}
          {product.price != null && (
            <p className="pt-1 font-heb t-price text-themeText text-right">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* Action row — button/counter fill the content column */}
        <div className="flex items-center w-full pt-2">
          {qty === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="flex w-full items-center justify-center min-h-11 px-4 bg-themeBtn text-themeBtnText font-heb font-semibold text-[13px] leading-4 rounded-pill transition hover:brightness-95 active:brightness-90 active:scale-95"
              aria-label={`הוסף לסל: ${product.name}`}
            >
              + הוסף לסל
            </button>
          ) : (
            <QuantityCounter
              value={qty}
              onDecrement={() => cart.decrement(product.id)}
              onIncrement={() => cart.increment(product.id)}
              label={`כמות: ${product.name}`}
            />
          )}
        </div>
      </div>

      {/* Image — left on mobile, top on desktop (always on top when compact) */}
      <div
        className={
          compact
            ? "relative shrink-0 w-full h-28"
            : "relative shrink-0 w-28 self-stretch lg:w-full lg:h-44"
        }
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes={compact ? "220px" : "(min-width: 1024px) 360px, 112px"}
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-sand/30 flex items-center justify-center text-themeText2 font-heb text-[10px]"
            role="img"
            aria-label="אין תמונה למוצר זה"
          >
            תמונה בקרוב
          </div>
        )}
      </div>
    </article>
  );
}
