import { fetchThemeValues } from "@/lib/theme-server";
import { cssVarDeclarations } from "@/lib/theme";

/**
 * Injects the live theme as CSS custom properties on :root.
 * Rendered high in the root layout so first paint already uses the saved theme
 * (no flash). Overrides the fallback defaults declared in globals.css.
 */
export async function ThemeStyle() {
  const { values } = await fetchThemeValues();
  const css = `:root{${cssVarDeclarations(values)}}`;
  return <style id="theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}
