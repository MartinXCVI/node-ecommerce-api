import { Schema, model } from 'mongoose'
import { ICategory } from './interfaces/ICategory'

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  }
})

const Category = model<ICategory>("Category", CategorySchema) // Schema defined as Category

export default Category
export type { ICategory }