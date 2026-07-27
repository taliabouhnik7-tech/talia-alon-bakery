import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";
import { HomeClient } from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: categories, error: catError }, { data: products, error: prodError }] =
    await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("sort_order"),
    ]);

  return (
    <HomeClient
      categories={(categories ?? []) as Category[]}
      products={(products ?? []) as Product[]}
      loadError={!!catError || !!prodError}
    />
  );
}
