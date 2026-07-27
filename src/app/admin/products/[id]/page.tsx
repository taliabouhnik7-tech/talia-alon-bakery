import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  if (!product) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">עריכת מוצר</h1>
      <ProductForm mode="edit" initial={product} categories={categories ?? []} />
    </div>
  );
}
