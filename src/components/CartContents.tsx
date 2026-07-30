"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { TrashIcon } from "./TrashIcon";
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
  const [error, setError] = useState<string | null>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "972586666623";
  const empty = items.length === 0;
  const nameId = `${idPrefix}-name`;
  const notesId = `${idPrefix}-notes`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNameError(null);

    if (!name.trim()) {
      setNameError("נא להזין שם");
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
      <div className="flex flex-col items-center justify-center text-center gap-4 py-12 px-4">
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
    <div className="flex flex-col gap-4">
      <p className="font-heb t-body text-themeText2 text-right">
        ההזמנה נשלחת ישירות בוואטסאפ לטליה
      </p>

      {/* Items — full-height image + two lines (name/trash · price/stepper) */}
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.productId} className="flex items-stretch gap-3">
            <div className="relative shrink-0 w-16 self-stretch overflow-hidden rounded-lg bg-sand/30">
              {it.imageUrl ? (
                <Image src={it.imageUrl} alt={it.name} fill sizes="64px" className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] text-themeText2 font-heb">
                  תמונה
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
              {/* Top line: name (right) · trash (left) */}
              <div className="flex items-center justify-between gap-2">
                <p className="font-heb t-body text-themeText truncate min-w-0">
                  {it.name} <span className="text-themeText2">({it.categoryName})</span>
                </p>
                <button
                  type="button"
                  onClick={() => remove(it.productId)}
                  aria-label={`הסרת ${it.name} מהעגלה`}
                  className="shrink-0 w-8 h-8 inline-flex items-center justify-center text-themeText2 transition-colors hover:text-danger"
                >
                  <TrashIcon size={18} />
                </button>
              </div>

              {/* Bottom line: price (right) · stepper (left) */}
              <div className="flex items-center justify-between gap-2">
                <p className="font-heb t-body font-bold text-themeText">
                  {it.price != null ? formatPrice(it.price * it.quantity) : "—"}
                </p>
                <div
                  className="inline-flex items-center rounded-full bg-themeBtn h-8 shrink-0"
                  role="group"
                  aria-label={`כמות: ${it.name}`}
                >
                  <button
                    type="button"
                    onClick={() => decrement(it.productId)}
                    aria-label="הפחתת כמות"
                    className="w-8 h-8 flex items-center justify-center text-themeText transition hover:brightness-95 active:brightness-90"
                  >
                    <span className="w-5 h-5 rounded-full bg-themeBg flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <span
                    aria-live="polite"
                    className="w-6 text-center font-heb font-bold text-[13px] leading-none text-themeBtnText"
                  >
                    {it.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment(it.productId)}
                    aria-label="הוספת כמות"
                    className="w-8 h-8 flex items-center justify-center text-themeText transition hover:brightness-95 active:brightness-90"
                  >
                    <span className="w-5 h-5 rounded-full bg-themeBg flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <CartSuggestions />

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
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
            className="w-full h-12 px-4 bg-themeBg border rounded-input font-heb t-body text-right text-themeText placeholder:text-themeText2 border-themeBorder aria-[invalid=true]:border-danger"
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

        {/* Sticky footer: submit button with the total shown inside it (left). */}
        <div className="sticky bottom-0 -mx-4 mt-1 border-t border-borderDivider bg-themeBg px-4 pt-3 pb-4">
          <button
            type="submit"
            disabled={submitting || empty}
            className="w-full min-h-11 flex items-center justify-between gap-3 px-6 py-4 bg-themeBtn text-themeBtnText font-heb font-semibold text-[16px] rounded-wa transition hover:brightness-95 active:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            <span>{submitting ? "שולחת..." : "שליחת ההזמנה בוואטסאפ"}</span>
            <span>{formatPrice(total)}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
