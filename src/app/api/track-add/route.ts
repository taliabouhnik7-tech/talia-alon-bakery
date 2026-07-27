import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json().catch(() => ({}));
    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ ok: false }, { status: 200 });
    }
    const supabase = createSupabaseAdminClient();
    await supabase.from("product_add_events").insert({ product_id: productId });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
