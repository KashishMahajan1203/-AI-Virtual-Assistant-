import genToken from "../config/token.js"        // Token generator utility for issuing JWTs
import User from "../models/user.model.js"        // User model for database operations
import bcrypt from 'bcryptjs'                     // Library for hashing and validating passwords

// Handle new user registration
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body   // Extract required fields from client request

        // Check whether the email is already registered
        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({ message: "Email Already Exists!" })
        }

        // Enforce minimum password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters!" })
        }

        // Hash the user's password before saving it
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the new user record in the database
        const user = await User.create({
            name, password: hashedPassword, email
        })

        // Generate a JWT for authenticated sessions
        const token = await genToken(user._id)

        // Set the token as an HTTP-only cookie to maintain session security
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,        // Cookie validity (7 days)
            sameSite: "strict",                     // Restrict cross-site cookie usage
            secure: false                           // Should be true in production with HTTPS
        })

        // Confirm successful registration
        return res.status(201).json(user)
    } catch (error) {
        // Return a structured error message for operational visibility
        return res.status(500).json({ message: `sign up error ${error}` })
    }
}

// Handle user login requests
export const login = async (req, res) => {
    try {
        const { email, password } = req.body        // Extract login credentials

        // Verify user existence
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email does not exist!" })
        }

        // Validate password correctness
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" })
        }

        // Generate a fresh JWT for the authenticated session
        const token = await genToken(user._id)

        // Store session token in a secured cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        // Deliver the authenticated user profile
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `login  error ${error}` })
    }
}

// Handle session termination
export const logOut = async (req, res) => {
    try {
        // Clear the authentication cookie to invalidate the session
        res.clearCookie("token")

        // Confirm session logout
        return res.status(200).json({ message: "log out successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout  error ${error}` })
    }
}
