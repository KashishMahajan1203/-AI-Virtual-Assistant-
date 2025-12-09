import express from "express"   // Import Express framework for routing
import { login, logOut, signUp } from "../controllers/auth.controllers.js"  // Auth controller handlers

// Initialize a new router instance for authentication-related routes
const authRouter = express.Router()

// Route for creating a new user account
authRouter.post("/signup", signUp)

// Route for authenticating a user and issuing a session token
authRouter.post("/signin", login)

// Route for terminating the user's authenticated session
authRouter.post("/logout", logOut)

export default authRouter   // Export router for integration into the main application
