import React, { useState } from 'react' // import React and useState hook to create component and manage local state
import ai from "../assets/ai.png" // import AI illustration image used in the UI
import ai1 from "../assets/SearchAi.png" // import secondary AI image used for search visuals
import { RiMicAiFill } from "react-icons/ri"; // import microphone icon to represent voice search action
import axios from 'axios'; // import axios to perform HTTP requests to backend AI API
import { serverUrl } from '../App'; // import serverUrl constant to construct backend API endpoint
import { useNavigate } from 'react-router-dom'; // import hook to enable programmatic navigation between routes
import start from "../assets/start.mp3" // import audio file to play sound when voice listening starts
import { FaArrowLeftLong } from "react-icons/fa6"; // import arrow icon to represent back navigation

function SearchWithAi() { // define a functional component to handle AI-based voice and text course search
  const [input, setInput] = useState('') // store and update user search input from speech recognition
  const [recommendations, setRecommendations] = useState([]) // store AI-recommended courses returned from backend
  const [listening, setListening] = useState(false) // track whether speech recognition is currently active

  const navigate = useNavigate() // initialize navigation function to move between application routes

  const startSound = new Audio(start) // create audio instance to play sound when speech recognition starts

  function speak(message) { // define a function to convert text message into spoken audio feedback
    let utterance = new SpeechSynthesisUtterance(message) // create speech synthesis utterance from provided message
    window.speechSynthesis.speak(utterance) // play synthesized speech using browser speech engine
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition // resolve browser-compatible speech recognition constructor

  const recognition = new SpeechRecognition() // create a new speech recognition instance to capture voice input

  if (!recognition) console.log("Speech recognition not supported") // log warning if browser does not support speech recognition

  const handleSearch = async () => { // define a function to start voice-based search interaction
    if (!recognition) return // exit early if speech recognition is unavailable

    setListening(true) // update state to indicate voice input has started
    startSound.play() // play start sound to notify user that listening has begun
    recognition.start() // start capturing voice input through microphone

    recognition.onresult = async (e) => { // handle speech recognition result event
      const transcript = e.results[0][0].transcript.trim() // extract and clean recognized speech text
      setInput(transcript) // store recognized speech text into input state
      await handleRecommendation(transcript) // fetch AI recommendations based on spoken query
    }
  }

  const handleRecommendation = async (query) => { // define a function to fetch AI-based course recommendations
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true }) // send search query to AI backend endpoint
      setRecommendations(result.data) // store recommended courses returned from backend
      if (result.data.length > 0) speak("These are the top courses I found for you") // speak success message when courses are found
      else speak("No courses found") // speak fallback message when no courses are returned
      setListening(false) // stop listening state after processing response
    } catch (error) {
      console.log(error) // log error details if AI search request fails
    }
  }

  return ( // return JSX to render the AI-powered search interface
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        <FaArrowLeftLong
          className='text-[black] w-[22px] h-[22px] cursor-pointer absolute'
          onClick={() => navigate("/")} // navigate user back to home page when back icon is clicked
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
          Search with <span className='text-[#CB99C7]'>AI</span>
        </h1>

        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full ">
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            value={input} // bind input value to input state to keep the field controlled
            onChange={(e) => setInput(e.target.value)} // update input state as user types a query
          />

          {input && ( // conditionally render search button only when input is not empty
            <button
              onClick={() => handleRecommendation(input)} // trigger AI recommendation search using typed input
              className="absolute right-14 sm:right-16 bg-white rounded-full"
            >
              <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
            </button>
          )}

          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleSearch} // start voice-based search using speech recognition
          >
            <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
          </button>
        </div>
      </div>

      {recommendations.length > 0 ? ( // conditionally render results section when recommendations exist
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3">
            <img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full" alt="AI Results" />
            AI Search Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {recommendations.map((course, index) => ( // iterate over recommended courses to render result cards
              <div
                key={index} // provide unique key for each rendered course card
                className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/viewcourse/${course._id}`)} // navigate to course detail page on card click
              >
                <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3> {/* render the course title dynamically from the current course object */}
                <p className="text-sm text-gray-600 mt-1">{course.category}</p> {/* render the course category dynamically to show its classification */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        listening
          ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Listening...</h1> // show listening state while voice input is active
          : <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>No Courses Found</h1> // show fallback message when no results are available
      )}
    </div>
  )
}

export default SearchWithAi;