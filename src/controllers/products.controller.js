/* MODELS IMPORTS */
import Product from "../models/Product.model.js"

// @description: Get all products
// @route: /products
// @method: GET
export const getProducts = async (req, res)=> {
  try {
    // Fetching all products
    const productList = await Product.find()
    // Returning the products
    res.send(productList)
  } catch(error) {
    console.error(error)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
}

// @description: Create a product
// @route: /products
// @method: POST
export const createProduct = async (req, res)=> {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch(error) {
    console.error(error)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
}