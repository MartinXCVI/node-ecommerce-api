/* MODULES IMPORTS */
import mongoose from 'mongoose'
import { Request, Response } from 'express'

/* INTERFACES IMPORTS */
import { MulterRequest } from '../interfaces/MulterRequest.js'
import { MulterFilesRequest } from '../interfaces/MulterFilesRequest.js'

/* MODELS IMPORTS */
import Category from "../models/Category.model.js"
import Product from "../models/Product.model.js"

/*---------------------*/
/*-- GET Controllers --*/

// @description: Get all products
// @route: /products
// @method: GET
export const getProducts = async (req: Request, res: Response): Promise<any> => {
  // Defaulting to 1st page and 10 products per page
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  // If page or limit are not positive numbers
  if(page < 1 || limit < 1) {
    return res.status(400).json({
      success: false,
      message: "Page and limit must be positive numbers",
    })
  }
  // Attempting to fetch all products
  try {
    // Fetching and storing products in a list
    // The populate() methods let's you reference documents in other collections
    const productsList = await Product.find().populate('category')
      .skip((page - 1) * limit) // Skipping products based on page
      .limit(limit) // Limiting number of results
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
    return res.status(200).json({
      success: true,
      message: "Products successfully retrieved",
      products: productsList,
      total: totalProducts,
      page: page,
      pages: Math.ceil(totalProducts / limit),
    })
  } catch(error: any) {
    console.error(`Error fetching products: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to fetch products",
      error: error.message || error,
    })
  }
} // End of getProducts


// @description: Get products by a single category
// @route: /products/by-category/:id
// @method: GET
export const getProductsByCategory = async (req: Request, res: Response): Promise<any> => {
  // Defaulting to 1st page and 10 products per page
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  // If page or limit are not positive numbers
  if(page < 1 || limit < 1) {
    return res.status(400).json({
      success: false,
      message: "Page and limit must be positive numbers",
    })
  }
  // Getting the id from the request parameters
  const categoryId = req.params.id
  // Attempting to get the product by category
  try {
    // Validating if the category ID is a valid MongoDB ObjectId
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
      .limit(limit) // Limiting number of results
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
    // Returning the products by category
    return res.status(200).json({
      success: true,
      message: "Products successfully retrieved by category",
      products: productsList,
      total: totalProducts,
      page: page,
      pages: Math.ceil(totalProducts / limit),
    })
  } catch(error: any) {
    console.error(`Error fetching products by category: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve products by category",
      error: error.message || error,
    })
  }
} // End of getProductsByCategory


// @description: Get a product by id
// @route: /products/:id
// @method: GET
export const getProduct = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
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
    // Returning the product by id
    return res.status(200).json({
      success: true,
      message: `Product ${product.name || product._id} successfully retrieved`,
      product: product
    })
  } catch(error: any) {
    console.error(`Error retrieving product with ID '${productId}': ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve product by ID",
      error: error.message || error
    })
  }
} // End of getProduct


// @description: Get products count
// @route: /products/get/count
// @method: GET
export const getProductsCount = async (req: Request, res: Response): Promise<any> => {
  // Attempting to get the products count
  try {
    // Counting the products number
    const productCount = await Product.countDocuments()
    // Returning the products count
    return res.status(200).json({
      success: true,
      message: `Products count successfully retrieved`,
      count: productCount
    })
  } catch(error: any) {
    console.error(`Error counting products: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve the products count",
      error: error.message || error
    })
  }
} // End of getProductsCount


