/* MODULE IMPORTS */
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import connectDB from './config/dbConnection.js'
import { apiUrl } from './utils/apiUrl.js'
import cors from 'cors'
import { authJwt } from './middlewares/authJwt.js'
import { validateEnvVariables } from './utils/validateEnvVariables.js'
import cookieParser from 'cookie-parser'

/* ROUTES IMPORTS */
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import usersRoutes from './routes/users.routes.js'

/* ENVIRONMENT SETUP */
// Making environment variables available throughout the app
dotenv.config()
// Validating environment variables
validateEnvVariables()

/* EXPRESS APP INITIALIZATION */
const app = express()
const PORT: number = Number(process.env.PORT || 3000)

/* MIDDLEWARES */
// Implementation of CORS
app.use(cors())
app.options('*', cors())
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
const startServer = async (): Promise<void> => {
  // Attempting to connect to DB and start the server
  try {
    await connectDB() // Database connection invoked
    app.listen(PORT, ()=> {
      console.log(`Server listening on port ${PORT}...`)
    })
  } catch(error: any) {
    console.error(`Error while attempting to start the server: ${error.message || error}`)
    process.exit(1)
  }
}

startServer()