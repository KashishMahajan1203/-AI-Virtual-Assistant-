import axios from 'axios'
import React, { useEffect, useState, createContext } from 'react'

// Create a context to share user-related data and functions across the app
export const userDataContext = createContext()

function UserContext({ children }) {
    const serverUrl = "http://localhost:8000"   // Backend API base URL

    // State variables to manage user data and image selections
    const [userData, setUserData] = useState(null)        // Stores current logged-in user info
    const [frontendImage, setFrontendImage] = useState(null) // Stores uploaded frontend image
    const [backendImage, setBackendImage] = useState(null)   // Stores uploaded backend image
    const [selectedImage, setSelectedImage] = useState(null) // Stores the currently selected assistant image

    // Fetch the current authenticated user's data from backend
    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
            setUserData(result.data)          // Update userData state
            console.log(result.data)          // Log for debugging
        } catch (error) {
            console.log(error)                // Handle and log errors
        }
    }

    // Send a command to the AI assistant and get its response
    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/user/asktoassistant`,
                { command },
                { withCredentials: true }      // Include cookies for authentication
            )
            return result.data                  // Return AI assistant response
        } catch (error) {
            console.log(error)                 // Handle errors
        }
    }

    // Fetch user data when component mounts
    useEffect(() => {
        handleCurrentUser()
    }, [])

    // Value object to provide context to consuming components
    const value = {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }

    return (
        // Provide user data and functions to child components
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext
