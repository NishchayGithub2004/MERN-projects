import axios from "axios"; // import axios to perform HTTP requests to the backend API
import React, { useState } from "react"; // import React to enable JSX rendering and useState to manage component state
import { FaArrowLeftLong } from "react-icons/fa6"; // import FaArrowLeftLong to render a back navigation icon
import { useNavigate } from "react-router-dom"; // import useNavigate to programmatically change routes
import { serverUrl } from "../../App"; // import serverUrl to construct backend API endpoints
import { toast } from "react-toastify"; // import toast to display success and error notifications
import { ClipLoader } from "react-spinners"; // import ClipLoader to show a loading spinner during async operations

const CreateCourse = () => { // define a functional component to create a new course
    let navigate = useNavigate() // initialize navigation handler for route transitions
    
    let [loading, setLoading] = useState(false) // track loading state to disable actions and show a spinner during API calls
    const [title, setTitle] = useState("") // store the course title entered by the user
    const [category, setCategory] = useState("") // store the selected course category

    const CreateCourseHandler = async () => { // define a function to submit new course data to the backend
        setLoading(true) // enable loading state before starting the API request
        
        try {
            const result = await axios.post( // send a request to create a new course
                serverUrl + "/api/course/create", // construct the create course API endpoint
                { title, category }, // send course title and category as request payload
                { withCredentials: true } // include authentication cookies with the request
            )
            console.log(result.data) // log the backend response for debugging
            toast.success("Course Created") // show success notification after course creation
            navigate("/courses") // redirect user to the courses listing page
            setTitle("") // reset the title input after successful creation
            setLoading(false) // disable loading state after success
        } catch (error) {
            console.log(error) // log error details for debugging
            setLoading(false) // disable loading state after failure
            toast.error(error.response.data.message) // display backend-provided error message
        }
    }

    return ( // return the JSX structure that renders the create course form
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative">
                <FaArrowLeftLong
                    className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer'
                    onClick={() => navigate("/courses")} // navigate back to courses page when back icon is clicked
                />
                
                <h2 className="text-2xl font-semibold mb-6 text-center">Create Course</h2>

                <form
                    className="space-y-5"
                    onSubmit={(e) => e.preventDefault()} // prevent default form submission to control submit logic manually
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter course title"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]"
                            onChange={(e) => setTitle(e.target.value)} // update title state as user types
                            value={title} // bind input value to title state
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[black]"
                            onChange={(e) => setCategory(e.target.value)} // update category state when selection changes
                        >
                            <option value="">Select category</option>
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

                    <button
                        type="submit"
                        className="w-full bg-[black] text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition"
                        disabled={loading} // disable submit button while API request is in progress
                        onClick={CreateCourseHandler} // trigger course creation on button click
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Create"} {/* show loader while creating course otherwise show button text */}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateCourse