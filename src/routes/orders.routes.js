import express from 'express'
import { getOrders } from '../controllers/orders.controller.js'

const router = express.Router()

router.get('/orders', getOrders)

export default router