// @description: Get featured products
// @route: /products/get/featured
// @method: GET
export const getFeaturedProducts = async (req: Request, res: Response): Promise<any> => {
  // Getting the count from the request parameters
  const count = req.params.count ? Number(req.params.count) : 0 // Defaults to 0 if no count is set
  // Attempting to get the featured products
  try {
    // Fetching the featured products
    const featuredProducts = await Product
      .find({ isFeatured: true })
      .limit(count) // Limiting the number of featured products
    // If not found or do not exist
    if(featuredProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured products were found"
      })
    }
    // Returning the featured products
    return res.status(200).json({
      success: true,
      message: `Featured products successfully retrieved`,
      featuredProducts: featuredProducts
    })
  } catch(error: any) {
    console.error(`Error retrieving featured products: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve featured products",
      error: error.message || error
    })
  }
} // End of getFeaturedProducts


/*----------------------*/
/*-- POST Controllers --*/


// @description: Create a product
// @route: /products
// @method: POST
export const createProduct = async (req: MulterRequest, res: Response): Promise<any> => {
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
    // Validating image file existence
    const file = req.file
    if(!file) {
      return res.status(400).json({
        success: false,
        message: "No image in the request"
      })
    }
    /* Getting the image name from the request and
    defining the path for the uploaded image(s) */
    const imageName = file.filename
    const uploadsPath = `${req.protocol}://${req.get('host')}/public/uploads`
    // Creating the product
    const product = new Product({
      name,
      description,
      richDescription,
      image: `${uploadsPath}/${imageName}`,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured
    })
    const createdProduct = await product.save()
    // Successful product creation
    return res.status(201).json({
      success: true,
      message: `Product ${createdProduct.name || createdProduct._id} successfully created`,
      product: createdProduct
    })
  } catch(error: any) {
    console.error(`Error creating product: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to create a product",
      error: error.message || error,
    })
  }
} // End of createProduct


// @description: Update a product
// @route: /products/:id
// @method: PUT
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
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
  // Attempting to update the product
  try {
    // Validating if the input category exists
    if(category) {
      const categoryExists = await Category.findById(category)
      if(!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category"
        })
      }
    }
    // Updating the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
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
      },
      { new: true } // Third param for returning the updated item
    ) 
    // If product not found
    if(!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found` || 'Product not found',
      })
    }
    // Returning success response with updated product
    return res.status(201).json({
      success: true,
      message: `Product ${updatedProduct.name || updatedProduct._id} successfully updated`,
      category: updatedProduct
    })
  } catch(error: any) {
    console.error(`Error updating product with ID '${productId}': ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to update product",
      error: error.message || error,
    })
  }
} // End of updateProduct


/*----------------------*/
/*-- PUT Controllers --*/


// @description: Update product gallery
// @route: /products/:id
// @method: PUT
export const updateProductGallery = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
  const productId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    })
  }
  // Getting the images from the request
  const images = req.files as Express.Multer.File[]
  // Validating images files existence
  if(!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No images in the request"
    })
  }
  // Initializing array of images paths
  let imagesPaths: string[] = []
  // Defining uploads path
  const uploadsPath = `${req.protocol}://${req.get('host')}/public/uploads`
  // Looping over the images
  images.map(image => {
    imagesPaths.push(`${uploadsPath}/${image.filename}`)
  })
  // Attempting to update product gallery
  try {
    // Updating the product gallery
    const product = await Product.findByIdAndUpdate(
      productId,
      { images: imagesPaths },
      { new: true } // Third param for returning the updated items
    )
    // If product not found
    if(!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found`,
      })
    }
    // Returning success response with updated product gallery
    return res.status(200).json({
      success: true,
      message: `Gallery of product ${product.name || productId} successfully updated`,
      product
    })
  } catch(error: any) {
    console.error(
      `Error updating gallery of product with ID '${productId}': ${error.message || error}`,
      { uploadedFiles: images.map(img => img.filename) }
    )
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to update product gallery",
      error: error.message || error,
    })
  }
} // End of updateProductGallery


/*------------------------*/
/*-- DELETE Controllers --*/


// @description: Delete a product by id
// @route: /products/:id
// @method: DELETE
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
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
    // Deleting the product
    const deletedProduct = await Product.findByIdAndDelete(productId)
    // If not found or does not exist
    if(!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found` || 'Product not found',
      })
    }
    // Successfully deleted
    return res.status(200).json({
      success: true,
      message: `Product '${deletedProduct.name || deletedProduct._id}' successfully deleted`,
    })
  } catch(error: any) {
    console.error(`Error deleting product with ID '${productId}': ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to delete a product",
      error: error.message || error,
    })
  }
} // End of deleteProduct