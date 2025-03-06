/* MODULES IMPORTS */
import mongoose from 'mongoose'
import { Request, Response } from 'express'

/* INTERFACES IMPORTS */
import { OrderItemRequest } from '../interfaces/OrderItemRequest.js'

/* MODELS IMPORTS */
import Order from '../models/Order.model.js'
import OrderItem from '../models/OrderItem.model.js'

// @description: Get all orders
// @route: /orders
// @method: GET
export const getOrders = async (req: Request, res: Response): Promise<any> => {
  // Attempting to fetch all orders
  try {
    // Fetching all orders and storing them in a list
    // The populate() methods let's you reference documents in other collections
    const ordersList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1}) // Sorting by day of order, from newest to oldest
    // Returning an empty array with a message if no orders exists
    if(ordersList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        orders: []
      })
    }
    // Returning the orders
    return res.status(200).json({
      success: true,
      message: "Orders successfully retrieved",
      orders: ordersList
    })
  } catch(error: any) {
    console.error(`Error fetching orders: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve orders",
      error: error.message || error,
    })
  }
} // End of getOrders


// @description: Get an order by id
// @route: /orders
// @method: GET
export const getOrder = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
  const orderId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
    if(!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      })
    }
  // Attempting to get the order
  try {
    // Fetching the order by id
    // The populate() methods let's you reference documents in other collections
    const order = await Order.findById(orderId)
      .populate('user', 'name') // Getting the user id and name
      .populate({ 
        path: 'orderItems', populate: { // Getting the ordered items
          path: 'product', populate: 'category' // Getting the product data and category data
        } 
      })
    // If not found or does not exist
    if(!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} was not found`,
      })
    }
    // Returning the order
    return res.status(200).json({
      success: true,
      message: `Order with ID ${orderId} successfully retrieved`,
      order: order
    })
  } catch(error: any) {
    console.error(`Error fetching the order with ID ${orderId}: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve order",
      error: error.message || error,
    })
  }
} // End of getOrder


// @description: Get a user's orders list
// @route: /orders/get/userorders/:id
// @method: GET
export const getUserOrders = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
  const userId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    })
  }
  // Attempting to fetch all user's orders
  try {
    // Fetching all user's orders and storing them in a list
    // The populate() methods let's you reference documents in other collections
    const userOrdersList = await Order.find({ user: userId }).populate({
      path: 'orderItems',
      populate: { // Getting the ordered items
        path: 'product',
        populate: 'category' // Getting the product data and category data
      } 
    })
    .sort({'dateOrdered': -1}) // Sorting by day of order, from newest to oldest
    // Returning an empty array with a message if no user orders exists
    if(!userOrdersList || userOrdersList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user's orders found",
        userOrders: []
      })
    }
    // Returning the orders
    return res.status(200).json({
      success: true,
      message: "User's orders successfully retrieved",
      userOrders: userOrdersList
    })
  } catch(error: any) {
    console.error(`Error fetching orders for user with ID ${userId}: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve user's orders",
      error: error.message || error,
    })
  }
} // End of getUserOrders


// @description: Get total sales sum from orders
// @route: /get/totalsales
// method: GET
export const getTotalSalesSum = async (req: Request, res: Response): Promise<any> => {
  // Attempting to get the sum of total sales
  try {
    /* The aggregation groups all orders. Then it calculates
    the sum of the `totalPrice` field for all documents */
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null, // Use null because we don't need to group by a specific field
          totalSales: { $sum: '$totalPrice' } // Sum up the totalPrice values across all documents
        }
      }
    ]) // End of totalSales
    // If not found, does not exist or empty
    if(!totalSales || totalSales.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The order sales could not be generated",
        totalSalesSum: []
      })
    }
    // Accessing the total sales sum value and assigning it
    const totalSalesSum = totalSales[0]?.totalSales || 0
    // Successful retrieval
    return res.status(200).json({
      success: true,
      message: "Number of total sales successfully retrieved",
      totalSalesSum
    })
  } catch(error: any) {
    console.error(`Error fetching total sales: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve the total sales",
      error: error.message || error
    })
  }
} // End of getTotalSales


// @description: Get orders count
// @route: /orders/get/count
// @method: GET
export const getOrdersCount = async (req: Request, res: Response): Promise<any> => {
  // Attempting to get the orders count
  try {
    // Counting the orders number
    const ordersCount = await Order.countDocuments()
    // Returning the orders count
    return res.status(200).json({
      success: true,
      message: `Orders count successfully retrieved`,
      count: ordersCount
    })
  } catch(error: any) {
    console.error(`Error counting orders: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve the orders count",
      error: error.message || error
    })
  }
} // End of getOrdersCount


