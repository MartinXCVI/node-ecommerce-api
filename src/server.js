/* MODULE IMPORTS */
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import connectDB from './config/dbConnection.js'
import { apiUrl } from './utils/apiUrl.js'
import cors from 'cors'
import { authJwt } from './helpers/jwt.js'
import { validateEnvVariables } from './utils/validateEnvVariables.js'
import cookieParser from 'cookie-parser'

/* ROUTES IMPORTS */
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import usersRoutes from './routes/users.routes.js'


// Making environment variables available throughout the app
dotenv.config()
// Validating environment variables
validateEnvVariables()
// Initializing app as an instance of Express
const app = express()
// Port defined
const PORT = process.env.PORT || 3000
// Implementation of CORS
app.use(cors())
app.options('*', cors())

/* MIDDLEWARES */
// Parse incoming request bodies
app.use(bodyParser.json())
// Analyzes and extracts cookie data from HTTP requests
app.use(cookieParser())
// Display of log requests
app.use(morgan('tiny')) // 'tiny' for a minimal output
// Protecting the API
app.use(authJwt())
// For serving static files
app.use("/public/uploads", express.static("public/uploads"));

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
