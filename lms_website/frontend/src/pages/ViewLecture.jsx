import React, { useState } from 'react'; // import React and useState hook to define component and manage local state
import { useSelector } from 'react-redux'; // import useSelector hook to read data from Redux store
import { useNavigate, useParams } from 'react-router-dom'; // import hooks to access route params and perform navigation
import { FaPlayCircle } from 'react-icons/fa'; // import play icon to visually represent lecture playback
import { FaArrowLeftLong } from "react-icons/fa6"; // import arrow icon to allow navigation back to previous screen

function ViewLecture() { // define a functional component to display and control course lectures
  const { courseId } = useParams(); // extract courseId from URL parameters to identify the selected course

  const { courseData } = useSelector((state) => state.course); // retrieve course data array from Redux course slice

  const { userData } = useSelector((state) => state.user) // retrieve logged-in user data from Redux user slice

  const selectedCourse = courseData?.find((course) => course._id === courseId); // find the course that matches the route courseId

  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null); // store currently selected lecture and default to first lecture if available

  const navigate = useNavigate() // initialize navigation function for route changes

  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null; // determine if logged-in user is the creator of the selected course

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-start gap-[20px] text-gray-800">
            <FaArrowLeftLong
              className='text-black w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")} // navigate user back to home page
            />
            {selectedCourse?.title} {/* render selected course title dynamically */}
          </h1>
  
          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category: {selectedCourse?.category}</span> {/* render course category dynamically */}
            <span>Level: {selectedCourse?.level}</span> {/* render course difficulty level dynamically */}
          </div>
        </div>
  
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
          {selectedLecture?.videoUrl ? ( /* conditionally render video player when lecture video exists */
            <video
              src={selectedLecture.videoUrl} /* load lecture video source dynamically */
              controls
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>
          )}
        </div>
  
        <div className="mt-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedLecture?.lectureTitle} {/* render currently selected lecture title */}
          </h2>
        </div>
      </div>
  
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>
  
        <div className="flex flex-col gap-3 mb-6">
          {selectedCourse?.lectures?.length > 0 ? ( /* check if lectures are available for the course */
            selectedCourse.lectures.map((lecture, index) => ( /* iterate over lectures to render selectable list */
              <button
                key={index} /* provide stable key for each lecture item */
                onClick={() => setSelectedLecture(lecture)} // update selected lecture on click
                className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
                  selectedLecture?._id === lecture._id // check whether the current lecture is selected
                    ? 'bg-gray-200 border-gray-500' // apply this style if lecture is selected
                    : 'hover:bg-gray-50 border-gray-300' // apply this style if lecture is not selected
                }`}            
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {lecture.lectureTitle} {/* render lecture title dynamically */}
                  </h4>
                </div>
                <FaPlayCircle className="text-black text-xl" />
              </button>
            ))
          ) : (
            <p className="text-gray-500">No lectures available.</p>
          )}
        </div>
  
        {courseCreator && ( /* conditionally render instructor section for course creator */
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Instructor</h3>
            <div className="flex items-center gap-4">
              <img
                src={courseCreator.photoUrl || '/default-avatar.png'} /* resolve instructor profile image or fallback */
                alt="Instructor"
                className="w-14 h-14 rounded-full object-cover border"
              />
              
              <div>
                <h4 className="text-base font-medium text-gray-800">
                  {courseCreator.name} {/* render instructor name */}
                </h4>
                <p className="text-sm text-gray-600">
                  {courseCreator.description || 'No bio available.'} {/* render instructor bio or fallback text */}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )  
}

export default ViewLecture;