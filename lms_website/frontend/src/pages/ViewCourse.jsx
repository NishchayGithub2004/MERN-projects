import axios from 'axios'; // import axios to perform HTTP requests to backend APIs
import React, { useEffect, useState } from 'react' // import React along with hooks to manage component lifecycle and local state
import { useDispatch, useSelector } from 'react-redux'; // import Redux hooks to dispatch actions and access global state
import { useNavigate, useParams } from 'react-router-dom'; // import routing hooks to read URL params and navigate programmatically
import { serverUrl } from '../App'; // import serverUrl constant to construct backend API endpoints
import { FaArrowLeftLong } from "react-icons/fa6"; // import arrow icon to enable back navigation in the UI
import img from "../assets/empty.jpg" // import placeholder image to show when no content is available
import Card from "../components/Card.jsx" // import Card component to display course cards
import { setSelectedCourseData } from '../redux/courseSlice'; // import Redux action to store selected course details
import { FaLock, FaPlayCircle } from "react-icons/fa"; // import lock and play icons for lecture access indicators
import { toast } from 'react-toastify'; // import toast utility to show user feedback notifications
import { FaStar } from "react-icons/fa6"; // import star icon to represent rating UI

function ViewCourse() { // define a functional component to display detailed view of a single course
  const { courseId } = useParams(); // extract courseId from route parameters to identify the course
  const dispatch = useDispatch() // initialize Redux dispatch function to update global state
  const navigate = useNavigate() // initialize navigation function to move between routes

  // retrieve the following data from their corresponding redux slices
  const { courseData } = useSelector(state => state.course) // all courses data from Redux course slice
  const { userData } = useSelector(state => state.user) // logged-in user data from Redux user slice
  const [selectedLecture, setSelectedLecture] = useState(null); // currently selected lecture for preview or access
  const { lectureData } = useSelector(state => state.lecture) // lecture-related data from Redux lecture slice
  const { selectedCourseData } = useSelector(state => state.course) // currently selected course data from Redux

  // create state variables and setter functions for managing course-related information such as the following
  const [creatorData, setCreatorData] = useState(null) // course creator's user information
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]) // other courses created by the same instructor
  const [isEnrolled, setIsEnrolled] = useState(false); // whether the current user is enrolled in the course
  const [rating, setRating] = useState(0); // user-selected rating value for the course
  const [comment, setComment] = useState(""); // user-written review or comment text

  const handleReview = async () => { // define a function to submit a user review for the selected course
    try {
      const result = await axios.post( // send a POST request to backend to store user review
        serverUrl + "/api/review/givereview",
        { rating, comment, courseId }, // pass rating, comment, and courseId as review payload
        { withCredentials: true } // include cookies to authenticate the logged-in user
      )
      toast.success("Review Added") // show success notification after review submission
      console.log(result.data) // log response data for debugging or verification
      setRating(0) // reset rating state after successful submission
      setComment("") // clear comment input after successful submission
    } catch (error) {
      console.log(error) // log error details for debugging
      toast.error(error.response.data.message) // show error message returned from backend
    }
  }

  const calculateAverageRating = (reviews) => { // define a function to calculate average rating from reviews array
    if (!reviews || reviews.length === 0) return 0 // return zero when no reviews are available
    const total = reviews.reduce((sum, review) => sum + review.rating, 0) // sum up all rating values from reviews
    return (total / reviews.length).toFixed(1) // calculate and return average rating rounded to one decimal
  }

  const avgRating = calculateAverageRating(selectedCourseData?.reviews) // compute average rating for the selected course reviews

  console.log("Average Rating:", avgRating) // log calculated average rating for debugging

  const fetchCourseData = async () => { // define a function to find and store selected course data in Redux
    courseData.map((item) => { // iterate through all available courses
      if (item._id === courseId) { // check if current course matches the route courseId
        dispatch(setSelectedCourseData(item)) // store matched course as selected course in Redux
        console.log(selectedCourseData) // log selected course data for debugging
        return null // explicitly return null to exit map iteration for matched item
      }
    })
  }

  const checkEnrollment = () => { // define a function to verify whether the user is enrolled in the course
    const verify = userData?.enrolledCourses?.some(c => { // check enrolled courses list for a matching course
      const enrolledId = typeof c === 'string' ? c : c._id // normalize course id whether stored as string or object
      return enrolledId?.toString() === courseId?.toString() // compare enrolled course id with current course id
    })

    console.log("Enrollment verified:", verify) // log enrollment verification result for debugging

    if (verify) setIsEnrolled(true) // update enrollment state if user is enrolled
  }

  useEffect(() => {
    fetchCourseData() // fetch and store selected course data
    checkEnrollment() // verify user enrollment status for the course
  }, [courseId, courseData, lectureData]) // re-run effect when course or lecture data changes  

  useEffect(() => { // run side effect to fetch course creator details when selected course changes
    const getCreator = async () => { // define async function to fetch creator information from backend
      if (selectedCourseData?.creator) { // ensure creator id exists before making API call
        try {
          const result = await axios.post( // send request to backend to fetch creator details
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator }, // pass creator user id as payload
            { withCredentials: true } // include cookies for authenticated request
          )
          setCreatorData(result.data) // store fetched creator data in local state
          console.log(result.data) // log creator data for debugging
        } catch (error) {
          console.error("Error fetching creator:", error) // log error if creator fetch fails
        }
      }
    }

    getCreator() // invoke creator fetch function
  }, [selectedCourseData]) // re-run effect whenever selected course data changes

  useEffect(() => { // run side effect to filter creator's other courses
    if (creatorData?._id && courseData.length > 0) { // ensure creator data and course list are available
      const creatorCourses = courseData.filter( // filter courses created by the same creator
        (course) =>
          course.creator === creatorData._id && course._id !== courseId // exclude the currently viewed course
      )

      setSelectedCreatorCourse(creatorCourses) // store creator's other courses in state
    }
  }, [creatorData, courseData]) // re-run effect when creator data or course list changes

  const handleEnroll = async (courseId, userId) => { // define a function to handle paid course enrollment
    try {
      const orderData = await axios.post( // create a Razorpay order from backend
        serverUrl + "/api/payment/create-order",
        {
          courseId, // send course id for which payment is being made
          userId // send user id who is enrolling
        },
        { withCredentials: true } // include cookies for authentication
      )

      console.log(orderData) // log order data for debugging

      const options = { // configure Razorpay checkout options
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // set Razorpay public key from environment variables
        amount: orderData.data.amount, // set payment amount returned from backend
        currency: "INR", // specify payment currency
        name: "Virtual Courses", // set merchant or platform name
        description: "Course Enrollment Payment", // describe payment purpose
        order_id: orderData.data.id, // attach backend-generated Razorpay order id
        handler: async function (response) { // define callback to run after successful payment
          console.log("Razorpay Response:", response) // log Razorpay payment response
          try {
            const verifyRes = await axios.post( // verify payment details with backend
              serverUrl + "/api/payment/verify-payment",
              {
                ...response, // spread Razorpay response fields
                courseId, // send course id for enrollment verification
                userId // send user id for enrollment verification
              },
              { withCredentials: true } // include cookies for authenticated verification
            )

            setIsEnrolled(true) // update enrollment state after successful verification
            toast.success(verifyRes.data.message) // show success message from backend
          } catch (verifyError) {
            toast.error("Payment verification failed.") // show error toast when verification fails
            console.error("Verification Error:", verifyError) // log verification error details
          }
        },
      }

      const rzp = new window.Razorpay(options) // create Razorpay instance using configured options

      rzp.open() // open Razorpay payment modal
    } catch (err) {
      toast.error("Something went wrong while enrolling.") // show generic error toast on failure
      console.error("Enroll Error:", err) // log enrollment error details
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong className='text-[black] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/")} /> // navigate user back to home page when back icon is clicked
            {selectedCourseData?.thumbnail ? ( // conditionally render course thumbnail if it exists in selected course data
              <img
                src={selectedCourseData.thumbnail} // load and display the course thumbnail image dynamically
                alt="Course Thumbnail"
                className="rounded-xl w-full object-cover"
              />
            ) : (
              <img
                src={img} // load and display fallback image when course thumbnail is not available
                alt="Course Thumbnail"
                className="rounded-xl w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourseData?.title}</h1> // render the selected course title dynamically from course data

            <p className="text-gray-600">{selectedCourseData?.subTitle}</p> // render the selected course subtitle dynamically from course data

            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium">
                ⭐ {avgRating} <span className="text-gray-500">(1,200 reviews)</span> // display calculated average rating alongside static review count
              </div>

              <div>
                <span className="text-lg font-semibold text-black">{selectedCourseData?.price}</span> // render the current course price dynamically
                {" "}
                <span className="line-through text-sm text-gray-400">₹599</span>
              </div>
            </div>

            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>

            {!isEnrolled ? ( // conditionally render enroll button when user is not enrolled in the course
              <button
                className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3"
                onClick={() => handleEnroll(courseId, userData._id)} // initiate enrollment and payment flow for the selected course and user
              >
                Enroll Now
              </button>
            ) : (
              <button
                className="bg-green-200 text-green-600 px-6 py-2 rounded hover:bg-gray-100 hover:border mt-3"
                onClick={() => navigate(`/viewlecture/${courseId}`)} // navigate enrolled user to lecture viewing page for the course
              >
                Watch Now
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourseData?.category} from Beginning</li> {/* render course category dynamically to describe what the user will learn */}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">Basic programming knowledge is helpful but not required.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">Course Curriculum</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedCourseData?.lectures?.length} Lectures</p> {/* render total number of lectures dynamically from selected course data */}

            <div className="flex flex-col gap-3">
              {selectedCourseData?.lectures?.map((lecture, index) => ( // iterate over lectures array to render each lecture item dynamically
                <button
                  key={index} // provide a unique key for each lecture item in the list
                  disabled={!lecture.isPreviewFree} // disable button interaction when lecture is not available for free preview
                  onClick={() => { // handle click event for selecting a lecture
                    if (lecture.isPreviewFree) { // ensure only preview-free lectures can be selected
                      setSelectedLecture(lecture) // update selectedLecture state with the clicked lecture
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${lecture.isPreviewFree
                    ? "hover:bg-gray-100 cursor-pointer border-gray-300" // apply interactive styles when lecture preview is allowed
                    : "cursor-not-allowed opacity-60 border-gray-200" // apply disabled styles when lecture preview is locked
                    } ${selectedLecture?.lectureTitle === lecture.lectureTitle
                      ? "bg-gray-100 border-gray-400" // highlight lecture item when it is currently selected
                      : "" // don't highlight lecture item that is not selected
                    }`} // dynamically compose styles based on preview availability and selection state
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />} {/* render play icon for free preview or lock icon for restricted lecture */}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lecture.lectureTitle} // render lecture title dynamically
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white w-full md:w-3/5 p-6 shadow-lg border border-gray-200">
            <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? ( // conditionally render video player when selected lecture has a video URL
                <video
                  src={selectedLecture.videoUrl} // load video source dynamically from selected lecture data
                  controls // enable built-in video playback controls for user interaction
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm">Select a preview lecture to watch</span> // show fallback message when no lecture video is selected
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedLecture?.lectureTitle || "Lecture Title"}</h3> {/* render selected lecture title dynamically or fallback text when no lecture is selected */}

            <p className="text-gray-600 text-sm">{selectedCourseData?.title}</p> {/* render parent course title dynamically below the lecture title */}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>

          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => ( // iterate over fixed star values to render rating selection UI
                <FaStar
                  key={star} // provide unique key for each star icon
                  onClick={() => setRating(star)} // update rating state based on selected star
                  className={star <= rating ? "fill-yellow-500" : "fill-gray-300"} // visually highlight stars based on current rating
                />
              ))}
            </div>

            <textarea
              value={comment} // bind textarea value to comment state to keep it controlled
              onChange={(e) => setComment(e.target.value)} // update comment state as user types review text
              placeholder="Write your comment here..."
              className="w-full border border-gray-300 rounded-lg p-2"
              rows="3"
            />
            <button
              className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800"
              onClick={handleReview} // submit the user review when button is clicked
            >
              Submit Review
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t ">
            {creatorData?.photoUrl ? ( // conditionally render creator profile image when photoUrl exists
              <img
                src={creatorData.photoUrl} // display instructor profile image from creator data
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <img
                src={img} // display fallback image when creator profile image is not available
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">{creatorData?.name}</h3> {/* render instructor name dynamically from creator data */}
              <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.description}</p> {/* render instructor description dynamically */}
              <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.email}</p> {/* render instructor email dynamically */}
            </div>
          </div>

          <div>
            <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
            <div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>
              {
                selectedCreatorCourse?.map((item, index) => ( // iterate over creator's other courses to render reusable Card components
                  <Card
                    key={index} // provide a unique key for each rendered Card to help React track list updates
                    thumbnail={item.thumbnail} // pass course thumbnail dynamically to display course image
                    title={item.title} // pass course title dynamically for display inside the Card
                    id={item._id} // pass course id dynamically to enable navigation or identification
                    price={item.price} // pass course price dynamically to show pricing information
                    category={item.category} // pass course category dynamically for contextual labeling
                  />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCourse