/* MODULES IMPORTS */
import { Request } from 'express'
import jwt from "jsonwebtoken"
import { IJwtPayload } from '../interfaces/IJwtPayload'
import { expressjwt } from "express-jwt"
import { UNPROTECTED_PATHS } from '../config/unprotectedPaths.js'


// Authentication function
export function authJwt(isAdminCheck = false) {
  const secret = process.env.ACCESS_TOKEN_SECRET
  // Validating tokens
  if(!secret) {
    throw new Error("JWT secret is missing in environment variables")
  }
  return expressjwt({
    secret, // Access token secret
    algorithms: ['HS256'], // Algorithm used for generating the token
    getToken: getTokenFromCookie, // Retrieving token from the cookie
    // isRevoked: isAdminCheck ? isRevoked : undefined // Conditionally revoking access for non-admin users
    isRevoked: (req, token) => {
      // Ensuring token and payload exist before accessing properties
      if(!token || typeof token.payload !== "object") {
        return true // Revoke access if token is missing or malformed
      }
      // Blocking if user is not an admin
      if(isAdminCheck) {
        return !token.payload?.isAdmin
      }
      return false
    }
  }).unless({ // Excluding APIs from being authenticated
    path: [...UNPROTECTED_PATHS],
  })
}

// Is admin check function
async function isAdminCheck(payload: IJwtPayload): Promise<boolean> {
  // Checking if the token payload exists and if the user is an admin
  if(!payload || !payload.isAdmin) {
    console.log(`isAdminCheck: User is not an admin`)
    return false // Not an admin
  }
  // is Admin
  console.log(`isAdminCheck: User is an admin`)
  return true // Admin
}

// Verifying if the token is revoked
async function isRevoked(req: Request, token: any | undefined): Promise<boolean> {
  // If no token
  if(!token) {
    console.log("Access revoked: No token provided")
  }
  try {
    const payload = jwt.decode(token as string) as IJwtPayload | null
    // If no payload
    if(!payload) {
      console.log("Access revoked: Token is invalid")
      return true
    }
    // Check if access should be revoked based on admin status
    const isAdmin = await isAdminCheck(payload)
    if(!isAdmin) {
      console.log("Access revoked: User is not an admin")
      return true // Access revoked for non-admin users
    }
    // Access granted for admins
    console.log(`Access granted: Admin user`)
    return false // Access granted
  } catch(error: any) {
    console.error(`Access revoked. Error while attemptig to decode token: ${error.message || error}`)
    return true
  }
}

// Getting the token from the cookie
function getTokenFromCookie(req: Request): string | undefined {
  // Retrieving token from cookie
  if(req.cookies?.accessToken) {
    return req.cookies.accessToken // Token found in cookies
  } // Fallback for checking for a token in the Authorization header (Bearer <token>) 
  else if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1] // Token found in Authorization header
  }
  console.log("Access token not found in cookies or authorization header")
  return undefined
}