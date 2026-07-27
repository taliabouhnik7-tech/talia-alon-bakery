/**
 * Creates the single admin user for the bakery site.
 *
 * Usage:
 *   1. Fill .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   2. Run:  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='pickAStrongOne' npm run seed:admin
 *
 * If the user already exists, its password will be updated.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Very small .env.local loader so you don't need dotenv installed.
function loadEnvFile(file: string) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const key = m[1];
    let value = m[2] ?? "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}
if (!email || !password) {
  console.error(
    "Please set ADMIN_EMAIL and ADMIN_PASSWORD env variables when running this script.\n" +
      "Example:\n  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='StrongPass!23' npm run seed:admin"
  );
  process.exit(1);
}

async function main() {
  const admin = createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw listError;

  const found = existing.users.find(
    (u) => u.email?.toLowerCase() === email!.toLowerCase()
  );

  if (found) {
    console.log(`User already exists (id=${found.id}); updating password...`);
    const { error } = await admin.auth.admin.updateUserById(found.id, {
      password: password!,
      email_confirm: true,
    });
    if (error) throw error;
    console.log("Password updated. You can log in at /admin/login");
    return;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: email!,
    password: password!,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(
    `Admin user created (id=${data.user?.id}). Log in at /admin/login with:\n  email: ${email}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
