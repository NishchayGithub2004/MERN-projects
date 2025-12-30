import React from 'react'; // import React to define a functional component
import { useSelector } from 'react-redux'; // import useSelector to read user data from redux store
import { useNavigate } from 'react-router-dom'; // import navigation hook to programmatically change routes
import { FaArrowLeftLong } from "react-icons/fa6"; // import back arrow icon for navigation control

function EnrolledCourse() { // define a functional component named 'EnrolledCourse' to display courses the user is enrolled in
  const navigate = useNavigate(); // initialize navigate function to handle route navigation

  const { userData } = useSelector((state) => state.user); // extract userData from redux store to access enrolled courses
  
  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      <FaArrowLeftLong
        onClick={() => navigate("/")} // navigate to home page when back arrow icon is clicked
      />

      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">My Enrolled Courses</h1>

      {userData.enrolledCourses.length === 0 ? ( // conditionally check if user has no enrolled courses
        <p className="text-gray-500 text-center w-full">
          You haven’t enrolled in any course yet.
        </p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {userData.enrolledCourses.map((course) => ( // iterate over enrolled courses to render each course card
            <div
              key={course._id} // use course id as unique key for list rendering
              className="bg-white rounded-2xl shadow-md overflow-hidden border"
            >
              <img
                src={course.thumbnail} // render course thumbnail image for visual identification
                alt={course.title} // use course title as alt text for accessibility
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {course.title} {/* display course title to identify the course */}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {course.category} {/* display course category for classification */}
                </p>
                <p className="text-sm text-gray-700">
                  {course.level} {/* display course difficulty or learning level */}
                </p>
                <h1
                  onClick={() => navigate(`/viewlecture/${course._id}`)} // navigate to lecture view page for selected course
                >
                  Watch Now
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCourse