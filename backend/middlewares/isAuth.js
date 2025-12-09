import jwt from 'jsonwebtoken'    // JWT library for decoding and validating authentication tokens

// Middleware to authenticate incoming requests using a signed JWT
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token            // Retrieve the token from signed cookies

        // If no token is provided, block access
        if (!token) {
            return res.status(400).json({ message: "token not found" })
        }

        // Validate token and decode payload using the application's secret key
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)

        // Attach the authenticated user's ID to the request object for downstream handlers
        req.userId = verifyToken.userId

        next()                                     // Grant access to subsequent middleware or route handlers

    } catch (error) {
        console.log(error)                         // Log token verification or parsing errors
        return res.status(500).json({ message: "is Auth error" }) // Authentication failure response
    }
}

export default isAuth       // Export for integration into protected routes
