import axios from "axios"; // import axios to perform HTTP requests to the backend API
import { serverUrl } from "../App.jsx"; // import serverUrl to construct consistent backend API endpoints
import { useDispatch } from "react-redux"; // import useDispatch to dispatch Redux actions from React logic
import { setCourseData } from "../redux/courseSlice.js"; // import setCourseData to store fetched course data in Redux
import { useEffect } from "react"; // import useEffect to execute side effects during component lifecycle

const getCouseData = () => { // define a function to fetch all published courses and store them in Redux
  const dispatch = useDispatch(); // obtain the Redux dispatch function to trigger state updates

  useEffect(() => {
    const getAllPublishedCourse = async () => { // define a function to asynchronously fetch published course data
      try { // wrap the API request in a try block to handle potential failures
        const result = await axios.get(serverUrl + "/api/course/getpublishedcoures", { withCredentials: true }); // send a GET request to retrieve published courses while including credentials
        console.log(result.data); // log the fetched course data for debugging and verification
        dispatch(setCourseData(result.data)); // dispatch an action to store course data in the Redux state
      } catch (error) { // catch any errors that occur during the API request
        console.log(error); // log the error to help diagnose request or server issues
      }
    };

    getAllPublishedCourse(); // invoke the course-fetching function when the effect runs
  }, []); // ensure the effect runs only once by providing an empty dependency array
};

export default getCouseData;