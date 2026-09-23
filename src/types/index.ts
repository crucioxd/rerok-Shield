export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  brand: string;
  compatibleModels: string[];
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  features?: string[];
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedModel: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedModel?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: string | any;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  orderStatus: 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  salesBreakdown: Array<{ label: string; revenue: number; orders: number }>;
}

export interface AIRecommendation {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  brand: string;
  compatibleModels: string[];
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  matchScore: number;
  aiReasons: string[];
}
