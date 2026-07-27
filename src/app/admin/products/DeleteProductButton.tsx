"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="text-red-600 hover:underline text-sm"
      disabled={busy}
      onClick={async () => {
        if (!confirm(`למחוק את המוצר "${name}"?`)) return;
        setBusy(true);
        const { error } = await supabase.from("products").delete().eq("id", id);
        setBusy(false);
        if (error) {
          alert("שגיאה במחיקה: " + error.message);
          return;
        }
        router.refresh();
      }}
    >
      מחיקה
    </button>
  );
}
