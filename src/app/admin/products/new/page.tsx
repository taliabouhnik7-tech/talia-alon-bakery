import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">מוצר חדש</h1>
      <ProductForm mode="create" categories={categories ?? []} />
    </div>
  );
}
