/* MODULES IMPORTS */
import mongoose from 'mongoose'

/* MODELS IMPORTS */
import Category from "../models/Category.model.js"
import Product from "../models/Product.model.js"

// @description: Get all products
// @route: /products
// @method: GET
export const getProducts = async (req, res)=> {
  // Defaulting to 1st page and 10 products per page
  const { page = 1, limit = 10 } = req.query;
  try {
    // Fetching all products
    // The populate() methods let's you reference documents in other collections
    const productsList = await Product.find().populate('category')
      .skip((page - 1) * limit) // Skipping products based on page
      .limit(parseInt(limit)) // Limiting number of results
    // Getting the total number of products in DB
    const totalProducts = await Product.countDocuments()
    // Returning an empty array with a message if no products exist
    if(productsList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products: [],
        total: totalProducts
      })
    }
    // Returning the products
    res.status(200).json({
      success: true,
      message: "Products successfully retrieved",
      products: productsList,
      total: totalProducts,
      page: parseInt(page),
      pages: Math.ceil(totalProducts / limit),
    })
  } catch(error) {
    console.error(`Error fetching products: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getProducts


// @description: Get products by a single category
// @route: /products/by-category/:id
// @method: GET
export const getProductsByCategory = async (req, res)=> {
  // Defaulting to 1st page and 10 products per page
  const { page = 1, limit = 10 } = req.query
  // Getting the id
  const categoryId = req.params.id
  try {
    // Validating category ID
    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }
    // Fetching all products by category id
    const productsList = await Product
      .find({ category: categoryId }) // Finding product by category id
      .populate('category') // The populate() methods let's you reference documents in other collections
      .skip((page - 1) * limit) // Skipping products based on page
      .limit(parseInt(limit)) // Limiting number of results
    // Getting the total number of products by category in DB
    const totalProducts = await Product.countDocuments({ category: categoryId })
    // Returning an empty array with a message if no products exist
    if(productsList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products: [],
        total: totalProducts
      })
    }
    // Returning the products
    res.status(200).json({
      success: true,
      message: "Products successfully retrieved by category",
      products: productsList,
      total: totalProducts,
      page: parseInt(page),
      pages: Math.ceil(totalProducts / limit),
    })
  } catch(error) {
    console.error(`Error fetching products by category: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getProductsByCategory


// @description: Get a product by id
// @route: /products/:id
// @method: GET
export const getProduct = async (req, res)=> {
  // Getting the id
  const productId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    })
  }
  // Attempting to get the product
  try {
    // Fetching the product by id
    // The populate() methods let's you reference documents in other collections
    const product = await Product.findById(productId).populate('category')
    // If not found or does not exist
    if(!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} was not found`
      })
    }
    // Returning the category
    res.status(200).json({
      success: true,
      message: `Product ${product.name || product._id} successfully retrieved`,
      product: product
    })
  } catch(error) {
    console.error(`Error retrieving product with ID '${productId}': ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error
    })
  }
} // End of getProduct

// @description: Get products count
// @route: /products/get/count
// @method: GET
export const getProductsCount = async (req, res)=> {
  // Attempting to get the products count
  try {
    // Counting the products number
    const productCount = await Product.countDocuments()
    // Returning the category
    res.status(200).json({
      success: true,
      message: `Products count successfully retrieved`,
      count: productCount
    })
  } catch(error) {
    console.error(`Error counting products: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error
    })
  }
} // End of getProductsCount


// @description: Get featured products
// @route: /products/get/featured
// @method: GET
export const getFeaturedProducts = async (req, res)=> {
  // Getting the count
  const count = req.params.count ? req.params.count : 0
  // Attempting to get the featured products
  try {
    // Fetching the featured products
    const featuredProducts = await Product
      .find({ isFeatured: true })
      .limit(parseInt(count)) // Limiting the number of featured products
    // If not found or do not exist
    if(featuredProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured products were found"
      })
    }
    // Returning the featured products
    res.status(200).json({
      success: true,
      message: `Featured products successfully retrieved`,
      featuredProducts: featuredProducts
    })
  } catch(error) {
    console.error(`Error retrieving featured products: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error
    })
  }
} // End of getFeaturedProducts


// @description: Create a product
// @route: /products
// @method: POST
export const createProduct = async (req, res)=> {
  // Getting the data from the body
  const {
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured
   } = req.body
   // Validating the request body
   if(!name || !description || !category || !countInStock) {
    return res.status(400).json({
      success: false,
      message: "The following fields are required: name, description, category, countInStock"
    })
   }
   // Attempting to create the product
  try {
    // Validating if the category exists
    const categoryExists = await Category.findById(category)
    if(!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      })
    }
    // Creating the product
    const product = new Product({
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured
    })
    const createdProduct = await product.save()
    res.status(201).json({
      success: true,
      message: `Product ${createdProduct.name || createdProduct._id} successfully created`,
      product: createdProduct
    })
  } catch(error) {
    console.error(`Error creating product: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of createProduct


// @description: Update a product
// @route: /products/:id
// @method: PUT
export const updateProduct = async (req, res)=> {
  // Getting the id
  const productId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    })
  }
  // Getting the data from the body
  const {
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured
   } = req.body
   // Validating the request body
   if(!name || !description || !category || !countInStock) {
    return res.status(400).json({
      success: false,
      message: "The following fields are required: name, description, category, countInStock"
    })
   }
  // Attempting to update the product
  try {
    // Validating if the category exists
    const categoryExists = await Category.findById(category)
    if(!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      })
    }
    // Updating the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      name: name,
      description: description,
      richDescription: richDescription,
      image: image,
      brand: brand,
      price: price,
      category: category,
      countInStock: countInStock,
      rating: rating,
      numReviews: numReviews,
      isFeatured: isFeatured,
    }, { new: true }) // Third param for returning the updated item
    // If category not found
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${productId} not found`,
      })
    }
    // Returning success response with updated product
    res.status(201).json({
      success: true,
      message: `Category ${updatedProduct.name || updatedProduct._id} successfully updated`,
      category: updatedProduct
    })
  } catch(error) {
    console.error(`Error updating product with ID '${productId}': ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of updateProduct


// @description: Delete a product by id
// @route: /products/:id
// @method: DELETE
export const deleteProduct = async (req, res)=> {
  // Getting the id
  const productId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    })
  }
  // Attempting to delete the product
  try { 
    const deletedProduct = await Product.findByIdAndDelete(productId)
    // If not found or does not exist
    if(!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found`,
      })
    }
    // Successfully deleted
    res.status(200).json({
      success: true,
      message: `Product '${deletedProduct.name || deletedProduct._id}' successfully deleted`,
    })
  } catch(error) {
    console.error(`Error deleting product with ID '${productId}': ${error.message || error}`)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
} // End of deleteProduct