import { useEffect } from "react"; // import useEffect to run side effects in React based on lifecycle and dependencies
import { serverUrl } from "../App"; // import serverUrl to construct backend API endpoints consistently
import axios from "axios"; // import axios to perform HTTP requests to the backend
import { setCreatorCourseData } from "../redux/courseSlice"; // import setCreatorCourseData to store creator-specific courses in Redux
import { useDispatch, useSelector } from "react-redux"; // import useDispatch to dispatch Redux actions and useSelector to read Redux state
import { toast } from "react-toastify"; // import toast to display error notifications to the user

const getCreatorCourseData = () => { // define a function to fetch courses created by the logged-in user
  const dispatch = useDispatch(); // obtain the Redux dispatch function to update global state
  
  const { userData } = useSelector( // extract userData from the Redux store to react to user changes
    state => state.user // select the user slice from the Redux store state
  );
  
  return ( // return a side-effect execution tied to this function usage
    useEffect(() => {
      const getCreatorData = async () => { // define a function to asynchronously fetch creator-specific courses
        try { // wrap the API request in a try block to handle failures safely
          const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true }); // request creator courses from the backend while sending credentials
          dispatch(setCreatorCourseData(result.data)); // dispatch fetched creator course data to Redux state
          console.log(result.data); // log the received data for debugging and verification
        } catch (error) { // catch any errors that occur during the API request
          console.log(error); // log the error object for debugging purposes
          toast.error(error.response.data.message); // display the backend error message to the user via toast notification
        }
      };

      getCreatorData(); // invoke the creator course fetch when the effect runs
    }, [userData]) // re-run the effect whenever userData changes to keep creator courses in sync
  );
};

export default getCreatorCourseData;