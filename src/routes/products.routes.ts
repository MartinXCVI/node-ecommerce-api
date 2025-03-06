import express from 'express'
// Import of products controllers
import { getProducts, getProduct, getProductsCount,
  getFeaturedProducts, getProductsByCategory, createProduct,
  updateProduct, deleteProduct, updateProductGallery 
} from '../controllers/products.controller.js'
// Import of helper function to upload image(s)
import { uploadImage } from '../helpers/uploadImage.js'

const router = express.Router()

/* GET routes */
// Getting all products
router.get('/products', getProducts)
// Getting a product by id
router.get('/products/:id', getProduct)
// Getting all products count
router.get('/products/get/count', getProductsCount)
// Getting all products of a single category
router.get('/products/by-category/:id', getProductsByCategory);
// Getting featured products by count
router.get('/products/get/featured/:count', getFeaturedProducts)

/* POST routes */
// Create a new product
router.post('/products', uploadImage.single('image'), createProduct)

/* PUT routes */
// Updating a product by id
router.put('/products/:id', updateProduct)
// Updating product gallery by id
router.put('/products/gallery-images/:id', uploadImage.array('images', 10), updateProductGallery)

/* DELETE routes */
// Deleting a product by id
router.delete('/products/:id', deleteProduct)

export default router