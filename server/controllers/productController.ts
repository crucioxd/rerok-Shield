import { Request, Response } from 'express';
import { db } from '../config/db';
import { phoneBrandsAndModels } from '../seed/seedData';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, model, search, sort } = req.query;

    const products = await db.getProducts({
      category: category as string,
      brand: brand as string,
      model: model as string,
      search: search as string,
      sort: sort as string
    });

    return res.json({ products, count: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Unable to load products.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Find related products (same category or compatible with same model)
    const allProducts = await db.getProducts({ category: product.category });
    const related = allProducts
      .filter((p: any) => String(p._id) !== String(product._id))
      .slice(0, 4);

    return res.json({ product, related });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load product details.' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    if (!query.trim()) {
      return res.json({ products: [] });
    }
    const products = await db.getProducts({ search: query });
    return res.json({ products, count: products.length, query });
  } catch (error) {
    return res.status(500).json({ message: 'Error searching products.' });
  }
};

export const getCompatibleProducts = async (req: Request, res: Response) => {
  try {
    const { model } = req.params;
    if (!model) {
      return res.status(400).json({ message: 'Mobile model parameter is required.' });
    }
    const products = await db.getProducts({ model });
    return res.json({
      model,
      products,
      count: products.length,
      message: products.length > 0
        ? `Found ${products.length} compatible protective accessories for ${model}`
        : `No protection found specifically for ${model}.`
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking compatibility.' });
  }
};

export const getBrandsAndModels = async (_req: Request, res: Response) => {
  try {
    return res.json({ brandsAndModels: phoneBrandsAndModels });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving device directory.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      compatibleModels,
      image,
      stock,
      features,
      featured
    } = req.body;

    if (!name || !price || !category || !brand) {
      return res.status(400).json({ message: 'Name, price, category, and brand are required.' });
    }

    const numPrice = Number(price);
    const numOrig = Number(originalPrice || price);
    const discount = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

    const models = Array.isArray(compatibleModels)
      ? compatibleModels
      : (compatibleModels || '').split(',').map((s: string) => s.trim()).filter(Boolean);

    const newProduct = await db.createProduct({
      name,
      description: description || '',
      price: numPrice,
      originalPrice: numOrig,
      discount,
      category,
      brand,
      compatibleModels: models,
      image: image || '/src/assets/images/product_shield_pro_1790140269001.jpg',
      stock: Number(stock) || 10,
      rating: 4.8,
      reviews: 1,
      featured: Boolean(featured),
      features: Array.isArray(features) ? features : []
    });

    return res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Unable to create product.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    if (updateData.originalPrice && updateData.price && updateData.originalPrice > updateData.price) {
      updateData.discount = Math.round(((updateData.originalPrice - updateData.price) / updateData.originalPrice) * 100);
    }

    if (typeof updateData.compatibleModels === 'string') {
      updateData.compatibleModels = updateData.compatibleModels.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = await db.updateProduct(id, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product updated successfully.', product: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await db.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete product.' });
  }
};
