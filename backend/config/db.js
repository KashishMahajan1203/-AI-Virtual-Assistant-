import mongoose from "mongoose";     // Import Mongoose for MongoDB interactions

// Initialize and manage the MongoDB connection lifecycle
const connectDb = async () => {
    try {
        // Attempt to establish a connection using the environment-defined connection string
        await mongoose.connect(process.env.MONGODB_URL)

        // Log confirmation once the database handshake is successful
        console.log("db connected")
    } catch (error) {

        // Log the exception details to support diagnostics and issue resolution
        console.log(error)
    }
}

// Export the connection utility for centralized reuse across the application
export default connectDb
