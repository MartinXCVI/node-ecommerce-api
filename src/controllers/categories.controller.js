import Category from '../models/Category.model.js'

export const getCategories = async (req, res)=> {
  try {
    // Fetching all categories
    const categoriesList = await Category.find()
    // Returning the categories
    res.send(categoriesList)
  } catch(error) {
    console.error(error)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
}