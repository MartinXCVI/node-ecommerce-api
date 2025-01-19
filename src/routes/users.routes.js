/* MODULES IMPORTS */
import express from 'express'
import { getUsers, getUser, createUser, userLogin, getUsersCount, deleteUser, userLogout, refreshUserToken } from '../controllers/users.controller.js'

// Initializing router as an instance of Express Router
const router = express.Router()

/* GET routes */
// Getting all users
router.get('/users', getUsers)
// Getting users count
router.get('/users/get/count', getUsersCount)
// Getting a user by id
router.get('/users/:id', getUser)

/* POST routes */
// Create a new user
router.post('/users', createUser)
// Login the user by email
router.post('/users/login', userLogin)
// Refresh the user token
router.post('/users/refresh', refreshUserToken)
// Logout and clear cookies
router.post('/users/logout', userLogout)

/* DELETE routes */
// Deleting a user by id
router.delete('/users/:id', deleteUser)

export default router