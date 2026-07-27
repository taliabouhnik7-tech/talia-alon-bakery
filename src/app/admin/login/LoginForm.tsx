"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") || "/admin";
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setBusy(true);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        setBusy(false);
        if (error) {
          setError("שם משתמש או סיסמה שגויים");
          return;
        }
        router.replace(from);
        router.refresh();
      }}
    >
      <label className="text-sm">
        אימייל
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border rounded-md px-3 py-2"
          autoComplete="email"
        />
      </label>
      <label className="text-sm">
        סיסמה
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border rounded-md px-3 py-2"
          autoComplete="current-password"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="bg-ink text-white rounded-md py-2 font-semibold disabled:opacity-60"
      >
        {busy ? "מתחברת..." : "התחברות"}
      </button>
    </form>
  );
}
