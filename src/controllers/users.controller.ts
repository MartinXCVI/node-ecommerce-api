/* MODELS IMPORTS */
import User from '../models/User.model.js'

/* MODULES IMPORTS */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'


// @description: Get all user
// @route: /users
// @method: GET
export const getUsers = async (req: Request, res: Response): Promise<any> => {
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
    return res.status(200).json({
      success: true,
      message: "Users successfully retrieved",
      users: usersList
    })
  } catch(error: any) {
    console.error(`Error fetching users: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getUsers


// @description: Get users count
// @route: /users/get/count
// @method: GET
export const getUsersCount = async (req: Request, res: Response): Promise<any> => {
  // Attempting to get the users count
  try {
    // Counting the users number
    const usersCount = await User.countDocuments()
    // Returning the users count
    return res.status(200).json({
      success: true,
      message: `Users count successfully retrieved`,
      count: usersCount
    })
  } catch(error: any) {
    console.error(`Error counting users: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error
    })
  }
} // End of getProductsCount


// @description: Get a user by id
// @route: /users/:id
// @method: GET
export const getUser = async (req: Request, res: Response): Promise<any> => {
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
    return res.status(200).json({
      success: true,
      message: `User '${user.name || userId}' successfully retrieved`,
      user: user
    })
  } catch(error: any) {
    console.error(`Error retrieving user with ID '${userId}': ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of getUser


// @description: Create a user
// @route: /users
// @method: POST
export const createUser = async (req: Request, res: Response): Promise<any> => {
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
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10 // defaults to 10 if not set
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
    // Successful user creation
    return res.status(201).json({
      success: true,
      message: `User ${createdUser.name || createdUser} successfully created`,
      user: createdUser
    })
  } catch(error: any) {
    console.error(`Error creating user: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of createUser


// @description: Delete a user by id
// @route: /users/:id
// @method: DELETE
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  // Getting the id
  const userId = req.params.id
  // Validating if the provided ID is a valid MongoDB ObjectId
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    })
  }
  // Attempting to delete the user
  try {
    const deletedUser = await User.findByIdAndDelete(userId)
    // If not found or does not exist
    if(!deletedUser) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`,
      })
    }
    // Successfully deleted
    return res.status(200).json({
      success: true,
      message: `User '${deletedUser.name || deletedUser._id}' successfully deleted`,
    })
  } catch(error: any) {
    console.error(`Error deleting user with ID '${userId}': ${error.message || error}`)
    return res.status(500).json({
      error: error.message || error,
      success: false
    })
  }
} // End of deleteUser


// @description: Login the user by email
// @route: /users/login
// @method: POST
export const userLogin = async (req: Request, res: Response): Promise<any> => {
  // Getting the data from the body
  const { email, password } = req.body
  try {
    // Searching the user by email
    const user = await User.findOne({ email })
    // If not found or does not exist
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or does not exist",
      })
    }
    // Comparing the input password with the user hashed password in DB
    const passwordsMatch = bcrypt.compareSync(password, user.password)
    // If passwords do not match
    if(!passwordsMatch) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid credentials"
      })
    }
    // Defining access token secret
    const secret = process.env.ACCESS_TOKEN_SECRET
    // Defining refresh token secret
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET
    // Validating tokens
    if(!secret || !refreshSecret) {
      return res.status(500).json({
        success: false,
        message: "JWT secrets are missing in environment variables",
      })
    }
    // Generating access token: data, access secret, expiration
    const accessToken = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      secret,
      { expiresIn: '15m' } // 15 minutes lifespan for access token
    )
    // Generating refresh token: data, refresh secret, expiration
    const refreshToken = jwt.sign(
      { userId: user.id },
      refreshSecret,
      { expiresIn: '7d' } // 7 days lifespan for refresh token
    )
    // Setting access token as cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    // Setting refresh token as cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    // Successful login
    return res.status(200).json({
      success: true,
      message: `User ${user.name} successfully logged in` || 'User successfully logged in',
    })
  } catch(error: any) {
    console.error(`Error logging in user: ${error.message || error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    })
  }
} // End of userLogin


// @description: Refreshing user token
// @route: /users/refresh
// @method: POST
export const refreshUserToken = async (req: Request, res: Response): Promise<any> => {
  // Getting the refresh token from the cookie
  const { refreshToken } = req.cookies
  // Validating refresh token
  if(!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not provided",
    })
  }
  // Defining access token secret
  const secret = process.env.ACCESS_TOKEN_SECRET
  // Defining refresh token secret
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET
  // Validating tokens
  if(!secret || !refreshSecret) {
    return res.status(500).json({
      success: false,
      message: "JWT secrets are missing in environment variables",
    })
  }
  // Attempting to refresh the token
  try {
    // Verifying the refresh token
    const payload = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload
    // Fetching the user by id from the payload
    const user = await User.findById(payload.userId)
    // If user not found or does not exist
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or does not exist",
      });
    }
    // Generating a new access token
    const accessToken = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      secret,
      { expiresIn: "15m" } 
    )
    // Setting the new access token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    // Successful token refresh
    return res.status(200).json({
      success: true,
      message: "Access token successfully refreshed"
    })
  } catch(error: any) {
    console.error(`Error refreshing token: ${error.message || error}`)
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: error.message || error
    })
  }
} // End of refreshUserToken


// @description: Logging out the user
// @route: /users/logout
// @method: POST
export const userLogout: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
  // Attempting to logout
  try {
    // Checking if the user is already logged out
    if(!req.cookies?.accessToken && !req.cookies?.refreshToken) {
      return res.status(400).json({
        success: false,
        message: "User is already logged out"
      })
    }
    // Clearing the cookies
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    // Successful logout
    return res.status(200).json({
      success: true,
      message: "User successfully logged out. All cookies were cleared!",
    })
  } catch(error: any) {
    console.error(`Error during logout: ${error.message || error}`)
    next(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
      error: error.message || error
    })
  }
} // End of userLogout
