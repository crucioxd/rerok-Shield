import { Response } from 'express';
import { db } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required to place an order.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Complete shipping address is required.' });
    }

    // Calculate subtotal & delivery
    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const delivery = subtotal >= 499 ? 0 : 49;
    const totalAmount = subtotal + delivery;

    const paymentStatus = paymentMethod === 'Online' ? 'Completed' : 'Pending';

    const order = await db.createOrder({
      user: req.user ? req.user._id : 'guest-order',
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus,
      orderStatus: 'Processing',
      totalAmount
    });

    return res.status(201).json({
      message: 'Order placed successfully!',
      orderId: order.orderId,
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Your order could not be placed. Please try again.' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const orders = await db.getOrdersByUser(req.user._id);
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load orders.' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await db.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Allow user to view their own order or admin to view any order
    if (req.user && req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load order details.' });
  }
};
