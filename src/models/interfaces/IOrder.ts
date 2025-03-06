import mongoose, { Document } from 'mongoose'

export interface IOrder extends Document {
  orderItems: mongoose.Types.ObjectId[];
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice?: number;
  user?: mongoose.Types.ObjectId;
  dateOrdered: Date;
}