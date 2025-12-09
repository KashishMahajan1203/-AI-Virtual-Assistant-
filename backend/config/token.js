import jwt from "jsonwebtoken"   // Import JSON Web Token library for secure token generation

// Generate an authentication token for a given user identifier
const genToken = async (userId) => {
    try {
        // Create a signed JWT containing the userId payload, using the application secret and a 10-day expiry
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" })

        // Return the generated token for downstream authentication workflows
        return token
    } catch (error) {

        // Log any token issuance failures to support operational troubleshooting
        console.log(error)
    }
}

// Export the token generator for integration across authentication modules
export default genToken
