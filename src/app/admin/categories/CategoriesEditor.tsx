"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40) || `cat-${Date.now()}`;
}

export function CategoriesEditor({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [rows, setRows] = useState<Category[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  async function saveRow(row: Category) {
    setBusy(true);
    setError(null);
    const { error } = await supabase
      .from("categories")
      .update({ name: row.name, sort_order: row.sort_order })
      .eq("id", row.id);
    setBusy(false);
    if (error) setError(error.message);
    router.refresh();
  }

  async function deleteRow(id: string) {
    if (!confirm("למחוק קטגוריה?")) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    setBusy(false);
    if (error) {
      setError("לא ניתן למחוק — כנראה יש מוצרים בקטגוריה זו.");
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  async function addRow() {
    if (!newName.trim()) return;
    setBusy(true);
    setError(null);
    const sortOrder = Math.max(0, ...rows.map((r) => r.sort_order)) + 1;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newName.trim(), slug: slugify(newName), sort_order: sortOrder })
      .select("*")
      .single();
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((r) => [...r, data as Category]);
    setNewName("");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-gray-50 text-right">
            <tr>
              <th className="p-3">שם</th>
              <th className="p-3">Slug</th>
              <th className="p-3">סדר</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">
                  <input
                    value={row.name}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) => (r.id === row.id ? { ...r, name: e.target.value } : r))
                      )
                    }
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2 text-gray-500">{row.slug}</td>
                <td className="p-2 w-24">
                  <input
                    type="number"
                    value={row.sort_order}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id ? { ...r, sort_order: Number(e.target.value) } : r
                        )
                      )
                    }
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2 text-left space-x-2 space-x-reverse">
                  <button
                    disabled={busy}
                    onClick={() => saveRow(row)}
                    className="bg-ink text-white text-xs rounded-md px-3 py-1"
                  >
                    שמירה
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => deleteRow(row.id)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    מחיקה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="שם קטגוריה חדשה"
          className="border rounded-md px-3 py-2 flex-1"
        />
        <button
          disabled={busy || !newName.trim()}
          onClick={addRow}
          className="bg-ink text-white rounded-md px-4 py-2 font-semibold disabled:opacity-60"
        >
          הוספה
        </button>
      </div>
    </div>
  );
}
