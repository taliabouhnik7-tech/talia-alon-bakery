export type Category = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string;
  category_slug?: string;
  category_name?: string;
  name: string;
  description: string | null;
  package_info: string | null;
  price: number | null;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
};

export type CartItem = {
  productId: string;
  name: string;
  categoryName: string;
  packageInfo: string | null;
  price: number | null;
  imageUrl?: string | null;
  quantity: number;
};

export type OrderRow = {
  id: string;
  customer_name: string;
  notes: string | null;
  items: Array<{
    product_id: string;
    name: string;
    category: string;
    package_info: string | null;
    price: number | null;
    quantity: number;
  }>;
  total: number;
  created_at: string;
};
