import { response } from "express"                     // Importing Express response object (not typically needed directly)
import uploadOnCloudinary from "../config/cloudinary.js" // Utility for uploading images to Cloudinary
import geminiResponse from "../gemini.js"               // AI assistant response generator
import User from "../models/user.model.js"              // User model for DB operations
import moment from "moment"                             // Library for date and time formatting

// Retrieve the currently authenticated user
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId                              // Extract authenticated user's ID
        const user = await User.findById(userId).select("-password") // Fetch user while excluding password
        if (!user) {
            return res.status(400).json({ message: "user not found" }) // No matching user
        }
        return res.status(200).json(user)                      // Respond with user details
    } catch (error) {
        return res.status(400).json({ message: "get current user error" }) // Error handling
    }
}

// Update assistant configuration such as name and image
export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body           // Extract update fields
        let assistantImage;

        // Check whether user uploaded a new image
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path) // Upload to Cloudinary
        } else {
            assistantImage = imageUrl                           // Retain existing URL
        }

        // Update user's assistant details
        const user = await User.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password")

        return res.status(200).json(user)                       // Return updated user details
    } catch (error) {
        return res.status(400).json({ message: "updateAssistantError user error" }) // Update failure
    }
}

// Process user commands directed to the assistant
export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body                            // Extract command input
        const user = await User.findById(req.userId)            // Retrieve the authenticated user

        user.history.push(command)                              // Add command to user's history
        user.save()                                             // Persist history update

        const userName = user.name                              // For AI persona personalization
        const assistantName = user.assistantName

        // Generate AI assistant response
        const result = await geminiResponse(command, assistantName, userName)

        // Extract JSON structure from AI response
        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.status(400).json({ response: "sorry, i can't understand" }) // Invalid AI output
        }

        const gemResult = JSON.parse(jsonMatch[0])              // Convert string to JSON object
        console.log(gemResult)

        const type = gemResult.type                             // Determine response category

        // Handle command types
        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}` // Today's date
                });
            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().format("hh:mm:A")}`     // Current time
                });
            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`               // Weekday name
                });
            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("MMMM")}`               // Month name
                });
            // Return AI-generated response for general command categories
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });

            default:
                return res.status(400).json({ response: "I didn't understand that command." }) // Unsupported command
        }

        return res.status.json                                  // Unreachable fallback (not used)
    } catch (error) {
        return res.status(500).json({ response: "ask assistant error" }) // Critical system error
    }
}
