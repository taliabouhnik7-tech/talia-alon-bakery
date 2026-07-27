import { createClient } from "@supabase/supabase-js";
import { mergeWithDefaults } from "./theme";

export type ThemeFetchResult = {
  values: Record<string, string>; // full token map (defaults merged with overrides)
  tableMissing: boolean; // true if the theme_settings table doesn't exist yet / read failed
};

/**
 * Read theme overrides from Supabase for server rendering.
 * Uses the anon key (public read RLS), no cookies, and no HTTP caching so
 * saved changes appear on the very next request. Falls back to the design
 * defaults if the table hasn't been created yet.
 */
export async function fetchThemeValues(): Promise<ThemeFetchResult> {
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

    const { data, error } = await supabase.from("theme_settings").select("key,value");
    if (error) {
      return { values: mergeWithDefaults({}), tableMissing: true };
    }

    const overrides: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row?.key) overrides[row.key as string] = String(row.value ?? "");
    }
    return { values: mergeWithDefaults(overrides), tableMissing: false };
  } catch {
    return { values: mergeWithDefaults({}), tableMissing: true };
  }
}
