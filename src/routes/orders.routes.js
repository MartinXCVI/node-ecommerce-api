import express from 'express'
import { createOrder, deleteOrder, getOrder, getOrders, getUserOrders, getOrdersCount, getTotalSalesSum, updateOrder } from '../controllers/orders.controller.js'

const router = express.Router()

/* GET routes */
// Getting all the orders
router.get('/orders', getOrders)
// Getting an order by id
router.get('/orders/:id', getOrder)
// Getting the total sales sum
router.get('/orders/get/totalsales', getTotalSalesSum)
// Getting the orders count
router.get('/orders/get/count', getOrdersCount)
// Getting all user orders by user id
router.get('/orders/get/userorders/:id', getUserOrders)

/* POST routes */
// Creating an order
router.post('/orders', createOrder)

/* PUT routes */
// Updating an order by id
router.put('/orders/:id', updateOrder)

/* DELETE routes */
// Deleting an order by id
router.delete('/orders/:id', deleteOrder)

export default router