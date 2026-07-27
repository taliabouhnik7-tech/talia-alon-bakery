-- ============================================================
-- Talia Alon Bakery — Seed data
-- Run this once, after schema.sql, in your Supabase SQL editor.
-- Safe to re-run: uses ON CONFLICT for categories, and clears
-- products before inserting fresh copies.
-- ============================================================

insert into public.categories (slug, name, sort_order) values
  ('parve',   'פרווה', 1),
  ('dairy',   'חלבי',  2),
  ('challah', 'חלות',  3)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

-- Wipe existing products so seed is idempotent during development.
delete from public.products;

with c as (
  select slug, id from public.categories
)
insert into public.products (category_id, name, description, package_info, price, sort_order, is_available)
select c.id, p.name, p.description, p.package_info, p.price, p.sort_order, true
from (values
  -- Parve
  ('parve', 1,  'עוגיות שוקולד צ''יפס',  'פריכות בחוץ, רכות בפנים, עמוסות שוקולד',        'מארז 10 יחידות', 40),
  ('parve', 2,  'עוגת שוקולד',            'עוגת שוקולד לחה ועשירה, מושלמת לשבת',            'עוגה שלמה',      90),
  ('parve', 3,  'עוגיות אמסטרדם',         'עוגיות קלאסיות פריכות עם ניחוח וניל',            'מארז 10 יחידות', 45),
  ('parve', 4,  'כדורי שוקולד',           'כדורי שוקולד עשירים מגולגלים בקקאו',              'מארז 15 יחידות', 25),
  ('parve', 5,  'בראוניז',                'בראוניז שוקולד מפנקים, רכים ואינטנסיביים',        'מארז 9 יחידות',  45),
  ('parve', 6,  'עוגת פירות',             'עוגת פירות עונתית, ריחנית וקלילה',                'עוגה שלמה',      70),
  ('parve', 7,  'רול שוקולד ביסקוויט',    'רול קלאסי עם שכבת שוקולד וביסקוויט',              'עוגה שלמה',      65),
  -- Dairy
  ('dairy', 1,  'מגולגלות קינדר',         'מגולגלות חלביות במילוי שוקולד קינדר',             'מארז 8 יחידות',  55),
  ('dairy', 2,  'עוגיות שוקולד צ''יפס',   'גרסה חלבית — חמאה אמיתית ושוקולד מובחר',          'מארז 10 יחידות', 45),
  ('dairy', 3,  'בראוניז',                'בראוניז חלבי עשיר עם חמאה וגנאש שוקולד',          'מארז 9 יחידות',  50),
  ('dairy', 4,  'עוגיות אמסטרדם',         'עוגיות חמאה קלאסיות אמסטרדם',                     'מארז 10 יחידות', 50),
  ('dairy', 5,  'עוגת שמרים',             'עוגת שמרים רכה במילוי שוקולד או קינמון',          'עוגה שלמה',      60),
  -- Challah
  ('challah', 1, 'חלה לשבת',              'חלת שבת קלועה, טרייה מהתנור',                    'חלה אחת',        20)
) as p(cat_slug, sort_order, name, description, package_info, price)
join c on c.slug = p.cat_slug;
