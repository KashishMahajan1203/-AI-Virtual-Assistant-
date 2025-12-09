import mongoose from "mongoose";   // Import Mongoose to define and manage MongoDB schemas

// Define the structure and rules for user documents in the database
const userSchema = new mongoose.Schema({
    name: {
        type: String,              // User's display name
        required: true             // Mandatory field
    },
    email: {
        type: String,              // User's email address
        required: true,            // Mandatory field
        unique: true               // Ensures no two users share the same email
    },
    password: {
        type: String,              // Hashed password stored securely
        required: true             // Mandatory field
    },
    assistantName: {
        type: String,              // Custom assistant name set by the user
    },
    assistantImage: {
        type: String,              // URL of the assistant's profile image
    },
    history: [
        { type: String }           // Array storing the user's command history
    ]
},
{ timestamps: true }               // Automatically adds createdAt and updatedAt fields
)

// Create the User model based on the schema
const User = mongoose.model("User", userSchema)

export default User                 // Export the model for use in other parts of the application
