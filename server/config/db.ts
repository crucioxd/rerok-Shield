import mongoose from 'express';
import mongoosePackage from 'mongoose';
import fs from 'fs';
import path from 'path';
import { sampleCategories, sampleProducts, sampleUsers, sampleOrders, getHashedPassword } from '../seed/seedData';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import { OrderModel } from '../models/Order';

export interface DataStore {
  users: any[];
  products: any[];
  categories: any[];
  orders: any[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

class DatabaseManager {
  private isMongo = false;
  private store: DataStore = {
    users: [],
    products: [],
    categories: [],
    orders: []
  };

  async init() {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      try {
        console.log(`[Database] Attempting connection to MongoDB at ${mongoUri.replace(/:[^:@]+@/, ':****@')}...`);
        await mongoosePackage.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        this.isMongo = true;
        console.log('[Database] Connected to MongoDB successfully.');
        await this.checkAndSeedMongo();
        return;
      } catch (err) {
        console.warn('[Database] Could not connect to MongoDB URI. Falling back to local embedded data store.');
      }
    }

    // Fallback: Local file-backed database store
    this.initLocalStore();
  }

  private initLocalStore() {
    this.isMongo = false;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.store = JSON.parse(raw);
        console.log(`[Database] Loaded local embedded database (${this.store.products.length} products, ${this.store.orders.length} orders).`);
      } else {
        console.log('[Database] Initializing new embedded database with seed data...');
        this.seedLocalStore();
      }
    } catch (e) {
      console.warn('[Database] Error loading local db.json, re-seeding memory store', e);
      this.seedLocalStore();
    }
  }

  async seedLocalStore() {
    const hashedAdminPwd = await getHashedPassword('Admin@123');
    const hashedUserPwd = await getHashedPassword('User@123');

    const users = sampleUsers.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      password: u.role === 'admin' ? hashedAdminPwd : hashedUserPwd,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt
    }));

    this.store = {
      users,
      products: JSON.parse(JSON.stringify(sampleProducts)),
      categories: JSON.parse(JSON.stringify(sampleCategories)),
      orders: JSON.parse(JSON.stringify(sampleOrders))
    };

    this.saveLocalStore();
    console.log('[Database] Seeded embedded database successfully with demo users, products, and categories.');
  }

  private saveLocalStore() {
    if (this.isMongo) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to persist data to db.json', err);
    }
  }

  private async checkAndSeedMongo() {
    try {
      const count = await ProductModel.countDocuments();
      if (count === 0) {
        console.log('[Database] MongoDB has 0 products. Auto-seeding initial data...');
        const hashedAdminPwd = await getHashedPassword('Admin@123');
        const hashedUserPwd = await getHashedPassword('User@123');

        for (const cat of sampleCategories) {
          await CategoryModel.create({ name: cat.name, description: cat.description });
        }

        for (const u of sampleUsers) {
          await UserModel.create({
            name: u.name,
            email: u.email,
            password: u.role === 'admin' ? hashedAdminPwd : hashedUserPwd,
            phone: u.phone,
            role: u.role
          });
        }

        for (const p of sampleProducts) {
          await ProductModel.create(p);
        }

        for (const o of sampleOrders) {
          await OrderModel.create(o);
        }
        console.log('[Database] MongoDB seeded successfully.');
      }
    } catch (e) {
      console.error('[Database] Error checking/seeding Mongo:', e);
    }
  }

  // --- REPOSITORY METHODS ---

  // USERS
  async findUserByEmail(email: string) {
    if (this.isMongo) {
      return UserModel.findOne({ email: email.toLowerCase() });
    }
    return this.store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id: string) {
    if (this.isMongo) {
      return UserModel.findById(id);
    }
    return this.store.users.find(u => String(u._id) === String(id)) || null;
  }

  async createUser(userData: any) {
    if (this.isMongo) {
      return UserModel.create(userData);
    }
    const newUser = {
      _id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...userData,
      createdAt: new Date()
    };
    this.store.users.push(newUser);
    this.saveLocalStore();
    return newUser;
  }

  async getAllUsers() {
    if (this.isMongo) {
      return UserModel.find({}, '-password').sort({ createdAt: -1 });
    }
    return this.store.users.map(({ password, ...u }) => u);
  }

  // PRODUCTS
  async getProducts(filter: {
    category?: string;
    brand?: string;
    model?: string;
    search?: string;
    sort?: string;
  } = {}) {
    if (this.isMongo) {
      const query: any = {};
      if (filter.category && filter.category !== 'All') {
        query.category = filter.category;
      }
      if (filter.brand && filter.brand !== 'All') {
        query.brand = filter.brand;
      }
      if (filter.model) {
        query.compatibleModels = { $in: [filter.model] };
      }
      if (filter.search) {
        const regex = new RegExp(filter.search, 'i');
        query.$or = [
          { name: regex },
          { brand: regex },
          { category: regex },
          { compatibleModels: regex }
        ];
      }

      let q = ProductModel.find(query);
      if (filter.sort === 'price-low') q = q.sort({ price: 1 });
      else if (filter.sort === 'price-high') q = q.sort({ price: -1 });
      else if (filter.sort === 'rating') q = q.sort({ rating: -1 });
      else if (filter.sort === 'popular') q = q.sort({ reviews: -1 });
      else q = q.sort({ featured: -1, createdAt: -1 });

      return q.exec();
    }

    // Embedded store filtering
    let results = [...this.store.products];

    if (filter.category && filter.category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter.brand && filter.brand !== 'All') {
      results = results.filter(p => p.brand.toLowerCase() === filter.brand!.toLowerCase());
    }
    if (filter.model) {
      results = results.filter(p =>
        p.compatibleModels?.some((m: string) => m.toLowerCase().includes(filter.model!.toLowerCase()))
      );
    }
    if (filter.search) {
      const term = filter.search.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.compatibleModels?.some((m: string) => m.toLowerCase().includes(term))
      );
    }

    if (filter.sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (filter.sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (filter.sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filter.sort === 'popular') {
      results.sort((a, b) => b.reviews - a.reviews);
    } else {
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return results;
  }

  async getProductById(id: string) {
    if (this.isMongo) {
      return ProductModel.findById(id);
    }
    return this.store.products.find(p => String(p._id) === String(id)) || null;
  }

  async createProduct(productData: any) {
    if (this.isMongo) {
      return ProductModel.create(productData);
    }
    const newProduct = {
      _id: `prod-${Date.now()}`,
      ...productData,
      rating: productData.rating || 4.8,
      reviews: productData.reviews || 1,
      createdAt: new Date()
    };
    this.store.products.unshift(newProduct);
    this.saveLocalStore();
    return newProduct;
  }

  async updateProduct(id: string, updateData: any) {
    if (this.isMongo) {
      return ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = this.store.products.findIndex(p => String(p._id) === String(id));
    if (idx === -1) return null;
    this.store.products[idx] = { ...this.store.products[idx], ...updateData };
    this.saveLocalStore();
    return this.store.products[idx];
  }

  async deleteProduct(id: string) {
    if (this.isMongo) {
      return ProductModel.findByIdAndDelete(id);
    }
    const idx = this.store.products.findIndex(p => String(p._id) === String(id));
    if (idx === -1) return false;
    this.store.products.splice(idx, 1);
    this.saveLocalStore();
    return true;
  }

  // CATEGORIES
  async getCategories() {
    if (this.isMongo) {
      return CategoryModel.find().sort({ name: 1 });
    }
    return this.store.categories;
  }

  async createCategory(categoryData: any) {
    if (this.isMongo) {
      return CategoryModel.create(categoryData);
    }
    const newCat = {
      _id: `cat-${Date.now()}`,
      ...categoryData,
      createdAt: new Date()
    };
    this.store.categories.push(newCat);
    this.saveLocalStore();
    return newCat;
  }

  // ORDERS
  async createOrder(orderData: any) {
    if (this.isMongo) {
      return OrderModel.create(orderData);
    }
    const orderCount = this.store.orders.length + 126;
    const orderId = orderData.orderId || `REROK-2026-${String(orderCount).padStart(5, '0')}`;
    const newOrder = {
      _id: `ord-${Date.now()}`,
      ...orderData,
      orderId,
      createdAt: new Date()
    };
    this.store.orders.unshift(newOrder);

    // Decrement stock for ordered items
    if (Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const prod = this.store.products.find(p => String(p._id) === String(item.product));
        if (prod && prod.stock >= item.quantity) {
          prod.stock -= item.quantity;
        }
      }
    }

    this.saveLocalStore();
    return newOrder;
  }

  async getOrdersByUser(userId: string) {
    if (this.isMongo) {
      return OrderModel.find({ user: userId }).sort({ createdAt: -1 });
    }
    return this.store.orders
      .filter(o => String(o.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllOrders() {
    if (this.isMongo) {
      return OrderModel.find().sort({ createdAt: -1 });
    }
    return [...this.store.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string) {
    if (this.isMongo) {
      return OrderModel.findOne({ $or: [{ _id: id }, { orderId: id }] });
    }
    return (
      this.store.orders.find(o => String(o._id) === String(id) || o.orderId === id) || null
    );
  }

  async updateOrderStatus(id: string, status: string) {
    if (this.isMongo) {
      return OrderModel.findOneAndUpdate(
        { $or: [{ _id: id }, { orderId: id }] },
        { orderStatus: status },
        { new: true }
      );
    }
    const order = this.store.orders.find(o => String(o._id) === String(id) || o.orderId === id);
    if (!order) return null;
    order.orderStatus = status;
    this.saveLocalStore();
    return order;
  }

  // STATS FOR ADMIN
  async getAdminStats() {
    const products = await this.getProducts();
    const orders = await this.getAllOrders();
    const users = await this.getAllUsers();

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const completedOrders = orders.filter((o: any) => o.orderStatus === 'Delivered').length;
    const pendingOrders = orders.filter((o: any) => o.orderStatus === 'Processing').length;

    // Monthly or weekly sales buckets
    const salesBreakdown = [
      { label: 'Mon', revenue: 1240, orders: 4 },
      { label: 'Tue', revenue: 1980, orders: 6 },
      { label: 'Wed', revenue: 2450, orders: 8 },
      { label: 'Thu', revenue: 3120, orders: 9 },
      { label: 'Fri', revenue: 4290, orders: 13 },
      { label: 'Sat', revenue: 5180, orders: 16 },
      { label: 'Sun', revenue: 4620, orders: 14 }
    ];

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: users.filter((u: any) => u.role === 'customer').length,
      totalRevenue,
      completedOrders,
      pendingOrders,
      salesBreakdown
    };
  }
}

export const db = new DatabaseManager();
