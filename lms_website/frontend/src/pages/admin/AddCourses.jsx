import React, { useEffect, useRef, useState } from 'react' // import React to enable JSX rendering, useEffect to handle side effects, useRef to persist mutable values across renders, and useState to manage component state
import img from "../../assets/empty.jpg" // import img to display a placeholder image when no data is available
import { FaArrowLeftLong } from "react-icons/fa6"; // import FaArrowLeftLong to render a back navigation icon in the UI
import { useNavigate, useParams } from 'react-router-dom'; // import useNavigate to programmatically change routes and useParams to access dynamic route parameters
import { serverUrl } from '../../App'; // import serverUrl to construct API endpoint URLs for backend communication
import { MdEdit } from "react-icons/md"; // import MdEdit to display an edit action icon in the interface
import axios from 'axios'; // import axios to perform HTTP requests to the backend API
import { toast } from 'react-toastify'; // import toast to show non-blocking notification messages to the user
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch to dispatch actions to the Redux store and useSelector to read state from the store
import { ClipLoader } from 'react-spinners'; // import ClipLoader to indicate loading states during async operations
import { setCourseData } from '../../redux/courseSlice'; // import setCourseData to update course-related data in the Redux store

function AddCourses() { // define a function to manage the add and edit course workflow within the application
  const navigate = useNavigate() // initialize navigation handler to programmatically change routes after course actions
  
  const { courseId } = useParams() // extract courseId from route parameters to identify the course being edited

  // manage local state for course form fields and related UI data
  const [selectedCourse, setSelectedCourse] = useState(null) // full course object fetched from the backend for editing
  const [title, setTitle] = useState("") // course title entered by the user
  const [subTitle, setSubTitle] = useState("") // course subtitle entered by the user
  const [description, setDescription] = useState("") // detailed course description content
  const [category, setCategory] = useState("") // selected course category value
  const [level, setLevel] = useState("") // difficulty or experience level of the course
  const [price, setPrice] = useState("") // course price entered by the user
  const [isPublished, setIsPublished] = useState(false) // track whether the course is marked as published or draft
  const thumb = useRef() // create a ref to directly access the thumbnail file input element
  const [frontendImage, setFrontendImage] = useState(null) // preview image used for immediate UI display
  const [backendImage, setBackendImage] = useState(null) // actual image file to be sent to the backend
  let [loading, setLoading] = useState(false) // track loading state to control spinners and disable actions during API calls
  
  const dispatch = useDispatch() // obtain dispatch function to send actions to the Redux store
  
  const { courseData } = useSelector(state => state.course) // select course-related data from the Redux store for shared state usage

  const getCourseById = async () => { // define a function to fetch course details from the backend using the courseId
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true }) // request course data from the server with authentication cookies
      setSelectedCourse(result.data) // store the fetched course data in local state for form population
      console.log(result) // log the full API response for debugging and inspection
    } catch (error) {
      console.log(error) // log any request or server errors for troubleshooting
    }
  }

  useEffect(() => { // create a side effect to populate local state with course details
    if (selectedCourse) { // if a course is selected to add, update local state with course details
      // if any of the course details are missing, set them to an empty string and existing values for image and publised status
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnail || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse]) // re-run this effect whenever selectedCourse changes ie when some other course is selected to add

  useEffect(() => {
    getCourseById() // fetch course details when the component mounts
  }, []) // run this effect only once when the component mounts by giving an empty dependency array

  const handleThumbnail = (e) => { // define a function to handle course thumbnail selection that takes the file input change event
    const file = e.target.files[0] // extract the first selected file from the file input element
    setBackendImage(file) // store the raw file object to be sent to the backend during form submission
    setFrontendImage(URL.createObjectURL(file)) // generate and store a temporary preview URL to immediately display the image in the UI
  }
  
  const editCourseHandler = async () => { // define a function to submit updated course data to the backend
    setLoading(true) // enable loading state to block interactions and show a spinner during the request
    
    const formData = new FormData() // create a FormData instance to send text fields and files together
    
    // append all course-related fields to the form data payload for backend processing
    formData.append("title", title)
    formData.append("subTitle", subTitle)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("level", level)
    formData.append("price", price)
    formData.append("thumbnail", backendImage)
    formData.append("isPublished", isPublished)
  
    try {
      const result = await axios.post( // send an authenticated request to update the course on the backend
        `${serverUrl}/api/course/editcourse/${courseId}`, // construct the edit course API endpoint using courseId
        formData, // send form data containing course fields and thumbnail
        { withCredentials: true } // include cookies for authentication and session validation
      )
  
      const updatedCourse = result.data // extract the updated course object returned by the backend
      
      if (updatedCourse.isPublished) { // check whether the updated course is published
        const updatedCourses = courseData.map(c =>
          c._id === courseId ? updatedCourse : c // replace the old course entry with the updated one if it exists
        )
        
        if (!courseData.some(c => c._id === courseId)) updatedCourses.push(updatedCourse) // add the course if it was not previously present in the list
        
        dispatch(setCourseData(updatedCourses)) // update the redux store with the modified course list
      } else {
        const filteredCourses = courseData.filter(c => c._id !== courseId) // remove the course from the list if it is unpublished
        dispatch(setCourseData(filteredCourses)) // update the redux store with the filtered course list
      }
  
      navigate("/courses") // redirect the user back to the courses listing page
      
      toast.success("Course Updated") // show a success notification confirming the update
    } catch (error) {
      console.log(error) // log the error response for debugging
      toast.error(error.response?.data?.message || "Something went wrong") // display a user-friendly error message
    } finally {
      setLoading(false) // disable loading state once the request completes
    }
  }
  
  const removeCourse = async () => { // define a function to permanently delete a course from the system
    setLoading(true) // enable loading state to prevent further actions during deletion
    
    try {
      const result = await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true }) // send an authenticated delete request for the course
      toast.success("Course Deleted") // notify the user that the course has been successfully deleted
      const filteredCourses = courseData.filter(c => c._id !== courseId) // remove the deleted course from the local course list
      dispatch(setCourseData(filteredCourses)) // update the redux store to reflect course removal
      console.log(result) // log the backend response for verification
      navigate("/courses") // redirect the user to the courses listing page
      setLoading(false) // disable loading state after successful deletion
    } catch (error) {
      console.log(error) // log any deletion errors for debugging
      toast.error(error.response.data.message) // display backend-provided error message to the user
      setLoading(false) // disable loading state after failure
    }
  }  

  return ( // return the JSX structure that renders the add/edit course user interface
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className='top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer'
          onClick={() => navigate("/courses")} // navigate back to the courses list when the back icon is clicked
        />
        <h2 className="text-2xl font-semibold md:pl-[60px]">Add detail information regarding course</h2>
        <div className="space-x-2 space-y-2">
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)} // navigate to the lecture creation page using the current course id if available
          >
            Go to lectures page
          </button>
        </div>
      </div>
  
      <div className="bg-gray-50 p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Basic Course Information</h3>
        <div className="space-x-2 space-y-2">
          {
            !isPublished
              ? <button
                  className="bg-green-100 text-green-600 px-4 py-2 rounded-md border-1"
                  onClick={() => setIsPublished(prev => !prev)} // toggle course publish state from unpublished to published
                >
                  Click to Publish
                </button>
              : <button
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-md border-1"
                  onClick={() => setIsPublished(prev => !prev)} // toggle course publish state from published to unpublished
                >
                  Click to UnPublish
                </button>
          }
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            disabled={loading} // disable the remove button while an async operation is in progress
            onClick={removeCourse} // trigger course deletion when clicked
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Remove Course"} {/* show loader while deleting otherwise show button text */}
          </button>
        </div>
  
        <form
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()} // prevent default form submission to handle save logic manually
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Course Title"
              className="w-full border px-4 py-2 rounded-md"
              onChange={(e) => setTitle(e.target.value)} // update title state as the user types
              value={title} // bind input value to title state
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              placeholder="Subtitle"
              className="w-full border px-4 py-2 rounded-md"
              onChange={(e) => setSubTitle(e.target.value)} // update subtitle state as the user types
              value={subTitle} // bind input value to subtitle state
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Course description"
              className="w-full border px-4 py-2 rounded-md h-24 resize-none"
              onChange={(e) => setDescription(e.target.value)} // update description state as the user types
              value={description} // bind textarea value to description state
            ></textarea>
          </div>
  
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border px-4 py-2 rounded-md bg-white"
                onChange={(e) => setCategory(e.target.value)} // update category state when a new option is selected
                value={category} // bind selected value to category state
              >
                <option value="">Select Category</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX Designing">UI UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
              </select>
            </div>
  
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
              <select
                className="w-full border px-4 py-2 rounded-md bg-white"
                onChange={(e) => setLevel(e.target.value)} // update course level state based on selection
                value={level} // bind selected value to level state
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
  
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
              <input
                type="number"
                placeholder="₹"
                className="w-full border px-4 py-2 rounded-md"
                onChange={(e) => setPrice(e.target.value)} // update price state as numeric input changes
                value={price} // bind input value to price state
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
            <input
              type="file"
              ref={thumb} // attach ref to programmatically trigger file picker
              hidden
              className="w-full border px-4 py-2 rounded-md"
              onChange={handleThumbnail} // process selected thumbnail image
              accept='image/*' // restrict file selection to image types
            />
          </div>
  
          <div className='relative w-[300px] h-[170px]'>
            <img
              src={frontendImage} // display selected thumbnail preview image
              alt=""
              className='w-[100%] h-[100%] border-1 border-black rounded-[5px]'
              onClick={() => thumb.current.click()} // open file selector when image is clicked
            />
            <MdEdit
              className='w-[20px] h-[20px] absolute top-2 right-2'
              onClick={() => thumb.current.click()} // open file selector when edit icon is clicked
            />
          </div>
  
          <div className='flex items-center justify-start gap-[15px]'>
            <button
              className='bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black cursor-pointer px-4 py-2 rounded-md'
              onClick={() => navigate("/courses")} // cancel changes and navigate back to the courses page
            >
              Cancel
            </button>
            <button
              className='bg-black text-white px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer'
              disabled={loading} // disable save button while update request is in progress
              onClick={editCourseHandler} // submit updated course data to the backend
            >
              {loading ? <ClipLoader size={30} color='white' /> : "Save"} {/* show loader while saving otherwise show save text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  )  
}

export default AddCourses