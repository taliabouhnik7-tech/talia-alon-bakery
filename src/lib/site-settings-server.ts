import { createClient } from "@supabase/supabase-js";

export type SiteSettings = {
  // A custom header asset (raster or SVG) that replaces the whole default header
  // (stripes + logo oval). null = use the default header.
  headerImageUrl: string | null;
  // Whether the info line (address / hours / kosher note) shows under the header.
  showInfoStrip: boolean;
};

// Stored as rows in the existing `theme_settings` key/value table.
export const SITE_KEYS = {
  headerImageUrl: "site.headerImageUrl",
  showInfoStrip: "site.showInfoStrip",
} as const;

export const SITE_DEFAULTS: SiteSettings = {
  headerImageUrl: null,
  showInfoStrip: true,
};

/**
 * Read site settings (header asset + info-line toggle) for server rendering.
 * Anon key, no HTTP caching, graceful fallback to defaults if the table is
 * missing. Mirrors fetchThemeValues().
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (input: RequestInfo | URL, init?: RequestInit) =>
            fetch(input, { ...init, cache: "no-store" }),
        },
      }
    );

    const { data, error } = await supabase
      .from("theme_settings")
      .select("key,value")
      .in("key", [SITE_KEYS.headerImageUrl, SITE_KEYS.showInfoStrip]);
    if (error) return { ...SITE_DEFAULTS };

    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row?.key) map[row.key as string] = String(row.value ?? "");
    }
    const url = map[SITE_KEYS.headerImageUrl]?.trim();
    return {
      headerImageUrl: url ? url : null,
      // default ON — only "false" hides it
      showInfoStrip: map[SITE_KEYS.showInfoStrip] !== "false",
    };
  } catch {
    return { ...SITE_DEFAULTS };
  }
}
