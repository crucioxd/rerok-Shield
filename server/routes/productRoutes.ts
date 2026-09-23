import { Router } from 'express';
import {
  getProducts,
  getProductById,
  searchProducts,
  getCompatibleProducts,
  getBrandsAndModels,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/compatibility/brands-and-models', getBrandsAndModels);
router.get('/compatible/:model', getCompatibleProducts);
router.get('/:id', getProductById);

// Admin-protected routes
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;
