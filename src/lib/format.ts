// The chip on a product shows its kashrut, not the browsing category.
// Challot are parve, so the "חלות" category is labelled פרווה. Only dairy is חלבי.
const KASHRUT_LABEL: Record<string, string> = {
  parve: "פרווה",
  challah: "פרווה",
  dairy: "חלבי",
};

export function kashrutLabel(slug: string | undefined, fallback: string): string {
  if (!slug) return fallback;
  return KASHRUT_LABEL[slug] ?? fallback;
}

export function formatPrice(v: number | null | undefined): string {
  if (v == null) return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return `${n}₪`;
}

// Same value, but with the ₪ symbol BEFORE the number (e.g. "₪40"). Used in the
// cart drawer/page; render inside a `dir="ltr"` element so the order is stable.
export function formatPriceShekelFirst(v: number | null | undefined): string {
  if (v == null) return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return `₪${n}`;
}
