import React, { useEffect } from 'react' // import React to enable JSX rendering and useEffect to run side effects during component lifecycle
import { FaEdit } from "react-icons/fa"; // import FaEdit to render an edit action icon for each course
import { useNavigate } from 'react-router-dom'; // import useNavigate to programmatically navigate between routes
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch to dispatch redux actions and useSelector to read data from the redux store
import axios from 'axios'; // import axios to perform HTTP requests to the backend API
import { serverUrl } from '../../App'; // import serverUrl to construct backend API endpoints
import { toast } from 'react-toastify'; // import toast to display success and error notifications
import { setCreatorCourseData } from '../../redux/courseSlice'; // import setCreatorCourseData to store creator-specific courses in redux
import img1 from "../../assets/empty.jpg" // import img1 to use as a fallback image when a course thumbnail is missing
import { FaArrowLeftLong } from "react-icons/fa6"; // import FaArrowLeftLong to render a back navigation icon

function Courses() { // define a function to render and manage the creator courses listing page
  let navigate = useNavigate() // initialize navigation handler for route changes
  
  let dispatch = useDispatch() // initialize dispatch to update redux state

  const { creatorCourseData } = useSelector(state => state.course) // extract creator-specific course data from the redux store

  useEffect(() => { // run side effects on initial component mount to fetch creator courses
    const getCreatorData = async () => { // define a function to fetch courses created by the logged-in user
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true }) // request creator courses from backend with authentication
        dispatch(setCreatorCourseData(result.data)) // store fetched courses in redux for global access
        console.log(result.data) // log fetched data for debugging
      } catch (error) {
        console.log(error) // log any request or server errors
        toast.error(error.response.data.message) // show backend-provided error message to the user
      }
    }
    
    getCreatorData() // invoke the creator courses fetch function
  }, [])

  return ( // return the JSX structure that renders the courses listing UI
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[100%] min-h-screen p-4 sm:p-6 bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className='flex items-center justify-center gap-3'>
            <FaArrowLeftLong
              className='w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/dashboard")} // navigate back to the dashboard when the back icon is clicked
            />
            <h1 className="text-xl font-semibold">Courses</h1>
          </div>
          <button
            className="bg-[black] text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => navigate("/createcourses")} // navigate to the course creation page
          >
            Create Course
          </button>
        </div>

        <div className="hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course, index) => ( // iterate over creator courses to render each row
                <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4 flex items-center gap-4">
                    {
                      course?.thumbnail
                        ? <img src={course?.thumbnail} alt="" className="w-25 h-14 object-cover rounded-md" /> // render course thumbnail if available
                        : <img src={img1} alt='' className="w-14 h-14 object-cover rounded-md object-fit" /> // render fallback image if thumbnail is missing
                    }
                    <span>{course?.title}</span> {/* display the course title */}
                  </td>
                  
                  {
                    course?.price
                      ? <td className="py-3 px-4">₹{course?.price}</td> // display course price when available
                      : <td className="py-3 px-4">₹ NA</td> // display NA when price is not set
                  }
                  
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`} // dynamically style badge based on publish status
                    >
                      {course?.isPublished ? "Published" : "Draft"} {/* show publication status */}
                    </span>
                  </td>
                  
                  <td className="py-3 px-4">
                    <FaEdit
                      className="text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/addcourses/${course?._id}`)} // navigate to course edit page for the selected course
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <p className="text-center text-sm text-gray-400 mt-6">A list of your recent courses.</p>
        </div>

        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => ( // iterate over creator courses to render mobile-friendly cards
            <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
              <div className="flex gap-4 items-center">
                {
                  course?.thumbnail
                    ? <img src={course?.thumbnail} alt="" className="w-16 h-16 rounded-md object-cover" /> // render course thumbnail if available
                    : <img src={img1} alt="" className="w-16 h-16 rounded-md object-cover" /> // render fallback image if thumbnail is missing
                }
                <div className="flex-1">
                  <h2 className="font-medium text-sm">{course?.title}</h2> {/* display course title */}
                  {
                    course?.price
                      ? <p className="text-gray-600 text-xs mt-1">₹{course?.price}</p> // display price when available
                      : <p className="text-gray-600 text-xs mt-1">₹ NA</p> // display NA when price is missing
                  }
                </div>
                <FaEdit
                  className="text-gray-600 hover:text-blue-600 cursor-pointer"
                  onClick={() => navigate(`/addcourses/${course?._id}`)} // navigate to course edit page
                />
              </div>
              <span
                className={`w-fit px-3 py-1 text-xs rounded-full ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`} // dynamically style badge based on publish status
              >
                {course?.isPublished ? "Published" : "Draft"} {/* show publication status */}
              </span>
            </div>
          ))}
          
          <p className="text-center text-sm text-gray-400 mt-4 pl-[80px]">A list of your recent courses.</p>
        </div>
      </div>
    </div>
  )
}

export default Courses