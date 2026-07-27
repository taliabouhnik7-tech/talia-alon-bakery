import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrderRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OrdersAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">הזמנות ({orders.length})</h1>

      {orders.length === 0 && (
        <p className="text-sm text-gray-500">אין עדיין הזמנות.</p>
      )}

      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">{o.customer_name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(o.created_at).toLocaleString("he-IL")}
                </p>
              </div>
              <span className="font-bold">{Number(o.total).toFixed(0)}₪</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {o.items.map((it, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span>
                    {it.name} ({it.category})
                    {it.package_info ? ` — ${it.package_info}` : ""} × {it.quantity}
                  </span>
                  <span>
                    {it.price != null ? `${(Number(it.price) * it.quantity).toFixed(0)}₪` : "—"}
                  </span>
                </li>
              ))}
            </ul>
            {o.notes && (
              <p className="mt-3 text-sm text-gray-600 border-t pt-2">
                <span className="font-medium">הערות:</span> {o.notes}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
