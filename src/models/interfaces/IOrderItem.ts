import mongoose, { Document } from 'mongoose'

export interface IOrderItem extends Document {
  quantity: number;
  product: mongoose.Types.ObjectId;
}