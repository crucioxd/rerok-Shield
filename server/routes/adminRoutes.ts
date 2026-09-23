import { Router } from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  updateProductStock,
  getAllCustomers,
  getAdminStats,
  getCategories,
  createCategory
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllCustomers);
router.put('/products/:id/stock', updateProductStock);
router.get('/categories', getCategories);
router.post('/categories', createCategory);

export default router;
