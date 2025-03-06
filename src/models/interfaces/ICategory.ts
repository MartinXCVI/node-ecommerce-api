import { Document } from "mongoose"

export interface ICategory extends Document {
  name: string;
  icon: string;
  color: string;
}