// @description: Create an order
// @route: /orders
// @method: POST
export const createOrder = async (req: Request, res: Response): Promise<any> => {
  // Getting order items id from order items in DB
  const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem: OrderItemRequest) => {
    // Creating a new order item
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })
    // Saving the new order item in DB
    newOrderItem = await newOrderItem.save()
    return newOrderItem._id
  }))
  // Storing the resolved order items ids
  const orderItemsIdsResolved = await orderItemsIds
  // Getting the total prices
  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
    // Iterating over each resolved order item ID to calculate its total price
    const orderItem = await OrderItem.findById(orderItemId)
      .populate<{ product: { price: number } }>('product', 'price') // The populate() methods let's you reference documents in other collections
    // Validating order item and order item product
    if(!orderItem) {
      throw new Error(`Order item not found: ${orderItemId}`)
    }
    if(!orderItem.product) {
      throw new Error(`Product not found for order item: ${orderItemId}`)
    }
    /* Calculating the total price of the current 'OrderItem' by multiplying the price
    of the associated product with the quantity in the order item. */
    const totalPrice = orderItem.product.price * orderItem.quantity
    return totalPrice // Returning total price of the current OrderItem to be included in the totalPrices array
  }))
  // Getting the total price
  /* Summing up all the individual total prices (stored in 'totalPrices' array) to calculate
  the overall total price for the entire order */
  const totalPrice = totalPrices.reduce((a, b)=> a + b, 0)
  /* The 'reduce' function iterates through the `totalPrices` array, adding up the values one by one,
  starting from 0 (the initial value for the accumulator) */

  // Getting the data from the body
  const {
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    user
  } = req.body
  // Validating the request body
  if(!shippingAddress1 || !city || !zip || !country || !phone || !status) {
    return res.status(400).json({
      success: false,
      message: "The following fields are required: shippingAddress1, city, zip, country, phone, status",
    })
  }
  // Attempting to create the order
  try {
    // Creating the order
    const order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice: totalPrice,
      user
    })
    // const createdOrder = order
    const createdOrder = await order.save()
    // Successful creation
    return res.status(201).json({
      success: true,
      message: `Order ${createdOrder.orderItems || createdOrder} successfully created`,
      order: createdOrder
    })
  } catch(error: any) {
    console.error(`Error creating order: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to create the order",
      error: error.message || error,
    })
  }
} // End of createOrder


// @description: Update an order
// @route: /orders/:id
// @method: PUT
export const updateOrder = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
  const orderId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    })
  }
  // Getting the data from the body
  const { status } = req.body
  // Attempting to update the order
  try {
    // Updating the order
    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      status: status
    }, { new: true }) // Third param for returning the updated item
    // If order not found
    if(!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found`,
      })
    }
    // Returning success response with updated category
    return res.status(201).json({
      success: true,
      message: `Order ${updatedOrder._id} successfully updated`,
      order: updatedOrder
    })
  } catch(error: any) {
    console.error(`Error updating order with ID '${orderId}': ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to update the order",
      error: error.message || error,
    })
  }
} // End of updateOrder


// @description: Delete an order by id
// @route: /orders/:id
// @method: DELETE
export const deleteOrder = async (req: Request, res: Response): Promise<any> => {
  // Getting the id from the request parameters
  const orderId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    })
  }
  // Attempting to delete the order
  try {
    // Deleting the order
    const deletedOrder = await Order.findByIdAndDelete(orderId)
    // If not found or does not exist
    if(!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found`,
      })
    }
    // Attempting to delete the order items
    try {
      await Promise.all(
        // Iterating through the associated order items and deleting them
        deletedOrder.orderItems.map(async (orderItemId) => {
          await OrderItem.findByIdAndDelete(orderItemId);
        })
      )
    } catch (error: any) {
      console.error(`Error while attempting to delete associated order items: ${error.message || error}`);
    }
    // Successfully deleted
    return res.status(200).json({
      success: true,
      message: `Order '${deletedOrder._id}' successfully deleted`,
    })
  } catch(error: any) {
    console.error(`Error deleting order with ID '${orderId}': ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error while attempting to delete order",
      error: error.message || error,
    })
  }
} // End of deleteOrder
