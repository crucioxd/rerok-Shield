import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Order creation can be completed by logged-in users or guest checkout
router.post('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req as any, res, next);
  }
  next();
}, createOrder);

router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);

export default router;
