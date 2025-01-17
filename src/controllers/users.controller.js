/* MODELS IMPORTS */
import User from '../models/User.model.js'

/* MODULES IMPORTS */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// @description: Get all user
// @route: /users
// @method: GET
export const getUsers = async (req, res)=> {
  // Attempting to get all users
  try {
    // Fetching all users
    const usersList = await User.find().select("-password") // Excluding the passwords
    // Returning an empty array with a message if no categories exists
    if(usersList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        categories: [],
      })
    }
    // Returning the users
    res.status(200).json({
      success: true,
      message: "Users successfully retrieved",
      users: usersList
    })
  } catch(error) {
    console.error(`Error fetching users: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getUsers


// @description: Get a user by id
// @route: /users/:id
// @method: GET
export const getUser = async (req, res)=> {
  // Getting the id
  const userId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    })
  }
  // Attempting to get the user
  try {
    // Fetching the user by id
    const user = await User.findById(userId).select("-password") // Excluding the password
    // If not found or does not exist
    if(!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} was not found`,
      })
    }
    // Returning the user
    res.status(200).json({
      success: true,
      message: `User '${user.name || userId}' successfully retrieved`,
      user: user
    })
  } catch(error) {
    console.error(`Error retrieving user with ID '${userId}': ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getUser


// @description: Create a user
// @route: /users
// @method: POST
export const createUser = async (req, res)=> {
  // Getting the data from the body
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  } = req.body
  // Validating the request body
  if(!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "The following fields are required: name, email, password, phone",
    })
  }
  // Checking if the email already exists
  const existingUser = await User.findOne({ email })
  if(existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    })
  }
  // Hashing the password with bcrypt
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10 // defaults to 10 if not set
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(password, salt)
  // Attempting to create the user
  try {
    // Creating the user
    const user = new User({
      name,
      email,
      password: hashedPassword, // Assigning the hashed password to password
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    })
    const createdUser = await user.save()
    res.status(201).json({
      success: true,
      message: `User ${createdUser.name || createdUser} successfully created`,
      user: createdUser
    })
  } catch(error) {
    console.error(`Error creating user: ${error.message || error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of createCategory