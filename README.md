# טליה אלון — Bakery Website

A mobile-first, RTL Hebrew bakery ordering site with a full admin panel.

- **Public site** (`/`) — catalog with tabs (Parve / Dairy / Challah), cart, and WhatsApp checkout.
- **Cart page** (`/cart`) — order summary; sends the order to WhatsApp and saves a copy to the database.
- **Admin panel** (`/admin`) — login-protected. Manage products, categories, view orders, and see analytics.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + Storage).

---

## 1. What you need before you start

You'll need free accounts on:

1. **[Supabase](https://supabase.com)** — the database, image storage, and login system.
2. **[Vercel](https://vercel.com)** — where the site will live on the internet.
3. **[GitHub](https://github.com)** — to store the code (Vercel deploys from here).
4. **[Node.js](https://nodejs.org)** version 18.17 or newer, installed on your computer.

---

## 2. First-time setup on your computer

Open a terminal in this folder and install the dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env.local
```

You'll fill in the empty values in the next step.

---

## 3. Create your Supabase project

1. Go to https://app.supabase.com and click **New project**.
2. Give it a name (e.g. `talia-alon-bakery`), pick a region close to you, and set a strong database password (you don't need this password later — just don't lose it).
3. Wait ~2 minutes for the project to spin up.

### 3a. Copy the API keys into `.env.local`

Inside the Supabase dashboard, open **Project Settings → API**. You'll see:

- **Project URL** — copy it into `NEXT_PUBLIC_SUPABASE_URL`.
- **anon public key** — copy into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **service_role secret key** — copy into `SUPABASE_SERVICE_ROLE_KEY`.

> ⚠️ **Never share the service_role key.** It bypasses all security rules. Keep it only in `.env.local` and in Vercel's environment variables.

Also set:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=972586666623
```

This is your WhatsApp number in international format (Israel = 972, then the number without the leading 0).

### 3b. Create the database tables

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Copy the entire contents of `supabase/schema.sql` and paste it in.
3. Click **Run**. You should see "Success. No rows returned."
4. Open a second new query. Paste `supabase/seed.sql`. Click **Run**. This adds the categories and the initial products.

You should now see the tables under **Table Editor**: `categories`, `products`, `orders`, `page_views`, `product_add_events`.

You should also see a **Storage** bucket called `product-images` under **Storage → Buckets**.

### 3c. Create your admin login

Still in your terminal, run:

```bash
ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="pickAStrongPasswordHere" npm run seed:admin
```

Replace the email and password with your own. This creates the single admin user in Supabase Auth. You can re-run it later to change your password.

> On Windows PowerShell, use this instead:
> ```powershell
> $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="StrongPass!23"; npm run seed:admin
> ```

There's no public sign-up — nobody else can create an admin account.

---

## 4. Run the site on your computer

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

- The public site is at http://localhost:3000
- The admin login is at http://localhost:3000/admin/login

Log in with the email + password you just created. You can now add/edit products, upload photos, and view orders.

---

## 5. Deploy to the internet with Vercel

1. Push this folder to a GitHub repository (you can create an empty repo on github.com and follow their "push existing folder" instructions).
2. Go to https://vercel.com → **Add New → Project → Import** your GitHub repo.
3. On the "Configure Project" screen, expand **Environment Variables** and add all four variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Click **Deploy**. In ~2 minutes you get a live URL like `https://talia-alon-bakery.vercel.app`.
5. To use your own domain, open the project in Vercel → **Domains** and follow the instructions.

Every time you push to GitHub, Vercel re-deploys automatically. No manual step.

---

## 6. Using the admin panel

Log in at `/admin/login` on your live URL (or `http://localhost:3000/admin/login` locally).

- **דשבורד (Dashboard)** — visits today/total, a 7-day chart, top products by "add to cart" activity, and the latest 5 orders.
- **מוצרים (Products)** — add / edit / delete products. When editing you can:
  - Upload a product image (it goes to Supabase Storage — the URL is filled in automatically).
  - Change price, description, package info, category.
  - Toggle "זמין להצגה באתר" to hide a product without deleting it.
  - Change `סדר תצוגה` — lower numbers appear first.
- **קטגוריות (Categories)** — rename or reorder the tabs, add new categories, or remove empty ones.
- **הזמנות (Orders)** — every order sent via WhatsApp is also saved here, with the full item list, notes, timestamp, and total.

---

## 7. Design notes (why things look the way they do)

- Mobile-first, max width 448 px. On desktop the site is centered inside a 448-px frame — this is on purpose, so the layout matches the phone experience your customers will actually see.
- All layout is RTL. Fonts: **Fredoka** for the logo, **Assistant** for the Hebrew UI, **Inter** for the cart page.
- Colors, spacing, and radii come straight from your Figma spec; they're centralized in `tailwind.config.ts` so you can tweak them in one place.
- **Accessibility fixes I applied:**
  - Every button and icon has an `aria-label` in Hebrew.
  - Focus rings are visible on keyboard tab navigation.
  - All tap targets on mobile are at least 44×44 px (the cart icon, add-to-cart, and quantity buttons).
  - Form fields have real `<label>` elements (screen readers pick these up).
  - Images have `alt` text (defaults to the product name; a placeholder tile says "תמונה בקרוב" when there is no image).
  - The category tabs use `role="tablist"` / `role="tab"` / `aria-selected` so assistive tech announces them correctly.
  - The single "*" on required fields is duplicated with `aria-required="true"` on the input for screen readers.
  - Colors were checked for contrast — dark text `#43302E` on the beige `#F7EEE6` passes AA at all sizes; the light-blue `#D2E2EB` is used only as a decorative surface (never for small text on white).

---

## 8. Frequently asked

**Q: I want to change the WhatsApp number.**
Edit `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (locally) and in Vercel's Environment Variables (production). Redeploy.

**Q: I want to change the pickup address / opening hours / kosher note.**
Edit `src/components/InfoStrip.tsx`.

**Q: I want to change the logo text.**
Edit `src/components/LogoHeader.tsx` and `src/components/TopBar.tsx`.

**Q: A customer sent an order but it didn't show up in "הזמנות".**
The order is saved before WhatsApp opens. If the browser blocks the DB call (rare) the WhatsApp message still goes through. Check the Supabase `orders` table directly to confirm.

**Q: I forgot my admin password.**
Just re-run `npm run seed:admin` with the same email and a new password.
