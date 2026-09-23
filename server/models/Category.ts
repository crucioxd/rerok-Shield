import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
