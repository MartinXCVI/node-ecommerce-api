import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  countInStock: {
    type: Number,
    required: true
  }
})

const Product = mongoose.model("Product", ProductSchema) // Schema defined as Product

export default Product