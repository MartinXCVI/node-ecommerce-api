/* MODULE IMPORTS */
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

// Making environment variables available throughout the app
dotenv.config()
// Initializing app as an instance of Express
const app = express()
// Port defined
const PORT = process.env.PORT || 3000
// API URL defined
const api = process.env.API_URL

/* MIDDLEWARES */
// Parse incoming request bodies
app.use(bodyParser.json())

/* HTTP METHODS */

app.get(`${api}/products`, (req, res)=> {
  const product = {
    id: 1,
    name: "Hair dresser",
    image: 'some_url'
  }
  res.send(product)
})

app.post(`${api}/products`, (req, res)=> {
  const newProduct = req.body
  console.log(newProduct)
  res.send(newProduct)
})

/* SERVER LISTENER */
app.listen(PORT, ()=> {
  console.log(api)
  console.log(`Server listening on port ${PORT}...`)
})
