export type DietaryType = 'veg' | 'non-veg';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface ICafe {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  hero_image_url: string;
  address: string;
  phone: string;
  email: string;
  gstin?: string;
  currency_symbol: string;
  tax_rate_percent: number; // e.g. 5 for 5% GST
  created_at?: string;
}

export interface ICategory {
  id: string;
  cafe_id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface IMenuItem {
  id: string;
  cafe_id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  is_veg: boolean;
  is_available: boolean;
  is_featured: boolean;
  prep_time_minutes: number;
  spicy_level?: number; // 0, 1, 2, 3
  tags?: string[];
  created_at?: string;
}

export interface ICafeTable {
  id: string;
  cafe_id: string;
  table_number: string;
  capacity: number;
  qr_code_url?: string;
  status: 'available' | 'occupied' | 'reserved';
  active_order_id?: string;
  created_at?: string;
}

export interface IOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  item_price: number;
  is_veg: boolean;
  quantity: number;
  subtotal: number;
  image_url?: string;
}

export interface IOrder {
  id: string;
  cafe_id: string;
  table_number: string;
  status: OrderStatus;
  customer_name?: string;
  customer_phone?: string;
  special_instructions?: string;
  items: IOrderItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_status?: 'pending' | 'paid' | 'pay_at_counter';
  created_at: string;
  updated_at: string;
}

export interface IManagerUser {
  id: string;
  cafe_id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager' | 'cashier' | 'kitchen';
  token?: string;
}

export interface ISalesReport {
  today_sales: number;
  today_orders: number;
  pending_orders: number;
  preparing_orders: number;
  completed_orders: number;
  weekly_sales: number;
  monthly_sales: number;
  average_order_value: number;
  top_items: { name: string; count: number; revenue: number }[];
  daily_trends: { date: string; sales: number; orders: number }[];
}
