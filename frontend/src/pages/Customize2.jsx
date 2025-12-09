import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'   // Context for user and assistant state
import { MdKeyboardBackspace } from "react-icons/md";      // Back navigation icon
import axios from 'axios'                                   // HTTP requests
import { useNavigate } from 'react-router-dom';            // Navigation between routes

function Customize2() {
    // Destructure required context values
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)

    // Local state for assistant name input and loading state
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()   // Navigation hook

    // Handle updating assistant data (name + image) to backend
    const handleUpdateAssistant = async () => {
        setLoading(true)  // Show loading state
        try {
            const formData = new FormData()
            formData.append("assistantName", assistantName)   // Append assistant name
            if (backendImage) {
                formData.append("assistantImage", backendImage)  // Upload backend-selected image if exists
            } else {
                formData.append("imageUrl", selectedImage)       // Use selected preset image
            }

            // Send POST request to update assistant
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })

            setLoading(false)               // Remove loading state
            setUserData(result.data)        // Update user context with updated assistant info
            navigate("/")                   // Navigate to home/dashboard
        } catch (error) {
            setLoading(false)               // Remove loading state on error
            console.log(error)              // Log error for debugging
        }
    }

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t 
       from-black to-[#030353] flex justify-center items-center 
       flex-col p-[20px] relative">

            {/* BACK BUTTON */}
            <MdKeyboardBackspace 
                className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]'
                onClick={() => navigate("/customize")} 
            />

            {/* HEADING */}
            <h1 className="text-white text-[30px] mb-[40px] text-center">
                Enter your <span className="text-blue-200">Assistant Name</span>
            </h1>

            {/* INPUT FIELD FOR ASSISTANT NAME */}
            <input 
                type="text" 
                placeholder='eg. shifra'
                className='w-full max-w-[600px] h-[60px] outline-none border-2 
                           border-white bg-transparent text-white placeholder-gray-300 
                           px-[20px] py-[10px] rounded-full text-[18px]'
                required 
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
            />

            {/* SUBMIT BUTTON */}
            {assistantName && (
                <button
                    className="min-w-[300px] h-[60px] mt-[30px] text-black 
                               font-semibold cursor-pointer bg-white rounded-full 
                               text-[19px]"
                    disabled={loading}           // Disable button while loading
                    onClick={handleUpdateAssistant}
                >
                    {!loading ? "Finally Create Your Assistant" : "Loading..."}
                </button>
            )}
        </div>
    )
}

export default Customize2
