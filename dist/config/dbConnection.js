import mongoose from 'mongoose';
const connectDB = async () => {
    // Declaring connection string
    const dbUri = `${process.env.DB_CONNECTION_STRING}`;
    // Validating connection string
    if (!dbUri) {
        console.error('Database connection string is missing');
        process.exit(1);
    }
    // Attempting to connect
    try {
        await mongoose.connect(dbUri);
        console.log('Database successfully connected');
    }
    catch (error) {
        console.error(`Database connection failed: ${error.message || error}`);
        process.exit(1);
    }
};
export default connectDB;
