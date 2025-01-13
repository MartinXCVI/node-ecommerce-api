import express from 'express'
import { getProducts, createProduct } from '../controllers/products.controller.js'

const router = express.Router()

router.get('/products', getProducts)
router.post('/products', createProduct)

export default router