import express from 'express'
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller.js'

const router = express.Router()

/* GET routes */
// Getting all categories
router.get('/categories', getCategories)
// Getting a category by id
router.get('/categories/:id', getCategory)

/* POST routes */
// Creating a category
router.post('/categories', createCategory)

/* PUT routes */
// Updating a category by id
router.put('/categories/:id', updateCategory)

/* DELETE routes */
// Deleting a category by id
router.delete('/categories/:id', deleteCategory)

export default router