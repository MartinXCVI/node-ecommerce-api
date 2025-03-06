import { Document } from 'mongoose'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  isAdmin: boolean;
  street?: string;
  apartment?: string;
  zip?: string;
  city?: string;
  country?: string;
}