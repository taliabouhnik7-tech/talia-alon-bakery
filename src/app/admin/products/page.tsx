import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DeleteProductButton } from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function ProductsAdmin() {
  const supabase = await createSupabaseServerClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, is_available, image_url, sort_order, category_id")
      .order("sort_order"),
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">מוצרים</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink text-white rounded-md px-3 py-2 text-sm font-semibold"
        >
          + מוצר חדש
        </Link>
      </div>

      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-gray-50 text-right">
            <tr>
              <th className="p-3">שם</th>
              <th className="p-3">קטגוריה</th>
              <th className="p-3">מחיר</th>
              <th className="p-3">זמין</th>
              <th className="p-3">סדר</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3">{catMap.get(p.category_id) ?? "—"}</td>
                <td className="p-3">{p.price != null ? `${p.price}₪` : "—"}</td>
                <td className="p-3">{p.is_available ? "כן" : "לא"}</td>
                <td className="p-3">{p.sort_order}</td>
                <td className="p-3 text-left">
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
            {(products ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  אין עדיין מוצרים.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
