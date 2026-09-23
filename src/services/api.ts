import { Product, User, Order, Category, AdminStats, AIRecommendation } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('rerok_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export const api = {
  // Auth
  async register(body: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) {
    return request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async login(body: { email: string; password: string }) {
    return request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async getMe() {
    return request<{ user: User }>('/auth/me');
  },

  // Products
  async getProducts(params: {
    category?: string;
    brand?: string;
    model?: string;
    search?: string;
    sort?: string;
  } = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.brand && params.brand !== 'All') query.set('brand', params.brand);
    if (params.model) query.set('model', params.model);
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ products: Product[]; count: number }>(`/products${qs}`);
  },

  async getProductById(id: string) {
    return request<{ product: Product; related: Product[] }>(`/products/${id}`);
  },

  async searchProducts(q: string) {
    return request<{ products: Product[]; count: number; query: string }>(`/products/search?q=${encodeURIComponent(q)}`);
  },

  async getCompatibleProducts(model: string) {
    return request<{ model: string; products: Product[]; count: number; message: string }>(
      `/products/compatible/${encodeURIComponent(model)}`
    );
  },

  async getBrandsAndModels() {
    return request<{ brandsAndModels: Record<string, string[]> }>('/products/compatibility/brands-and-models');
  },

  // Categories
  async getCategories() {
    return request<{ categories: Category[] }>('/categories');
  },

  // Orders
  async createOrder(body: {
    items: Array<{ product: string; name: string; price: number; image: string; quantity: number; selectedModel?: string }>;
    shippingAddress: any;
    paymentMethod: 'COD' | 'Online';
  }) {
    return request<{ message: string; orderId: string; order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async getMyOrders() {
    return request<{ orders: Order[] }>('/orders/my-orders');
  },

  async getOrderById(id: string) {
    return request<{ order: Order }>(`/orders/${id}`);
  },

  // AI Recommendation
  async getRecommendations(body: {
    brand?: string;
    model?: string;
    requirement?: string;
    budget?: number | string;
    category?: string;
  }) {
    return request<{ summaryHeadline: string; recommendations: AIRecommendation[] }>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // Admin APIs
  async getAdminStats() {
    return request<AdminStats>('/admin/stats');
  },

  async getAllAdminOrders() {
    return request<{ orders: Order[]; count: number }>('/admin/orders');
  },

  async updateOrderStatus(id: string, status: string) {
    return request<{ message: string; order: Order }>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async updateProductStock(id: string, stock: number) {
    return request<{ message: string; product: Product }>(`/admin/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock })
    });
  },

  async getAllCustomers() {
    return request<{ customers: any[] }>('/admin/users');
  },

  async createProduct(data: any) {
    return request<{ message: string; product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProduct(id: string, data: any) {
    return request<{ message: string; product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteProduct(id: string) {
    return request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  async createCategory(data: { name: string; description?: string }) {
    return request<{ message: string; category: Category }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
