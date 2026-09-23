import { Request, Response } from 'express';
import { db } from '../config/db';

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await db.getAllOrders();
    return res.json({ orders, count: orders.length });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load orders list.' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await db.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ message: `Order status updated to ${status}.`, order: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update order status.' });
  }
};

export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ message: 'A valid non-negative stock count is required.' });
    }

    const updated = await db.updateProduct(id, { stock: Number(stock) });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Inventory updated successfully.', product: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update inventory.' });
  }
};

export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const users = await db.getAllUsers();
    const orders = await db.getAllOrders();

    // Map customer order counts
    const customersWithOrderCount = users.map((u: any) => {
      const userOrders = orders.filter((o: any) => String(o.user) === String(u._id));
      const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        orderCount: userOrders.length,
        totalSpent,
        joinedDate: u.createdAt
      };
    });

    return res.json({ customers: customersWithOrderCount });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load customer list.' });
  }
};

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const stats = await db.getAdminStats();
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to compute admin dashboard statistics.' });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve categories.' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    const cat = await db.createCategory({ name: name.trim(), description: description || '' });
    return res.status(201).json({ message: 'Category created.', category: cat });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create category.' });
  }
};
