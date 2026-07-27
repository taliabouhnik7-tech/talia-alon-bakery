import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoriesEditor } from "./CategoriesEditor";

export const dynamic = "force-dynamic";

export default async function CategoriesAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">קטגוריות</h1>
      <p className="text-sm text-gray-600">
        קטגוריות מופיעות ככפתורים בראש התפריט. אי אפשר למחוק קטגוריה שיש בה מוצרים.
      </p>
      <CategoriesEditor initial={categories ?? []} />
    </div>
  );
}
