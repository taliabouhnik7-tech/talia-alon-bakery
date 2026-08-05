"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatPrice, formatPriceShekelFirst } from "@/lib/format";
import { TrashIcon } from "./TrashIcon";
import { AddControl } from "./AddControl";
import { CartSuggestions } from "./CartSuggestions";

function buildWhatsAppMessage(opts: {
  customerName: string;
  items: ReturnType<typeof useCart>["items"];
  notes: string;
  total: number;
}) {
  const { customerName, items, notes, total } = opts;
  const lines: string[] = [];
  lines.push("שלום טליה, אשמח להזמין:");
  lines.push("");
  for (const it of items) {
    const price = it.price != null ? ` — ${formatPrice(it.price * it.quantity)}` : "";
    const pkg = it.packageInfo ? ` — ${it.packageInfo}` : "";
    lines.push(`• ${it.name} (${it.categoryName})${pkg} × ${it.quantity}${price}`);
  }
  lines.push("");
  lines.push(`סה״כ: ${formatPrice(total)}`);
  lines.push("");
  lines.push(`שם: ${customerName}`);
  if (notes.trim()) {
    lines.push(`הערות: ${notes.trim()}`);
  }
  return lines.join("\n");
}

/**
 * The order-summary + form. Shared by the /cart page and the desktop drawer.
 * `idPrefix` keeps input ids/labels unique when both instances mount.
 * `onNavigateAway` lets the drawer close itself right before leaving to WhatsApp.
 */
