import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'  // Access user data and AI functions
import { useNavigate } from 'react-router-dom'            // Navigation hook
import axios from 'axios'                                 // HTTP requests
import aiImg from "../assets/ai.gif"                      // AI speaking animation
import userImg from "../assets/user.gif"                  // User speaking animation
import { CgMenuRight } from "react-icons/cg";            // Hamburger menu icon
import { RxCross1 } from "react-icons/rx";               // Close menu icon

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()

  // Local state for speech recognition and conversation
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)       // Tracks if AI is currently speaking
  const recognitionRef = useRef(null)       // Speech recognition instance
  const [ham, setHam] = useState(false)     // Hamburger menu state
  const isRecognizingRef = useRef(false)    // Tracks if recognition is active
  const synth = window.speechSynthesis      // Speech synthesis instance

  // Logout function: clears user data and navigates to signin
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  // Start speech recognition if not already speaking or recognizing
  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        console.log("Recognition requested to start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error)
        }
      }
    }
  }

  // Convert AI text to speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'

    // Select Hindi voice if available
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) utterance.voice = hindiVoice

    isSpeakingRef.current = true

    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition() // Restart recognition after AI finishes speaking
      }, 800)
    }

    synth.cancel()   // Cancel any ongoing speech
    synth.speak(utterance)
  }

  // Handle AI command results, trigger actions like search, navigation, etc.
  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    switch (type) {
      case "google-search":
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank")
        break
      case "calculator-open":
        window.open(`https://www.google.com/search?q=calculator`, "_blank")
        break
      case "instagram-open":
        window.open(`https://www.instagram.com/`, "_blank")
        break
      case "facebook-open":
        window.open(`https://www.facebook.com/`, "_blank")
        break
      case "weather-show":
        window.open(`https://www.google.com/search?q=weather`, "_blank")
        break
      case "youtube-search":
      case "youtube-play":
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, "_blank")
        break
      default:
        break
    }
  }

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    let isMounted = true

    // Start recognition after short delay
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try { recognition.start() } 
        catch (e) { if (e.name !== "InvalidStateError") console.log(e) }
      }
    }, 1000)

    // Recognition event handlers
    recognition.onstart = () => { isRecognizingRef.current = true; setListening(true) }
    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) { try { recognition.start() } catch {} }
        }, 1000)
      }
    }
    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => { if (isMounted) try { recognition.start() } catch {} }, 1000)
      }
    }
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      // Trigger AI assistant if its name is mentioned
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    // Initial greeting when page loads
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
    window.speechSynthesis.speak(greeting)

    // Cleanup on unmount
    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden">

      {/* HAMBURGER MENU FOR MOBILE */}
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
        onClick={() => setHam(true)} />

      {/* SIDE MENU */}
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start
        ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />

        <button className='w-[235px]  h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer'
          onClick={handleLogOut}>Log Out</button>

        <button className='w-[235px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer'
          onClick={() => navigate("/customize")}>Customize your Assistant</button>
      </div>

      {/* DESKTOP BUTTONS */}
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full absolute hidden lg:block top-[20px] right-[20px] text-[19px] cursor-pointer'
        onClick={handleLogOut}>Log Out</button>

      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full text-[19px] cursor-pointer hidden lg:block'
        onClick={() => navigate("/customize")}>Customize your Assistant</button>

      {/* ASSISTANT IMAGE AND NAME */}
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData.assistantName}</h1>

      {/* SPEAKING ANIMATION */}
      {!aiText && <img src={userImg} className='w-[200px]' alt="User speaking" />}
      {aiText && <img src={aiImg} className='w-[200px]' alt="AI speaking" />}

      {/* DISPLAY USER OR AI TEXT */}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>
        {userText ? userText : aiText ? aiText : null}
      </h1>

    </div>
  )
}

export default Home
