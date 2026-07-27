"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="text-sm text-gray-600 hover:text-gray-900 underline"
    >
      התנתקות
    </button>
  );
}
