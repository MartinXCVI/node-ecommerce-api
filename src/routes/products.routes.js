import express from 'express'
import { getProducts, getProduct, getProductsCount, getFeaturedProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'

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
router.post('/products', createProduct)

/* PUT routes */
router.put('/products/:id', updateProduct)

/* DELETE routes */
router.delete('/products/:id', deleteProduct)

export default router