import mongoose from "mongoose"

export interface OrderItemRequest {
  quantity: number
  product: mongoose.Types.ObjectId
}