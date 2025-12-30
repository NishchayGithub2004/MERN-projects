import axios from 'axios'; // import axios to perform HTTP requests to the backend API
import React, { useEffect, useState } from 'react' // import React to enable JSX rendering, useEffect to handle side effects, and useState to manage local state
import { FaArrowLeft, FaEdit } from 'react-icons/fa'; // import FaArrowLeft to render back navigation icon and FaEdit to render edit action icon
import { useNavigate, useParams } from 'react-router-dom'; // import useNavigate to programmatically change routes and useParams to access route parameters
import { toast } from 'react-toastify'; // import toast to display success and error notifications
import { serverUrl } from '../../App'; // import serverUrl to construct backend API endpoints
import { ClipLoader } from 'react-spinners'; // import ClipLoader to show a loading spinner during async operations
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch to dispatch redux actions and useSelector to read data from the redux store
import { setLectureData } from '../../redux/lectureSlice'; // import setLectureData to update lecture-related data in redux

function CreateLecture() { // define a function to manage creating and listing lectures for a specific course
  const navigate = useNavigate() // initialize navigation handler for route changes

  const { courseId } = useParams() // extract courseId from route parameters to identify the parent course

  const [lectureTitle, setLectureTitle] = useState("") // store the lecture title entered by the user
  const [loading, setLoading] = useState(false) // track loading state during async operations

  const dispatch = useDispatch() // initialize dispatch to update redux state

  const { lectureData } = useSelector(state => state.lecture) // extract lecture data array from redux store

  const createLectureHandler = async () => { // define a function to create a new lecture for the course
    setLoading(true) // enable loading state before starting API request

    try {
      const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true }) // send request to create a lecture with title for the given course
      console.log(result.data) // log backend response for debugging
      dispatch(setLectureData([...lectureData, result.data.lecture])) // append newly created lecture to existing lecture list in redux
      toast.success("Lecture Created") // show success notification
      setLoading(false) // disable loading state after success
      setLectureTitle("") // reset lecture title input field
    } catch (error) {
      console.log(error) // log error for debugging
      toast.error(error.response.data.message) // show backend-provided error message
      setLoading(false) // disable loading state after failure
    }
  }

  useEffect(() => { // run side effect on component mount to fetch existing lectures
    const getLecture = async () => { // define a function to fetch all lectures for the course
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true }) // request lectures for the given course
        console.log(result.data) // log fetched data for debugging
        dispatch(setLectureData(result.data.lectures)) // store fetched lectures in redux
      } catch (error) {
        console.log(error) // log error for debugging
        toast.error(error.response.data.message) // display backend-provided error message
      }
    }
    getLecture() // invoke lecture fetch function
  }, [])

  return ( // return JSX structure for lecture creation and listing UI
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Let’s Add a Lecture</h1>
          <p className="text-sm text-gray-500">Enter the title and add your video lectures to enhance your course content.</p>
        </div>

        <input
          type="text"
          placeholder="e.g. Introduction to Mern Stack"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onChange={(e) => setLectureTitle(e.target.value)} // update lecture title state as user types
          value={lectureTitle} // bind input value to lecture title state
        />

        <div className="flex gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            onClick={() => navigate(`/addcourses/${courseId}`)} // navigate back to course edit page
          >
            <FaArrowLeft /> Back to Course
          </button>
          <button
            className="px-5 py-2 rounded-md bg-[black] text-white hover:bg-gray-600 transition-all text-sm font-medium shadow"
            disabled={loading} // disable button while lecture creation is in progress
            onClick={createLectureHandler} // trigger lecture creation
          >
            {loading ? <ClipLoader size={30} color='white' /> : "+ Create Lecture"} {/* show loader while creating otherwise show button text */}
          </button>
        </div>

        <div className="space-y-2">
          {lectureData.map((lecture, index) => ( // iterate over lecture data to render lecture list
            <div key={index} className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700">
              <span>Lecture - {index + 1}: {lecture.lectureTitle}</span>
              <FaEdit
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)} // navigate to lecture edit page for selected lecture
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreateLecture