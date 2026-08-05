// ============================================================
// Theme tokens — single source of truth for the live theme editor.
// Each token maps a DB key (theme_settings.key) to a CSS custom
// property that the site reads at runtime. Shared by:
//   - the runtime injector (src/lib/theme-server.ts + ThemeStyle)
//   - the admin editor (/admin/theme)
// ============================================================

export type TokenGroup = "colors" | "fontSizes" | "fontWeights" | "radii";

export type ThemeToken = {
  key: string; // DB key, e.g. "color.background"
  cssVar: string; // CSS custom property, e.g. "--c-bg"
  label: string; // Hebrew label for the admin UI
  group: TokenGroup;
  default: string; // raw stored value (hex, number, or weight)
  unit?: "px"; // appended when building the CSS declaration
  min?: number; // for size/radius controls
  max?: number;
  step?: number;
};

export const THEME_TOKENS: ThemeToken[] = [
  // ---- Colors ----
  { key: "color.background", cssVar: "--c-bg", label: "רקע", group: "colors", default: "#FAF7F2" },
  { key: "color.textPrimary", cssVar: "--c-text", label: "טקסט ראשי", group: "colors", default: "#43302E" },
  { key: "color.textSecondary", cssVar: "--c-text2", label: "טקסט משני", group: "colors", default: "#66594D" },
  { key: "color.buttonBg", cssVar: "--c-btn", label: "רקע כפתור", group: "colors", default: "#D2E2EB" },
  { key: "color.buttonText", cssVar: "--c-btn-text", label: "טקסט כפתור", group: "colors", default: "#43302E" },
  { key: "color.border", cssVar: "--c-border", label: "מסגרת", group: "colors", default: "#D2E2EB" },
  // Header stripe pattern — the strong and pale colors that alternate.
  { key: "color.stripeStrong", cssVar: "--c-stripe-strong", label: "פס כותרת — צבע חזק", group: "colors", default: "#EBDA9A" },
  { key: "color.stripePale", cssVar: "--c-stripe-pale", label: "פס כותרת — צבע בהיר", group: "colors", default: "#F7EEE6" },
  // Category badge backgrounds (the chip color shown on product cards / cart).
  { key: "color.badgeParve", cssVar: "--c-badge-parve", label: "תווית קטגוריה — פרווה", group: "colors", default: "#EBDA9A" },
  { key: "color.badgeDairy", cssVar: "--c-badge-dairy", label: "תווית קטגוריה — חלבי", group: "colors", default: "#F7EEE6" },
  // Add-to-cart control on product images: the idle "+" circle, and the
  // collapsed "count only" circle (shown once an item is in the cart).
  { key: "color.addIdleBg", cssVar: "--c-add-idle-bg", label: "כפתור הוספה — רקע", group: "colors", default: "#F7EEE6" },
  { key: "color.addIdleIcon", cssVar: "--c-add-idle-icon", label: "כפתור הוספה — סמל", group: "colors", default: "#43302E" },
  { key: "color.addCountBg", cssVar: "--c-add-count-bg", label: "מונה בסל — רקע", group: "colors", default: "#D2E2EB" },
  { key: "color.addCountText", cssVar: "--c-add-count-text", label: "מונה בסל — טקסט", group: "colors", default: "#43302E" },
  // The individual +/- circles inside the expanded stepper (distinct from the
  // collapsed count circle's color).
  { key: "color.addStepBtn", cssVar: "--c-add-step-btn", label: "כפתורי +/- — רקע", group: "colors", default: "#F7EEE6" },
  // Cart-drawer count circle (outline style). Stroke = border at rest AND the
  // fill color on hover; countText = the number inside.
  { key: "color.countStroke", cssVar: "--c-count-stroke", label: "עיגול כמות (עגלה) — מסגרת + מילוי בריחוף", group: "colors", default: "#D2E2EB" },
  { key: "color.countText", cssVar: "--c-count-text", label: "עיגול כמות (עגלה) — מספר", group: "colors", default: "#43302E" },
  // Shared: the top-bar cart badge background AND the active category tab pill.
  { key: "color.accentPill", cssVar: "--c-accent-pill", label: "רקע תג עגלה וטאב פעיל", group: "colors", default: "#FAF7F2" },

  // ---- Font sizes (px) ----
  { key: "fontSize.productName", cssVar: "--fs-product-name", label: "שם מוצר", group: "fontSizes", default: "14", unit: "px", min: 10, max: 32, step: 1 },
  { key: "fontSize.description", cssVar: "--fs-description", label: "תיאור", group: "fontSizes", default: "12", unit: "px", min: 10, max: 32, step: 1 },
  { key: "fontSize.price", cssVar: "--fs-price", label: "מחיר", group: "fontSizes", default: "15", unit: "px", min: 10, max: 32, step: 1 },
  { key: "fontSize.heading", cssVar: "--fs-heading", label: "כותרת", group: "fontSizes", default: "24", unit: "px", min: 10, max: 32, step: 1 },
  { key: "fontSize.label", cssVar: "--fs-label", label: "תווית", group: "fontSizes", default: "10", unit: "px", min: 10, max: 32, step: 1 },

  // ---- Font weights ----
  { key: "fontWeight.productName", cssVar: "--fw-product-name", label: "שם מוצר", group: "fontWeights", default: "600" },
  { key: "fontWeight.description", cssVar: "--fw-description", label: "תיאור", group: "fontWeights", default: "400" },
  { key: "fontWeight.price", cssVar: "--fw-price", label: "מחיר", group: "fontWeights", default: "700" },
  { key: "fontWeight.heading", cssVar: "--fw-heading", label: "כותרת", group: "fontWeights", default: "700" },
  { key: "fontWeight.label", cssVar: "--fw-label", label: "תווית", group: "fontWeights", default: "600" },

  // ---- Border radius (px) ----
  { key: "radius.card", cssVar: "--r-card", label: "כרטיס", group: "radii", default: "16", unit: "px", min: 0, max: 40, step: 1 },
  { key: "radius.button", cssVar: "--r-button", label: "כפתור ראשי", group: "radii", default: "26", unit: "px", min: 0, max: 40, step: 1 },
  { key: "radius.input", cssVar: "--r-input", label: "שדה קלט", group: "radii", default: "8", unit: "px", min: 0, max: 40, step: 1 },
  { key: "radius.pill", cssVar: "--r-pill", label: "כפתור מעוגל", group: "radii", default: "36", unit: "px", min: 0, max: 40, step: 1 },
];

export const TOKENS_BY_KEY: Record<string, ThemeToken> = Object.fromEntries(
  THEME_TOKENS.map((t) => [t.key, t])
);

/** The design-spec default value for every token. */
export const THEME_DEFAULTS: Record<string, string> = Object.fromEntries(
  THEME_TOKENS.map((t) => [t.key, t.default])
);

export const FONT_WEIGHT_OPTIONS = [
  { value: "400", label: "רגיל" },
  { value: "600", label: "בינוני" },
  { value: "700", label: "מודגש" },
];

/** Merge stored overrides on top of the code defaults. */
export function mergeWithDefaults(overrides: Record<string, string>): Record<string, string> {
  const merged = { ...THEME_DEFAULTS };
  for (const t of THEME_TOKENS) {
    const v = overrides[t.key];
    if (v != null && v !== "") merged[t.key] = v;
  }
  return merged;
}

/** Format a single token value into its CSS value (adds "px" where needed). */
export function tokenCssValue(token: ThemeToken, value: string): string {
  return token.unit ? `${value}${token.unit}` : value;
}

/**
 * Build a map of { "--css-var": "value" } for the given token values.
 * Usable both as a CSS string source and as a React inline-style object.
 */
export function cssVarMap(values: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of THEME_TOKENS) {
    const v = values[t.key] ?? t.default;
    out[t.cssVar] = tokenCssValue(t, v);
  }
  return out;
}

/** Serialize token values into the body of a `:root { ... }` block. */
export function cssVarDeclarations(values: Record<string, string>): string {
  const map = cssVarMap(values);
  return Object.entries(map)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
}

// ---------------- WCAG contrast ----------------

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** WCAG contrast ratio between two hex colors (1–21). Returns 0 if a color is invalid. */
export function contrastRatio(a: string, b: string): number {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return 0;
  const la = relativeLuminance(ra);
  const lb = relativeLuminance(rb);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA threshold for normal-size body text. */
export const AA_NORMAL = 4.5;

export type ContrastCheck = {
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  passes: boolean;
};

/** The text/background pairs we validate for readability. */
export function contrastChecks(values: Record<string, string>): ContrastCheck[] {
  const pairs: Array<{ label: string; fgKey: string; bgKey: string }> = [
    { label: "טקסט ראשי על הרקע", fgKey: "color.textPrimary", bgKey: "color.background" },
    { label: "טקסט משני על הרקע", fgKey: "color.textSecondary", bgKey: "color.background" },
    { label: "טקסט כפתור על רקע הכפתור", fgKey: "color.buttonText", bgKey: "color.buttonBg" },
    { label: "טקסט על תווית פרווה", fgKey: "color.textPrimary", bgKey: "color.badgeParve" },
    { label: "טקסט על תווית חלבי", fgKey: "color.textPrimary", bgKey: "color.badgeDairy" },
    { label: "סמל על כפתור הוספה", fgKey: "color.addIdleIcon", bgKey: "color.addIdleBg" },
    { label: "טקסט על מונה בסל", fgKey: "color.addCountText", bgKey: "color.addCountBg" },
    { label: "סמל על כפתורי +/-", fgKey: "color.addIdleIcon", bgKey: "color.addStepBtn" },
    { label: "טקסט על תג/טאב פעיל", fgKey: "color.textPrimary", bgKey: "color.accentPill" },
    { label: "מספר על עיגול כמות (בריחוף)", fgKey: "color.countText", bgKey: "color.countStroke" },
  ];
  return pairs.map((p) => {
    const fg = values[p.fgKey] ?? THEME_DEFAULTS[p.fgKey];
    const bg = values[p.bgKey] ?? THEME_DEFAULTS[p.bgKey];
    const ratio = contrastRatio(fg, bg);
    return { label: p.label, fg, bg, ratio, passes: ratio >= AA_NORMAL };
  });
}
