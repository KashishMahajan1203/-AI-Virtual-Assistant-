import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"                      // Background image
import { IoEye, IoEyeOff } from "react-icons/io5";       // Icons to show/hide password
import { useNavigate } from 'react-router-dom';          // Navigation hook
import { userDataContext } from '../context/UserContext'; // Context for server URL and user data
import axios from "axios"                                 // HTTP requests

function SignIn() {
    const navigation = useNavigate()                      // Hook for navigating between routes
    const [showPassword, setShowPassword] = useState(false) // Toggle password visibility
    const { serverUrl, setUserData } = useContext(userDataContext) // Get server URL & user setter
    const [email, setEmail] = useState("")                // Email input state
    const [password, setPassword] = useState("")          // Password input state
    const [loading, setLoading] = useState(false)         // Loading state for button
    const [err, setErr] = useState("")                    // Error message state

    // Handle sign-in form submission
    const handleSignIn = async (e) => {
        e.preventDefault()
        setErr("")              // Clear previous errors
        setLoading(true)        // Enable loading state
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, { withCredentials: true }) // Send credentials with cookies

            setUserData(result.data) // Update context with user data
            setLoading(false)
            navigation("/")         // Navigate to home page
        } catch (error) {
            console.log(error)
            setUserData(null)        // Clear context if login fails
            setLoading(false)
            setErr(error.response.data.message) // Display backend error
        }
    }

    return (
        <div className='w-full h-[100vh] bg-cover flex justify-center items-center'
            style={{ backgroundImage: `url(${bg})` }}>

            {/* SIGN-IN FORM */}
            <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blue shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]'
                onSubmit={handleSignIn}>

                {/* FORM HEADING */}
                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
                    Sign In to <span className='text-blue-400'>Virtual Assistant</span>
                </h1>

                {/* EMAIL INPUT */}
                <input
                    type="email"
                    placeholder='Email'
                    className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* PASSWORD INPUT WITH TOGGLE */}
                <div className='w-full h-[60px] border-2 bg-transparent text-white rounded-full text-[18px] relative'>
                    <input
                        type={showPassword ? "text" : "password"} // Show/hide password
                        placeholder='Password'
                        className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Toggle visibility icon */}
                    {!showPassword && 
                        <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
                            onClick={() => setShowPassword(true)} />}
                    {showPassword &&
                        <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
                            onClick={() => setShowPassword(false)} />}
                </div>

                {/* DISPLAY ERROR MESSAGE */}
                {err.length > 0 && <p className='text-red-500 text-[17px]'>*{err}</p>}

                {/* SUBMIT BUTTON */}
                <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]'
                    disabled={loading}>
                    {loading ? "Loading..." : "Sign In"}
                </button>

                {/* NAVIGATE TO SIGNUP */}
                <p className='text-[white] text-[18px] cursor-pointer'
                    onClick={() => navigation("/signup")}>
                    Wanna create a new account? <span className='text-blue-400'>Sign Up</span>
                </p>
            </form>
        </div>
    )
}

export default SignIn
