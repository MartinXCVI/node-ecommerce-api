import Order from '../models/Order.model.js'

export const getOrders = async (req, res)=> {
  try {
    // Fetching all orders
    const ordersList = await Order.find()
    // Returning the orders
    res.send(ordersList)
  } catch(error) {
    console.error(error)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
}