import axios from 'axios'; // import axios to perform HTTP requests to the backend API
import React, { useState } from 'react'; // import React to enable JSX rendering and useState to manage local component state
import { FaArrowLeft } from "react-icons/fa"; // import FaArrowLeft to render a back navigation icon
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch to dispatch redux actions and useSelector to read data from the redux store
import { useNavigate, useParams } from 'react-router-dom'; // import useNavigate to programmatically navigate routes and useParams to access route parameters
import { serverUrl } from '../../App'; // import serverUrl to construct backend API endpoints
import { setLectureData } from '../../redux/lectureSlice'; // import setLectureData to update lecture data in redux store
import { toast } from 'react-toastify'; // import toast to display success and error notifications
import { ClipLoader } from 'react-spinners'; // import ClipLoader to show loading spinner during async operations

function EditLecture() { // define a function to edit and manage an existing lecture
  const [loading, setLoading] = useState(false); // track loading state for lecture update operation
  const [loading1, setLoading1] = useState(false); // track loading state for lecture removal operation
  const [videoUrl, setVideoUrl] = useState(null); // store selected video file to upload
  const [lectureTitle, setLectureTitle] = useState(selectedLecture.lectureTitle); // store updated lecture title initialized from selected lecture
  const [isPreviewFree, setIsPreviewFree] = useState(false); // track whether lecture is marked as free preview

  const { courseId, lectureId } = useParams(); // extract courseId and lectureId from route parameters

  const { lectureData } = useSelector(state => state.lecture); // read lecture data array from redux store
  
  const dispatch = useDispatch(); // initialize dispatch to update redux state
  
  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId); // find the currently selected lecture using lectureId

  const formData = new FormData(); // create FormData instance to send text fields and video file together
  
  formData.append("lectureTitle", lectureTitle); // attach updated lecture title to form data
  formData.append("videoUrl", videoUrl); // attach selected video file to form data
  formData.append("isPreviewFree", isPreviewFree); // attach preview-free flag to form data

  const editLecture = async () => { // define a function to submit updated lecture data to backend
    setLoading(true); // enable loading state before API call
    
    try {
      const result = await axios.post( // send request to update lecture data
        serverUrl + `/api/course/editlecture/${lectureId}`, // construct edit lecture API endpoint using lectureId
        formData, // send form data payload
        { withCredentials: true } // include authentication cookies
      );
      console.log(result.data); // log backend response for debugging
      dispatch(setLectureData([...lectureData, result.data])); // update redux lecture list with updated lecture data
      toast.success("Lecture Updated"); // show success notification
      navigate("/courses"); // navigate back to courses page
      setLoading(false); // disable loading state after success
    } catch (error) {
      console.log(error); // log error details for debugging
      toast.error(error.response.data.message); // display backend-provided error message
      setLoading(false); // disable loading state after failure
    }
  };

  const removeLecture = async () => { // define a function to remove the selected lecture
    setLoading1(true); // enable loading state for delete operation
    
    try {
      const result = await axios.delete( // send delete request for lecture
        serverUrl + `/api/course/removelecture/${lectureId}`, // construct remove lecture API endpoint
        { withCredentials: true } // include authentication cookies
      );
      console.log(result.data); // log backend response for debugging
      toast.success("Lecture Removed"); // show success notification
      navigate(`/createlecture/${courseId}`); // navigate back to lecture creation page
      setLoading1(false); // disable loading state after success
    } catch (error) {
      console.log(error); // log error details for debugging
      toast.error("Lecture remove error"); // show generic error message
      setLoading1(false); // disable loading state after failure
    }
  };

  const navigate = useNavigate(); // initialize navigation handler for route transitions
  
  return ( // return JSX structure for editing and managing lecture UI
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FaArrowLeft
            className="text-gray-600 cursor-pointer"
            onClick={() => navigate(`/createlecture/${courseId}`)} // navigate back to lecture list for the course
          />
          <h2 className="text-xl font-semibold text-gray-800">Update Your Lecture</h2>
        </div>
        
        <div>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm"
            disabled={loading1} // disable remove button while delete operation is in progress
            onClick={removeLecture} // trigger lecture removal
          >
            {loading1 ? <ClipLoader size={30} color='white' /> : "Remove Lecture"} {/* show loader while removing otherwise show text */}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black] focus:outline-none"
              placeholder={selectedLecture.lectureTitle} // show existing lecture title as placeholder
              onChange={(e) => setLectureTitle(e.target.value)} // update lecture title state on input change
              value={lectureTitle} // bind input value to lectureTitle state
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video *</label>
            <input
              type="file"
              required
              accept='video/*'
              className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-[white] hover:file:bg-gray-500"
              onChange={(e) => setVideoUrl(e.target.files[0])} // store selected video file in state
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="accent-[black] h-4 w-4"
              onChange={() => setIsPreviewFree(prev => !prev)} // toggle preview-free flag
            />
            <label htmlFor="isFree" className="text-sm text-gray-700">Is this video FREE</label>
          </div>
        </div>
        
        <div>{loading ? <p>Uploading video... Please wait.</p> : ""}</div>

        <div className="pt-4">
          <button
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition"
            disabled={loading} // disable update button while upload is in progress
            onClick={editLecture} // trigger lecture update
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Update Lecture"} {/* show loader while updating otherwise show text */}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture