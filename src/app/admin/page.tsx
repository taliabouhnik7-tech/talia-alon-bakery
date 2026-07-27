import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function dayISO(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const since7 = dayISO(6); // last 7 days including today

  const [totalViewsRes, todayViewsRes, viewsBucketRes, addEventsRes, ordersRes, productsRes] =
    await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", dayISO(0)),
      supabase
        .from("page_views")
        .select("created_at")
        .gte("created_at", since7),
      supabase
        .from("product_add_events")
        .select("product_id, created_at")
        .gte("created_at", since7),
      supabase
        .from("orders")
        .select("id, customer_name, total, created_at, items")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("products").select("id, name"),
    ]);

  const productNameById = new Map<string, string>();
  for (const p of productsRes.data ?? []) productNameById.set(p.id, p.name);

  // Views per day (last 7 days)
  const perDay = new Array(7).fill(0);
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" }));
  }
  for (const row of viewsBucketRes.data ?? []) {
    const d = new Date(row.created_at);
    const now = new Date();
    const diff = Math.floor(
      (now.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const idx = 6 - diff;
    if (idx >= 0 && idx < 7) perDay[idx] += 1;
  }
  const maxDay = Math.max(1, ...perDay);

  // Top products by add-to-cart events (last 7 days)
  const addCountByProduct = new Map<string, number>();
  for (const ev of addEventsRes.data ?? []) {
    if (!ev.product_id) continue;
    addCountByProduct.set(ev.product_id, (addCountByProduct.get(ev.product_id) ?? 0) + 1);
  }
  const topProducts = [...addCountByProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      id,
      name: productNameById.get(id) ?? "(פריט שנמחק)",
      count,
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">דשבורד</h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="סה״כ צפיות באתר" value={totalViewsRes.count ?? 0} />
        <StatCard label="צפיות היום" value={todayViewsRes.count ?? 0} />
      </div>

      <section className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">צפיות ב־7 הימים האחרונים</h2>
        <div className="flex items-end gap-2 h-40" dir="ltr">
          {perDay.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-skyblue rounded-t"
                style={{ height: `${(v / maxDay) * 100}%`, minHeight: 2 }}
                aria-label={`יום ${labels[i]}: ${v} צפיות`}
              />
              <span className="text-[10px] text-gray-500">{labels[i]}</span>
              <span className="text-xs font-medium">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">מוצרים מובילים (הוספה לסל, 7 ימים)</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">אין עדיין נתונים.</p>
        ) : (
          <ul className="divide-y">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <span>{p.name}</span>
                <span className="text-sm text-gray-500">{p.count} הוספות</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">הזמנות אחרונות</h2>
        {(ordersRes.data?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500">אין עדיין הזמנות.</p>
        ) : (
          <ul className="divide-y">
            {ordersRes.data!.map((o) => (
              <li key={o.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{o.customer_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(o.created_at).toLocaleString("he-IL")}
                  </p>
                </div>
                <span className="font-semibold">{Number(o.total).toFixed(0)}₪</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
