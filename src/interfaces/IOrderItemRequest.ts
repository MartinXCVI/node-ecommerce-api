import mongoose from "mongoose"

export interface IOrderItemRequest {
  quantity: number
  product: mongoose.Types.ObjectId
}