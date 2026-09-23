import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
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
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  compatibleModels: [{ type: String, required: true }],
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
