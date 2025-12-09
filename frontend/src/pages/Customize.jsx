import React, { useContext, useRef, useState } from 'react'
import { RiImageAddLine } from "react-icons/ri";           // Icon for "Add Image"
import Card from '../components/Card'                      // Card component for preset images
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { userDataContext } from '../context/UserContext'   // Context for user data and image states
import { useNavigate } from 'react-router-dom'             // For programmatic navigation
import { MdKeyboardBackspace } from "react-icons/md";      // Back navigation icon

function Customize() {
  // Consume context values for selected images and state setters
  const { backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  const navigate = useNavigate()         // Navigation hook to move between routes
  const inputImage = useRef(null)        // Ref to hidden file input element

  // Handle image upload from user's local device
  const handleImage = (e) => {
    const file = e.target.files?.[0]     // Get first selected file
    setBackendImage(file)                 // Store raw file for backend upload
    setFrontendImage(URL.createObjectURL(file)) // Create preview URL for frontend display
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px]">
      
      {/* BACK BUTTON */}
      <MdKeyboardBackspace 
        className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]'
        onClick={() => navigate("/")} 
      />

      {/* HEADING SECTION */}
      <h1 className="text-white text-2xl md:text-3xl mb-10 text-center">
        Select your <span className="text-blue-200">Assistant Image</span>
      </h1>

      {/* CARDS SECTION: Preset Images */}
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-4">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* CUSTOM IMAGE UPLOAD CARD */}
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
            bg-[#020220] border-2 border-[#0000ff66] rounded-2xl
            overflow-hidden hover:shadow-2xl hover:shadow-blue-500
            cursor-pointer hover:border-4 hover:border-white flex
            justify-center items-center ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
          onClick={() => {
            inputImage.current.click()   // Open file selection dialog
            setSelectedImage("input")    // Mark this card as selected
          }}
        >
          {/* Show icon if no image is uploaded; otherwise show uploaded preview */}
          {!frontendImage ? (
            <RiImageAddLine className="text-white w-6 h-6" />
          ) : (
            <img src={frontendImage} alt="Uploaded" className="h-full w-full object-cover" />
          )}
        </div>

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={inputImage}             // Reference for programmatic click
          hidden
          onChange={handleImage}       // Handle file selection
        />
      </div>

      {/* NEXT BUTTON */}
      {selectedImage && (
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black 
                     font-semibold cursor-pointer bg-white rounded-full text-lg hover:bg-gray-200 
                     transition-all"
          onClick={() => navigate("/customize2")} // Navigate to next customization step
        >
          Next
        </button>
      )}
    </div>
  )
}

export default Customize
