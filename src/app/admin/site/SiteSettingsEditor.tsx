"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { SITE_KEYS, type SiteSettings } from "@/lib/site-settings-server";

export function SiteSettingsEditor({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(initial.headerImageUrl);
  const [showInfoStrip, setShowInfoStrip] = useState<boolean>(initial.showInfoStrip);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const dirty =
    headerImageUrl !== initial.headerImageUrl || showInfoStrip !== initial.showInfoStrip;

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    setStatus("idle");
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `site/header-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setHeaderImageUrl(data.publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "העלאה נכשלה");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setStatus("idle");
    setError(null);
    const rows = [
      { key: SITE_KEYS.headerImageUrl, value: headerImageUrl ?? "" },
      { key: SITE_KEYS.showInfoStrip, value: showInfoStrip ? "true" : "false" },
    ];
    const { error } = await supabase.from("theme_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* ---------- Custom header ---------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-1 font-semibold">כותרת מותאמת אישית</h2>
        <p className="mb-3 text-sm text-gray-500">
          העלו תמונה אחת (PNG/JPG או SVG) שתחליף לגמרי את הכותרת — הרקע והלוגו יחד.
          כשלא הועלתה תמונה, מוצגת כברירת מחדל הכותרת עם הפסים והלוגו. מומלץ קובץ רחב
          בערך ‎1600×440‎ פיקסלים; התמונה ממלאת את רוחב המסך ועשויה להיחתך מעט בקצוות
          (במיוחד במובייל), אז כדאי למרכז את התוכן החשוב.
        </p>

        <div className="flex flex-wrap items-start gap-4">
          <div className="w-full max-w-md h-32 rounded-md border overflow-hidden bg-gray-50 relative">
            {headerImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={headerImageUrl} alt="תצוגה מקדימה של הכותרת" className="w-full h-full object-cover object-center" />
            ) : (
              <span className="text-xs text-gray-400 flex items-center justify-center h-full">
                אין כותרת מותאמת — מוצגת ברירת המחדל (פסים + לוגו)
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-block bg-gray-100 hover:bg-gray-200 border rounded-md px-3 py-2 text-sm cursor-pointer text-center">
              {uploading ? "מעלה..." : headerImageUrl ? "החלפת תמונה" : "העלאת תמונה"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                }}
              />
            </label>
            {headerImageUrl && (
              <button
                type="button"
                onClick={() => setHeaderImageUrl(null)}
                className="text-sm text-red-600 hover:underline"
              >
                הסרה וחזרה לברירת המחדל
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Info line toggle ---------- */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-1 font-semibold">שורת מידע</h2>
        <p className="mb-3 text-sm text-gray-500">
          הכתובת, שעות הפתיחה והערת הכשרות שמתחת לכותרת.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showInfoStrip}
            onChange={(e) => setShowInfoStrip(e.target.checked)}
          />
          הצגת שורת המידע באתר
        </label>
      </section>

      {/* ---------- Action bar ---------- */}
      <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t bg-white/90 py-3 backdrop-blur">
        <div className="min-w-0 flex-1 text-xs">
          {status === "saved" && <span className="text-green-700">נשמר ✓ השינויים חלים על האתר.</span>}
          {status === "error" && <span className="text-red-700">שגיאה בשמירה: {error}</span>}
          {status === "idle" && dirty && <span className="text-gray-500">יש שינויים שלא נשמרו</span>}
          {status === "idle" && !dirty && error && <span className="text-red-700">{error}</span>}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || uploading}
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "שומרת..." : "שמירה"}
        </button>
      </div>
    </div>
  );
}
