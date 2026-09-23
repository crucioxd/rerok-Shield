import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedModel?: string;
}

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  orderStatus: 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.Mixed, required: true },
  items: [
    {
      product: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      selectedModel: { type: String }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
