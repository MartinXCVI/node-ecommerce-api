import mongoose, { Schema, model } from "mongoose"
import { IOrderItem } from "./interfaces/IOrderItem"

const OrderItemSchema = new Schema<IOrderItem>({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
})

const OrderItem = model<IOrderItem>("OrderItem", OrderItemSchema) // Schema defined as OrderItem

export default OrderItem
export type { IOrderItem }