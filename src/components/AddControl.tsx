"use client";

import { useEffect, useId } from "react";
import { useAddControlExpansion } from "@/lib/add-control-ui";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 7h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  quantity: number;
  label: string; // product name, for aria labels
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  // Which way the expanded stepper overlays. "left" (default) suits an image
  // corner (grows into the image); "right" suits a left-anchored spot (cart row).
  expand?: "left" | "right";
  // Cart/order-summary uses a stroke-only (outline) count circle instead of the
  // filled pill used on the home page — same color, just as a border.
  outlineCount?: boolean;
};

/**
 * The add-to-cart control.
 *  - qty 0: a cream "+" circle (idle).
 *  - tap: expands into a [-] [count] [+] stepper.
 *  - qty > 0, resting: a single teal count circle.
 *
 * Idle circle, the expanded pill, and the individual +/- circles all share the
 * cream tone (brown icons/text) for one consistent idle→expanded look; only the
 * resting count circle is teal, to read as a distinct "in your cart" state.
 *
 * The control keeps a fixed 44x44 footprint in normal flow (a11y tap target);
 * the expanded stepper is an ABSOLUTE overlay, so opening it only extends
 * horizontally and never changes the row's height. Expansion is app-wide
 * single-open: opening one control collapses any other (see add-control-ui).
 */
export function AddControl({
  quantity,
  label,
  onAdd,
  onIncrement,
  onDecrement,
  expand = "left",
  outlineCount = false,
}: Props) {
  const instanceId = useId();
  const { expandedId, setExpandedId } = useAddControlExpansion();
  const expanded = expandedId === instanceId && quantity > 0;

  // If this was the open control but its item is gone, release the shared slot.
  useEffect(() => {
    if (quantity === 0 && expandedId === instanceId) setExpandedId(null);
  }, [quantity, expandedId, instanceId, setExpandedId]);

  const handleAdd = () => {
    onAdd();
    setExpandedId(instanceId);
  };
  const handleExpand = () => setExpandedId(instanceId);

  return (
    <div className="relative w-11 h-11">
      {/* Idle "+" (never a "0") */}
      {!expanded && quantity === 0 && (
        <button
          type="button"
          onClick={handleAdd}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={`הוסף לסל: ${label}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="counter-pop w-9 h-9 rounded-full bg-addIdleBg text-addIdleIcon shadow-md flex items-center justify-center">
            <PlusIcon />
          </span>
        </button>
      )}

      {/* Resting count circle (teal) */}
      {!expanded && quantity > 0 && (
        <button
          type="button"
          onClick={handleExpand}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={`${label}: ${quantity} בסל. לחצי לשינוי הכמות`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <span
            className={`counter-pop w-9 h-9 rounded-full flex items-center justify-center font-heb font-bold text-[14px] leading-none transition ${
              outlineCount
                ? // Cart-only: outline at rest; on hover it fills with the SAME
                  // stroke color. Border = countStroke, number = countText.
                  "border-2 border-countStroke text-countText bg-transparent group-hover:bg-countStroke group-hover:border-countStroke"
                : "bg-addCountBg text-addCountText shadow-md"
            }`}
          >
            {quantity}
          </span>
        </button>
      )}

      {/* Expanded stepper — absolute overlay, vertically centred, pinned to one
          edge so it only grows sideways (no row-height change). All-cream. */}
      {expanded && (
        <div
          dir="rtl"
          role="group"
          aria-label={`כמות: ${label}`}
          // Width-slide open (see .stepper-open). overflow-hidden reveals the
          // controls as the pill widens; fixed width so the slide has a stable
          // end point. Vertically centered via my-auto (no transform → no jump).
          // "+" is the anchored-edge child so at the start (44px) it reads as the
          // idle "+" circle, then the rest unfurls.
          className={`stepper-open absolute inset-y-0 my-auto z-20 flex items-center gap-1 h-11 w-[100px] rounded-full bg-addIdleBg shadow-md px-1 overflow-hidden ${
            expand === "left" ? "right-0" : "left-0"
          }`}
        >
          <button
            type="button"
            onClick={onIncrement}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="הוסף כמות"
            className="w-8 h-8 rounded-full bg-addStepBtn text-addIdleIcon flex items-center justify-center shrink-0 transition hover:brightness-95 active:brightness-90"
          >
            <PlusIcon />
          </button>
          <span className="min-w-5 text-center font-heb font-bold text-[14px] leading-none text-addIdleIcon">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onDecrement}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="הפחת כמות"
            className="w-8 h-8 rounded-full bg-addStepBtn text-addIdleIcon flex items-center justify-center shrink-0 transition hover:brightness-95 active:brightness-90"
          >
            <MinusIcon />
          </button>
        </div>
      )}
    </div>
  );
}
