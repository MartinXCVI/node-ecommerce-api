import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({

})

const Order = mongoose.model("Order", OrderSchema) // Schema defined as Order

export default Order