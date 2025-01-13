/* MODULE IMPORTS */
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import connectDB from './config/dbConnection.js'
import { apiUrl } from './utils/apiUrl.js'

/* ROUTES IMPORTS */
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import usersRoutes from './routes/users.routes.js'

// Making environment variables available throughout the app
dotenv.config()
// Initializing app as an instance of Express
const app = express()
// Port defined
const PORT = process.env.PORT || 3000

/* MIDDLEWARES */
// Parse incoming request bodies
app.use(bodyParser.json())
// Display of log requests
app.use(morgan('tiny')) // 'tiny' for a minimal output

/* ROUTES */
app.use(`${apiUrl}`, productsRoutes)
app.use(`${apiUrl}`, categoriesRoutes)
app.use(`${apiUrl}`, ordersRoutes)
app.use(`${apiUrl}`, usersRoutes)

/* SERVER LISTENER */
app.listen(PORT, ()=> {
  connectDB() // Database connection invoked
  console.log(`Server listening on port ${PORT}...`)
})
