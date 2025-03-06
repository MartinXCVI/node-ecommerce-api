import mongoose, { Schema, model } from "mongoose";
const OrderItemSchema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});
const OrderItem = model("OrderItem", OrderItemSchema); // Schema defined as OrderItem
export default OrderItem;
