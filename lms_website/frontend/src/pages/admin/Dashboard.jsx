import React from 'react' // import React to enable JSX rendering
import { useSelector } from "react-redux"; // import useSelector to read data from the redux store

import { 
  BarChart, // import BarChart to render bar chart container
  Bar, // import Bar to render individual bars in the chart
  XAxis, // import XAxis to render horizontal axis
  YAxis, // import YAxis to render vertical axis
  Tooltip, // import Tooltip to show hover details on chart points
  ResponsiveContainer, // import ResponsiveContainer to make charts responsive
  CartesianGrid // import CartesianGrid to render grid lines inside charts
} from "recharts";

import img from "../../assets/empty.jpg"; // import img to use as fallback profile image
import { useNavigate } from 'react-router-dom'; // import useNavigate to programmatically change routes
import { FaArrowLeftLong } from "react-icons/fa6"; // import FaArrowLeftLong to render back navigation icon

function Dashboard() { // define a function to render the educator dashboard overview
  const navigate = useNavigate() // initialize navigation handler for route transitions
  
  const { userData } = useSelector((state) => state.user); // extract logged-in user data from redux store
  
  const { creatorCourseData } = useSelector((state) => state.course); // extract creator course data from redux store
  
  const courseProgressData = creatorCourseData?.map(course => ({ // transform course data to chart-friendly lecture count format
    name: course.title.slice(0, 10) + "...", // shorten course title to 10 characters for chart labels
    lectures: course.lectures.length || 0 // derive lecture count with fallback to zero
  })) || []; // ensure an empty array is returned when creatorCourseData is undefined or null to prevent runtime errors during rendering

  const enrollData = creatorCourseData?.map(course => ({ // transform course data to chart-friendly enrollment format
    name: course.title.slice(0, 10) + "...", // shorten course title to 10 characters for chart labels
    enrolled: course.enrolledStudents?.length || 0 // derive enrolled student count with fallback to zero
  })) || []; // ensure an empty array is returned when creatorCourseData is undefined or null to prevent runtime errors during rendering

  const totalEarnings = creatorCourseData?.reduce((sum, course) => { // compute total earnings across all courses
    const studentCount = course.enrolledStudents?.length || 0 // determine enrolled student count per course
    const courseRevenue = course.price ? course.price * studentCount : 0 // calculate revenue per course if price exists
    return sum + courseRevenue // accumulate total revenue
  }, 0) || 0;

  return ( // return the JSX structure that renders the dashboard UI
    <div className="flex min-h-screen bg-gray-100">
      <FaArrowLeftLong
        className=' w-[22px] absolute top-[10%] left-[10%] h-[22px] cursor-pointer'
        onClick={() => navigate("/")} // navigate back to home page when back icon is clicked
      />
      
      <div className="w-full px-6 py-10 bg-gray-50 space-y-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={userData?.photoUrl || img} // display user profile image or fallback image if unavailable
            alt="Educator"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />
          
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"} 
            </h1>
            <h1 className='text-xl font-semibold text-gray-800'>
              Total Earning : <span className='font-light text-gray-900'>₹{totalEarnings.toLocaleString()}</span>
            </h1>
            <p className="text-gray-600 text-sm">
              {userData?.description || "Start creating amazing courses for your students!"}
            </p>
            <h1
              className='px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer'
              onClick={() => navigate("/courses")} // navigate to courses management page
            >
              Create Courses
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}> 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard