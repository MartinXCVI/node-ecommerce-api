import express from 'express'
import { getUsers, getUser, createUser } from '../controllers/users.controller.js'

const router = express.Router()

/* GET routes */
// Getting all users
router.get('/users', getUsers)
// Getting a user by id
router.get('/users/:id', getUser)

/* POST routes */
router.post('/users', createUser)

export default router