export function CartContents({
  idPrefix = "cart",
  onNavigateAway,
}: {
  idPrefix?: string;
  onNavigateAway?: () => void;
}) {
  const { items, total, clear, increment, decrement, remove } = useCart();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameFlash, setNameFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsUlRef = useRef<HTMLUListElement>(null);
  const prevUlHeight = useRef<number | null>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "972586666623";
  const empty = items.length === 0;
  const itemCount = items.length;

  // Always start scrolled to the top. In the drawer this instance is remounted
  // on every open (see CartDrawer), so this also guarantees a top position each
  // time the drawer is reopened, regardless of where it was left.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  // Scroll anchoring: adding an item grows the item list, which sits ABOVE the
  // recommendations. If the user is looking at the recommendations, that growth
  // would push everything down. Compensate scrollTop by exactly how much the
  // item LIST grew (not the whole content — so a card morphing into a stepper
  // inside the viewport doesn't cause an over-scroll).
  const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
  useIsoLayoutEffect(() => {
    const s = scrollRef.current;
    const ul = itemsUlRef.current;
    if (s && ul) {
      // Compensate for growth (add) AND shrink (decrement-to-zero / remove) so
      // the recommendations the user is looking at never jump in either direction.
      // No scrollTop>0 guard: even when the recs are visible with little/no scroll,
      // growing the list above them would push them down — so always compensate
      // (clamped at 0). Runs in a layout effect, i.e. before paint, so no flash.
      if (prevUlHeight.current != null) {
        const delta = ul.offsetHeight - prevUlHeight.current;
        if (delta !== 0) s.scrollTop = Math.max(0, s.scrollTop + delta);
      }
      prevUlHeight.current = ul.offsetHeight;
    }
  }, [itemCount]);

  const nameId = `${idPrefix}-name`;
  const notesId = `${idPrefix}-notes`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNameError(null);

    if (!name.trim()) {
      setNameError("נא להזין שם");
      setNameFlash(false);
      // Defer (via setTimeout so it runs after the error text renders and grows
      // the content height) then scroll all the way to the very bottom of the
      // summary — past the name and notes fields — so the customer sees the
      // fields to fill in. The name field is focused + pulsed so the missing
      // detail stays obvious.
      window.setTimeout(() => {
        const scroller = scrollRef.current;
        if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
        const el = document.getElementById(nameId) as HTMLInputElement | null;
        el?.focus({ preventScroll: true });
        setNameFlash(true);
      }, 0);
      window.setTimeout(() => setNameFlash(false), 2400);
      return;
    }
    if (empty) {
      setError("הסל ריק");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setError("אין חיבור לאינטרנט. בדקי את החיבור ונסי שוב.");
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          notes: notes.trim() || null,
          items: items.map((i) => ({
            product_id: i.productId,
            name: i.name,
            category: i.categoryName,
            package_info: i.packageInfo,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
        }),
      }).catch(() => null);

      const message = buildWhatsAppMessage({ customerName: name.trim(), items, notes, total });
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      clear();
      onNavigateAway?.();
      window.location.href = url;
    } catch {
      setError("אירעה שגיאה. נסי שוב.");
      setSubmitting(false);
    }
  };

  // Empty cart: a warm empty-state replaces the whole summary (no bare form).
  if (empty) {
    return (
      <div className="flex flex-1 min-h-0 flex-col items-center justify-center text-center gap-4 py-12 px-4">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-themeText2/70"
          aria-hidden="true"
        >
          <path d="M4.5 8.5h15l-1.1 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4.5 8.5z" />
          <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
          <path d="M9.5 12v3.5M14.5 12v3.5" />
        </svg>
        <p className="font-heb t-body text-themeText max-w-[16rem]">
          העגלה שלך ריקה — בואי נמלא אותה במשהו טעים 🍪
        </p>
        <Link
          href="/"
          className="font-heb font-semibold t-body text-themeText underline underline-offset-4 hover:text-themeText2"
        >
          לתפריט המאפים
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-1 min-h-0 flex-col" onSubmit={onSubmit} noValidate>
      <div
        ref={scrollRef}
        className="drawer-scroll flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-5"
      >
        <p className="font-heb t-body text-themeText2 text-right">
          ההזמנה נשלחת ישירות בוואטסאפ לטליה
        </p>

        {/* Items — one calm unit per row. Clear hierarchy: PRICE is the focal
            point; name is secondary; badge / trash / quantity are quiet details. */}
        <ul ref={itemsUlRef} className="flex flex-col gap-6">
          {items.map((it) => (
            <li key={it.productId} className="flex items-stretch gap-3 py-1">
              {/* Image (right in RTL) */}
              <div className="relative shrink-0 w-16 self-stretch overflow-hidden rounded-lg bg-sand/30">
                {it.imageUrl ? (
                  <Image src={it.imageUrl} alt={it.name} fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] text-themeText2 font-heb">
                    תמונה
                  </span>
                )}
              </div>

              {/* Text + price (middle) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="font-heb t-body font-medium text-themeText2 truncate min-w-0 text-right">
                      {it.name}
                    </h3>
                    <span
                      className={`inline-block ${
                        it.categoryName === "חלבי" ? "bg-badgeDairy" : "bg-badgeParve"
                      } t-label font-normal text-themeText font-heb rounded-chip px-1.5 py-0 shrink-0 opacity-80`}
                    >
                      {it.categoryName}
                    </span>
                  </div>
                  {it.packageInfo && (
                    <p className="mt-0.5 font-heb t-caption text-themeText2 opacity-80 truncate text-right">
                      {it.packageInfo}
                    </p>
                  )}
                </div>

                {/* PRICE — the row's focal point */}
                <p dir="ltr" className="font-heb font-bold text-[21px] leading-none text-themeText text-right">
                  {it.price != null ? formatPriceShekelFirst(it.price * it.quantity) : "—"}
                </p>
              </div>

              {/* Controls — far-left group (LAST child = flush to the drawer's
                  left edge in RTL). Count circle and trash sit side by side,
                  vertically centred on the same line (trash is the last child →
                  physical far-left). */}
              <div className="shrink-0 self-center flex items-center gap-1">
                {/* Same control as the home cards (qty ≥ 1 → rests as the count
                    circle; outline style here). Expands rightward so it never
                    overflows the left edge. */}
                <AddControl
                  quantity={it.quantity}
                  label={it.name}
                  onAdd={() => {}}
                  onIncrement={() => increment(it.productId)}
                  onDecrement={() => decrement(it.productId)}
                  expand="right"
                  outlineCount
                />
                <button
                  type="button"
                  onClick={() => remove(it.productId)}
                  aria-label={`הסרת ${it.name} מהעגלה`}
                  className="shrink-0 w-6 h-6 inline-flex items-center justify-center text-themeText2 opacity-70 transition hover:opacity-100 hover:text-danger"
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <CartSuggestions />

        <div className="flex flex-col gap-2">
          <label htmlFor={nameId} className="font-heb font-medium t-body text-themeText2 text-right">
            *שם
          </label>
          <input
            id={nameId}
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="איך קוראים לך?"
            className={`w-full h-12 px-4 bg-themeBg border rounded-input font-heb t-body text-right text-themeText placeholder:text-themeText2 border-themeBorder aria-[invalid=true]:border-danger ${
              nameFlash ? "name-flash" : ""
            }`}
            aria-required="true"
            aria-invalid={!!nameError}
            aria-describedby={nameError ? `${nameId}-error` : undefined}
          />
          {nameError && (
            <p id={`${nameId}-error`} role="alert" className="font-heb t-caption text-danger text-right">
              {nameError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={notesId} className="font-heb font-medium t-body text-themeText2 text-right">
            הערות להזמנה (לא חובה)
          </label>
          <textarea
            id={notesId}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="אלרגיות, בקשות מיוחדות..."
            className="w-full h-20 px-4 py-3 bg-themeBg border border-themeBorder rounded-input font-heb t-body text-right text-themeText placeholder:text-themeText2 resize-none"
          />
        </div>

        {error && (
          <p role="alert" className="font-heb t-body text-danger text-right">
            {error}
          </p>
        )}
      </div>

      {/* Footer: always pinned to the bottom (real flex child, not sticky, so it
          floats from first render). Total shown inside the button, on the left. */}
      <div className="shrink-0 border-t border-borderDivider bg-themeBg px-4 pt-3 pb-4">
        <button
          type="submit"
          disabled={submitting || empty}
          className="w-full min-h-11 flex items-center justify-between gap-3 px-6 py-4 bg-themeBtn text-themeBtnText font-heb font-semibold text-[16px] rounded-wa transition hover:brightness-95 active:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          <span>{submitting ? "שולחת..." : "שליחת ההזמנה בוואטסאפ"}</span>
          <span dir="ltr">{formatPriceShekelFirst(total)}</span>
        </button>
      </div>
    </form>
  );
}
