import mongoose, { Document } from 'mongoose'

export interface IProduct extends Document {
  name: string;
  description: string;
  richDescription?: string;
  image?: string;
  images?: string[];
  brand?: string;
  price: number;
  category: mongoose.Types.ObjectId;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated: Date;
}