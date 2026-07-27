"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  THEME_TOKENS,
  THEME_DEFAULTS,
  FONT_WEIGHT_OPTIONS,
  cssVarMap,
  contrastChecks,
  type ThemeToken,
} from "@/lib/theme";

type Props = {
  initialValues: Record<string, string>;
  tableMissing: boolean;
};

const GROUP_TITLES: Record<string, string> = {
  colors: "צבעים",
  fontSizes: "גודל טקסט",
  fontWeights: "עובי טקסט",
  radii: "עיגול פינות",
};

export function ThemeEditor({ initialValues, tableMissing }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dirty = useMemo(
    () => THEME_TOKENS.some((t) => values[t.key] !== initialValues[t.key]),
    [values, initialValues]
  );

  function setValue(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setStatus("idle");
  }

  const checks = useMemo(() => contrastChecks(values), [values]);
  const failing = checks.filter((c) => !c.passes);

  const previewStyle = useMemo(
    () => cssVarMap(values) as unknown as React.CSSProperties,
    [values]
  );

  async function save() {
    setSaving(true);
    setStatus("idle");
    setErrorMsg(null);
    const rows = THEME_TOKENS.map((t) => ({ key: t.key, value: values[t.key] ?? t.default }));
    const { error } = await supabase.from("theme_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  function resetToDefaults() {
    setValues({ ...THEME_DEFAULTS });
    setStatus("idle");
  }

  const byGroup = (g: ThemeToken["group"]) => THEME_TOKENS.filter((t) => t.group === g);

  return (
    <div className="space-y-5 pb-4">
      {tableMissing && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">טבלת העיצוב עדיין לא קיימת ב-Supabase.</p>
          <p className="mt-1">
            אפשר לראות תצוגה מקדימה ולשחק עם הערכים, אבל השמירה לא תעבוד עד שתריצו את הקובץ{" "}
            <code className="rounded bg-red-100 px-1 break-all">supabase/theme_settings.sql</code>{" "}
            ב-SQL editor של Supabase.
          </p>
        </div>
      )}

      {/* ---------------- Live preview (on top) ---------------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">תצוגה מקדימה חיה</h2>
        <div dir="rtl" style={previewStyle} className="rounded-xl border p-3">
          <div className="bg-themeBg rounded-xl p-3 space-y-3">
            {/* Sample product card */}
            <article className="bg-themeBg border-[0.8px] border-themeBorder rounded-card shadow-card overflow-hidden flex min-h-[126px]">
              <div className="flex w-full">
                <div className="flex-1 p-3 flex flex-col items-end justify-between min-w-0">
                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-start gap-2">
                      <h3 className="font-heb t-product-name text-themeText truncate text-right">
                        עוגיות שוקולד צ׳יפס
                      </h3>
                      <span className="inline-block bg-sand t-label text-themeText font-heb rounded-chip px-1.5 py-0.5 shrink-0">
                        פרווה
                      </span>
                    </div>
                    <p className="pt-0.5 font-heb t-description text-themeText2 line-clamp-2 text-right">
                      פריכות בחוץ, רכות בפנים, עמוסות שוקולד
                    </p>
                    <p className="pt-1 font-heb font-medium text-themeText2 opacity-80 text-right text-[12px]">
                      מארז 10 יחידות
                    </p>
                    <p className="pt-1 font-heb t-price text-themeText text-right">40₪</p>
                  </div>
                  <div className="flex items-center justify-start w-full pt-2">
                    <span className="inline-flex items-center bg-themeBtn rounded-full h-8">
                      <span className="w-8 h-8 flex items-center justify-center text-themeText">
                        <span className="w-[22px] h-[22px] rounded-full bg-themeBg flex items-center justify-center text-[14px] leading-none">
                          −
                        </span>
                      </span>
                      <span className="w-6 text-center font-heb font-bold text-[14px] text-themeBtnText">
                        1
                      </span>
                      <span className="w-8 h-8 flex items-center justify-center text-themeText">
                        <span className="w-[22px] h-[22px] rounded-full bg-themeBg flex items-center justify-center text-[14px] leading-none">
                          +
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
                <div className="shrink-0 self-stretch w-[96px] bg-sand/40 flex items-center justify-center text-[10px] text-themeText2">
                  תמונה
                </div>
              </div>
            </article>

            {/* Sample "add to cart" button */}
            <button
              type="button"
              className="bg-themeBtn text-themeBtnText font-heb font-semibold rounded-pill text-[12px] px-4 py-2"
            >
              + הוסף לסל
            </button>

            {/* Sample primary (WhatsApp) button */}
            <button
              type="button"
              className="block w-full bg-themeBtn text-themeBtnText font-heb font-semibold rounded-wa text-[16px] px-6 py-4"
            >
              שליחת ההזמנה בוואטסאפ
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Colors ---------------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">{GROUP_TITLES.colors}</h2>
        <div className="flex flex-col gap-3">
          {byGroup("colors").map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-2">
              <label className="text-sm min-w-0 flex-1 truncate">{t.label}</label>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={values[t.key] ?? ""}
                  onChange={(e) => setValue(t.key, e.target.value)}
                  className="w-24 rounded-md border px-2 py-1 text-left font-mono text-xs uppercase"
                  dir="ltr"
                  aria-label={`${t.label} — קוד צבע`}
                />
                <input
                  type="color"
                  value={values[t.key] ?? "#000000"}
                  onChange={(e) => setValue(t.key, e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded-md border bg-white p-0.5"
                  aria-label={t.label}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Font sizes ---------------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">{GROUP_TITLES.fontSizes}</h2>
        <div className="flex flex-col gap-3">
          {byGroup("fontSizes").map((t) => {
            const min = t.min ?? 10;
            const max = t.max ?? 32;
            const options: number[] = [];
            for (let i = min; i <= max; i++) options.push(i);
            return (
              <div key={t.key} className="flex items-center justify-between gap-2">
                <label className="text-sm min-w-0 flex-1 truncate">{t.label}</label>
                <select
                  value={values[t.key] ?? String(t.default)}
                  onChange={(e) => setValue(t.key, e.target.value)}
                  className="rounded-md border px-2 py-1 text-sm shrink-0"
                  aria-label={t.label}
                >
                  {options.map((n) => (
                    <option key={n} value={String(n)}>
                      {n}px
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- Font weights ---------------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">{GROUP_TITLES.fontWeights}</h2>
        <div className="flex flex-col gap-3">
          {byGroup("fontWeights").map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-2">
              <label className="text-sm min-w-0 flex-1 truncate">{t.label}</label>
              <select
                value={values[t.key] ?? String(t.default)}
                onChange={(e) => setValue(t.key, e.target.value)}
                className="rounded-md border px-2 py-1 text-sm shrink-0"
                aria-label={t.label}
              >
                {FONT_WEIGHT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Radii ---------------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">{GROUP_TITLES.radii}</h2>
        <div className="flex flex-col gap-4">
          {byGroup("radii").map((t) => (
            <div key={t.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <label>{t.label}</label>
                <span className="font-mono text-xs text-gray-500">
                  {values[t.key] ?? t.default}px
                </span>
              </div>
              <input
                type="range"
                min={t.min ?? 0}
                max={t.max ?? 40}
                step={t.step ?? 1}
                value={Number(values[t.key] ?? t.default)}
                onChange={(e) => setValue(t.key, e.target.value)}
                className="w-full"
                aria-label={t.label}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Contrast checker ---------------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">בדיקת ניגודיות (WCAG AA)</h2>
        {failing.length > 0 && (
          <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            ⚠️ חלק מהצבעים לא עומדים בסף הניגודיות המומלץ (4.5:1). הטקסט עלול להיות קשה לקריאה. אפשר
            לשמור בכל זאת — זו ההחלטה שלך.
          </div>
        )}
        <ul className="space-y-2 text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block h-4 w-6 shrink-0 rounded border"
                  style={{ background: c.bg }}
                >
                  <span className="block text-center text-[10px] leading-4" style={{ color: c.fg }}>
                    א
                  </span>
                </span>
                <span className="truncate">{c.label}</span>
              </span>
              <span
                className={`font-mono text-xs shrink-0 ${c.passes ? "text-green-700" : "text-amber-700"}`}
              >
                {c.ratio.toFixed(2)}:1 {c.passes ? "✓" : "⚠️"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- Action bar ---------------- */}
      <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t bg-white/90 py-3 backdrop-blur">
        <div className="min-w-0 flex-1 text-xs">
          {status === "saved" && <span className="text-green-700">נשמר ✓ השינויים חלים על האתר.</span>}
          {status === "error" && <span className="text-red-700">שגיאה בשמירה: {errorMsg}</span>}
          {status === "idle" && dirty && <span className="text-gray-500">יש שינויים שלא נשמרו</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetToDefaults}
            disabled={saving}
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            איפוס
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "שומר..." : "שמירת שינויים"}
          </button>
        </div>
      </div>
    </div>
  );
}
