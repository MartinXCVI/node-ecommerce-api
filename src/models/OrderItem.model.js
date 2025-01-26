import mongoose from "mongoose"

const OrderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
})

const OrderItem = mongoose.model("OrderItem", OrderItemSchema) // Schema defined as Order

export default OrderItem