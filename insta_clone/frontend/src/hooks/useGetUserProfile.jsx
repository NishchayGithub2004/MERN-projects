import { setUserProfile } from "@/redux/authSlice"; // import the setUserProfile action creator from authSlice to update Redux state with user profile data
import axios from "axios"; // import axios library to perform HTTP requests
import { useEffect } from "react"; // import useEffect hook from React to handle side effects like fetching data
import { useDispatch } from "react-redux"; // import useDispatch hook from React-Redux to dispatch actions to the store

const useGetUserProfile = (userId) => { // define a custom hook useGetUserProfile that takes userId as an argument to fetch a specific user’s profile
    const dispatch = useDispatch(); // initialize dispatch function to send actions to the Redux store

    useEffect(() => { // use useEffect hook to perform profile fetching whenever userId changes
        const fetchUserProfile = async () => { // define an asynchronous function fetchUserProfile to handle API requests
            try { // start a try block to catch potential errors during the API request
                const res = await axios.get( // call axios.get to send a GET request to the backend server
                    `http://localhost:8080/api/v1/user/${userId}/profile`, // dynamically construct the API endpoint using the provided userId
                    { withCredentials: true } // include credentials (cookies or tokens) for authenticated requests
                );

                if (res.data.success) { // check if the API response indicates success
                    dispatch( // call dispatch to send an action to Redux store
                        setUserProfile(res.data.user) // call setUserProfile with the user object from the response to update Redux state
                    );
                }
            } catch (error) { // catch any errors thrown during the API call
                console.log(error); // log the error object to the console for debugging
            }
        }

        fetchUserProfile(); // invoke fetchUserProfile to execute the API request immediately when the effect runs
    }, [userId]); // include userId in the dependency array so the effect re-runs whenever userId changes
};

export default useGetUserProfile; // export the custom hook useGetUserProfile as the default export for reuse in other components
