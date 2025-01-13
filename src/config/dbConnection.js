import mongoose from 'mongoose'

const connectDB = async ()=> {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
    console.log('Database successfully connected')
  } catch(error) {
    console.error(`Database connection failed: ${error.message || error}`)
  }
}

export default connectDB