import { useEffect } from "react"; // import useEffect to run side effects during the React component lifecycle
import { serverUrl } from "../App"; // import serverUrl to construct backend API endpoints
import axios from "axios"; // import axios to perform HTTP requests to the backend
import { useDispatch } from "react-redux"; // import useDispatch to dispatch Redux actions
import { setUserData } from "../redux/userSlice"; // import setUserData to update authenticated user data in Redux

const getCurrentUser = () => { // define a function to fetch the currently authenticated user
    let dispatch = useDispatch(); // retrieve the Redux dispatch function to update global state

    useEffect(() => {
        const fetchUser = async () => { // define a function to asynchronously fetch current user data
            try { // wrap the API call in a try block to handle failures safely
                let result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true }); // request current user data from the backend while sending credentials
                dispatch(setUserData(result.data)); // store the fetched user data in Redux state
            } catch (error) { // handle errors that occur during the API request
                console.log(error); // log the error for debugging purposes
                dispatch(setUserData(null)); // clear user data in Redux to reflect unauthenticated state
            }
        };

        fetchUser(); // invoke the user-fetching function when the effect runs
    }, []); // ensure the effect runs only once on initial execution
};

export default getCurrentUser