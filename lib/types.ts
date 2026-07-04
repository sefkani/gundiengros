export type StockStatus = "på_lager" | "lav_beholdning" | "utsolgt";

export type OrderStatus =
  | "mottatt"
  | "bekreftet"
  | "under_pakking"
  | "sendt"
  | "levert"
  | "kansellert";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  sku: string | null;
  description: string | null;
  unit: string;
  package_size: string | null;
  price_ex_vat: number;
  vat_rate: number;
  stock_status: StockStatus;
  image_url: string | null;
  active: boolean;
  min_order_qty: number;
  created_at: string;
}

export interface Profile {
  id: string;
  company_name: string;
  org_number: string | null;
  contact_person: string | null;
  phone: string | null;
  role: "customer" | "admin";
  approved: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  note: string | null;
  delivery_date: string | null;
  created_at: string;
  profiles?: Profile;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  package_size: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  på_lager: "På lager",
  lav_beholdning: "Lav beholdning",
  utsolgt: "Utsolgt",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  mottatt: "Mottatt",
  bekreftet: "Bekreftet",
  under_pakking: "Under pakking",
  sendt: "Sendt",
  levert: "Levert",
  kansellert: "Kansellert",
};
