import express from 'express';                 // Core framework for building the server
import dotenv from "dotenv"                    // Loads environment variables from .env
dotenv.config()                                // Initialize environment variable loading

import connectDb from './config/db.js';        // Database connection utility
import authRouter from './routes/auth.routes.js';    // Authentication route handlers
import cookieParser from 'cookie-parser';      // Middleware for parsing cookies
import cors from "cors"                        // Middleware to enable cross-origin requests
import userRouter from './routes/user.routes.js';    // User-related route handlers
import geminiResponse from './gemini.js';      // AI assistant integration (imported for future usage)

const app = express()                          // Initialize the Express application

// Configure CORS to allow frontend access and credentials (cookies)
app.use(cors({
    origin: "https://ai-virtual-assistant-02m7.onrender.com",           // Allow requests from this origin
    credentials: true                          // Enable cookies and auth headers
}))

const port = process.env.PORT || 5000          // Define server port from environment or fallback

app.use(express.json())                        // Parse JSON bodies from incoming requests
app.use(cookieParser())                        // Parse cookies for authentication workflows

// Mount authentication and user functionality routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// Start server and initialize database connection
app.listen(port, () => {
    connectDb()                                // Establish connection to MongoDB
    console.log("server started")              // Operational log for server start
})
