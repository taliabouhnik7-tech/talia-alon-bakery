"use client";

type Props = {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  label?: string;
};

export function QuantityCounter({ value, onDecrement, onIncrement, label = "כמות" }: Props) {
  return (
    <div
      className="counter-pop flex w-full items-center justify-between bg-themeBtn rounded-full h-11"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label="הפחת כמות"
        className="w-11 h-11 flex items-center justify-center rounded-full text-themeText transition hover:brightness-95 active:brightness-90"
      >
        <span className="w-7 h-7 rounded-full bg-themeBg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <span
        aria-live="polite"
        className="flex-1 text-center font-heb font-bold text-[14px] leading-5 text-themeBtnText"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="הוסף כמות"
        className="w-11 h-11 flex items-center justify-center rounded-full text-themeText transition hover:brightness-95 active:brightness-90"
      >
        <span className="w-7 h-7 rounded-full bg-themeBg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
