// Shared trash/delete icon — a simple, rounded can: outer can shape + lid +
// handle, with no internal vertical lines. Stroke-based; inherits currentColor.
export function TrashIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 7h14M10 7V5.6A1.6 1.6 0 0 1 11.6 4h.8A1.6 1.6 0 0 1 14 5.6V7M7 7h10l-.7 10.6a2.4 2.4 0 0 1-2.4 2.2H10.1a2.4 2.4 0 0 1-2.4-2.2L7 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
