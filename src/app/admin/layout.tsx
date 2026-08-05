import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export const metadata = {
  title: "ניהול — טליה אלון",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {isLoggedIn && (
        <header className="border-b bg-gray-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 p-4 flex-wrap">
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/admin" className="hover:underline">
                דשבורד
              </Link>
              <Link href="/admin/products" className="hover:underline">
                מוצרים
              </Link>
              <Link href="/admin/categories" className="hover:underline">
                קטגוריות
              </Link>
              <Link href="/admin/orders" className="hover:underline">
                הזמנות
              </Link>
              <Link href="/admin/theme" className="hover:underline">
                עיצוב
              </Link>
              <Link href="/admin/site" className="hover:underline">
                אתר
              </Link>
              <Link href="/" className="hover:underline text-gray-500">
                לאתר ↗
              </Link>
            </nav>
            <SignOutButton />
          </div>
        </header>
      )}
      <main className="max-w-5xl mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
