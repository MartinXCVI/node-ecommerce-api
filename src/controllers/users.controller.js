import User from '../models/User.model.js'

export const getUsers = async (req, res)=> {
  try {
    // Fetching all users
    const usersList = await User.find()
    // Returning the users
    res.send(usersList)
  } catch(error) {
    console.error(error)
    res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
}