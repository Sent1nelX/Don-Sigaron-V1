export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  quantity: number;
  in_stock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isBlocked: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}