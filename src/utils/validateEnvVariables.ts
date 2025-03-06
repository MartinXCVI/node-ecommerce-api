import { IEnvVariables } from '../interfaces/IEnvVariables'

export function validateEnvVariables() {
  const requiredEnvVars: (keyof IEnvVariables)[] = [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "DB_CONNECTION_STRING",
    "SALT_ROUNDS",
    "API_URL",
  ]
  // Filtering missin env variables
  const missingVars = requiredEnvVars.filter((key) => !process.env[key])
  // Stating missing variables if any
  if(missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`)
  }
  // Success: All validated
  console.log("Environment variables validated")
}