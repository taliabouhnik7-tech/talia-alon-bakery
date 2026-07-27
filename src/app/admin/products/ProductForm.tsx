"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Category = { id: string; name: string };
type Initial = {
  id?: string;
  category_id?: string;
  name?: string;
  description?: string | null;
  package_info?: string | null;
  price?: number | null;
  image_url?: string | null;
  sort_order?: number;
  is_available?: boolean;
};

type Props = {
  mode: "create" | "edit";
  categories: Category[];
  initial?: Initial;
};

export function ProductForm({ mode, categories, initial = {} }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [name, setName] = useState(initial.name ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [packageInfo, setPackageInfo] = useState(initial.package_info ?? "");
  const [price, setPrice] = useState<string>(
    initial.price != null ? String(initial.price) : ""
  );
  const [categoryId, setCategoryId] = useState(initial.category_id ?? categories[0]?.id ?? "");
  const [sortOrder, setSortOrder] = useState<string>(String(initial.sort_order ?? 0));
  const [isAvailable, setIsAvailable] = useState(initial.is_available ?? true);
  const [imageUrl, setImageUrl] = useState<string | null>(initial.image_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "העלאה נכשלה");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const payload = {
      category_id: categoryId,
      name: name.trim(),
      description: description.trim() || null,
      package_info: packageInfo.trim() || null,
      price: price === "" ? null : Number(price),
      image_url: imageUrl,
      sort_order: Number(sortOrder) || 0,
      is_available: isAvailable,
    };

    try {
      if (mode === "create") {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", initial.id!);
        if (error) throw error;
      }
      router.replace("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "שמירה נכשלה");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-lg p-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm">
          שם*
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="text-sm">
          קטגוריה*
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm sm:col-span-2">
          תיאור
          <textarea
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="text-sm">
          מארז / הערת גודל
          <input
            value={packageInfo ?? ""}
            onChange={(e) => setPackageInfo(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="למשל: מארז 10 יחידות"
          />
        </label>

        <label className="text-sm">
          מחיר (₪)
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="text-sm">
          סדר תצוגה
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="text-sm flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          זמין להצגה באתר
        </label>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">תמונה</p>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-50 relative">
            {imageUrl ? (
              <Image src={imageUrl} alt="תצוגה מקדימה" fill className="object-cover" />
            ) : (
              <span className="text-xs text-gray-400 flex items-center justify-center h-full">
                אין תמונה
              </span>
            )}
          </div>
          <label className="inline-block bg-gray-100 hover:bg-gray-200 border rounded-md px-3 py-2 text-sm cursor-pointer">
            {uploading ? "מעלה..." : "בחירת תמונה"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
          </label>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="text-sm text-red-600 hover:underline"
            >
              הסרה
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-ink text-white rounded-md px-4 py-2 font-semibold disabled:opacity-60"
        >
          {busy ? "שומרת..." : mode === "create" ? "יצירה" : "שמירה"}
        </button>
        <button
          type="button"
          className="border rounded-md px-4 py-2"
          onClick={() => router.back()}
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
