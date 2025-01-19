/* Array list of unprotected paths for non-admin users */
export const UNPROTECTED_PATHS = [
  // Allowing non-authenticated users to retrieve all products
  { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
  // Allowing non-authenticated users to retrieve all categories
  { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
  // Allowing non-authenticated users to log in, register, refresh token, log out
  { url: /\/api\/v1\/users\/(login|register|refresh|logout)/, methods: ["POST"] },
]