/* MODULES IMPORTS */
import mongoose from 'mongoose'

/* MODELS IMPORTS */
import Category from '../models/Category.model.js'


// @description: Get all categories
// @route: /categories
// @method: GET
export const getCategories = async (req, res)=> {
  try {
    // Fetching all categories
    const categoriesList = await Category.find()
    // Returning an empty array with a message if no categories exists
    if(categoriesList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No categories found",
        categories: [],
      })
    }
    // Returning the categories
    res.status(200).json({
      success: true,
      message: "Categories successfully retrieved",
      categories: categoriesList
    })
  } catch(error) {
    console.error(`Error fetching categories: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getCategories


// @description: Get a category by id
// @route: /categories/:id
// @method: GET
export const getCategory = async (req, res)=> {
  // Getting the id
  const categoryId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    })
  }
  // Attempting to get the category
  try {
    // Fetching the category by id
    const category = await Category.findById(categoryId)
    // If not found or does not exist
    if(!category) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryId} was not found`,
      })
    }
    // Returning the category
    res.status(200).json({
      success: true,
      message: `Category '${category.name || categoryId}' successfully retrieved`,
      category: category
    })
  } catch(error) {
    console.error(`Error retrieving category with ID '${categoryId}': ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getCategory


// @description: Create a category
// @route: /categories
// @method: POST
export const createCategory = async (req, res)=> {
  // Getting the data from the body
  const { name, icon, color } = req.body
  // Validating the request body
  if(!name || !icon || !color) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, icon, color) are required",
    })
  }
  // Attempting to create the category
  try {
    // Creating the category
    const category = new Category({ name, icon, color })
    const createdCategory = await category.save()
    res.status(201).json({
      success: true,
      message: `Category ${createdCategory.name || createdCategory} successfully created`,
      category: createdCategory
    })
  } catch(error) {
    console.error(`Error creating category: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of createCategory


// @description: Update a category
// @route: /categories/:id
// @method: PUT
export const updateCategory = async (req, res)=> {
  // Getting the id
  const categoryId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    })
  }
  // Getting the data from the body
  const { name, icon, color } = req.body
  // Attempting to update the category
  try {
    // Updating the category
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
      name: name,
      icon: icon,
      color: color,
    }, { new: true }) // Third param for returning the updated item
    // If category not found
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryId} not found`,
      })
    }
    // Returning success response with updated category
    res.status(201).json({
      success: true,
      message: `Category ${updatedCategory.name || updatedCategory._id} successfully updated`,
      category: updatedCategory
    })
  } catch(error) {
    console.error(`Error updating category with ID '${categoryId}': ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of updateCategory


// @description: Delete a category by id
// @route: /categories/:id
// @method: DELETE
export const deleteCategory = async (req, res)=> {
  // Getting the id
  const categoryId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    })
  }
  // Attempting to delete the category
  try {
    // Deleting the category 
    const deletedCategory = await Category.findByIdAndDelete(categoryId) 
    // If not found or does not exist
    if(!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryId} not found`,
      })
    }
    // Successfully deleted
    res.status(200).json({
      success: true,
      message: `Category '${deletedCategory.name || deletedCategory._id}' successfully deleted`,
    })
  } catch(error) {
    console.error(`Error deleting category with ID '${categoryId}': ${error.message || error}`)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
} // End of deleteCategory