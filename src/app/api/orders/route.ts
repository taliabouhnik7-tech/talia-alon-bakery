import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type IncomingItem = {
  product_id?: string;
  name?: string;
  category?: string;
  package_info?: string | null;
  price?: number | null;
  quantity?: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customer_name = String(body?.customer_name ?? "").trim();
    const notes = body?.notes ? String(body.notes).trim() : null;
    const rawItems: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const total = Number(body?.total ?? 0);

    if (!customer_name) {
      return NextResponse.json(
        { ok: false, error: "customer_name is required" },
        { status: 400 }
      );
    }
    if (rawItems.length === 0) {
      return NextResponse.json(
        { ok: false, error: "items must not be empty" },
        { status: 400 }
      );
    }

    const items = rawItems.map((i) => ({
      product_id: String(i.product_id ?? ""),
      name: String(i.name ?? ""),
      category: String(i.category ?? ""),
      package_info: i.package_info ?? null,
      price: i.price ?? null,
      quantity: Number(i.quantity ?? 0),
    }));

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({ customer_name, notes, items, total })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
