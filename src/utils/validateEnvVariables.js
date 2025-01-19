export function validateEnvVariables() {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables")
  }
  if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables")
  }
  if(!process.env.DB_CONNECTION_STRING) {
    throw new Error("DB_CONNECTION_STRING is not defined in environment variables")
  }
  if(!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS is not defined in environment variables")
  }
  if(!process.env.API_URL) {
    throw new Error("API_URL is not defined in environment variables")
  }
  console.log("Environment variables validated");
}