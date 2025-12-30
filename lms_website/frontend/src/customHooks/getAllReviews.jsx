import { useEffect } from "react"; // import useEffect to run side effects in a React component or custom hook
import { useDispatch } from "react-redux"; // import useDispatch to dispatch Redux actions from React logic
import { serverUrl } from "../App"; // import serverUrl to build API request URLs consistently across the app
import { setAllReview } from "../redux/reviewSlice"; // import setAllReview to store fetched review data in Redux
import axios from "axios"; // import axios to perform HTTP requests to the backend API

const getAllReviews = () => { // define a function to fetch all reviews from the backend and store them in Redux
  const dispatch = useDispatch(); // obtain the Redux dispatch function to trigger state updates

  useEffect(() => {
    const getAllReviews = async () => { // define a function to asynchronously request all review data from the server
      try { // wrap the API call in a try block to safely handle request failures
        const result = await axios.get(serverUrl + "/api/review/allReview", { withCredentials: true }); // send a GET request to fetch all reviews while including credentials
        console.log(result.data); // log the fetched review data for debugging and verification
        dispatch(setAllReview(result.data)); // dispatch an action to store all reviews in the Redux state
      } catch (error) { // catch any errors that occur during the API request
        console.log(error); // log the error to help diagnose request or server issues
      }
    };

    getAllReviews(); // invoke the review-fetching function when the effect runs
  }, []); // ensure the effect runs only once by providing an empty dependency array
};

export default getAllReviews;