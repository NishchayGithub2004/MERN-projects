import { setSuggestedUsers } from "@/redux/authSlice"; // import the setSuggestedUsers action creator from authSlice to update Redux state with suggested users
import axios from "axios"; // import axios library to perform HTTP requests
import { useEffect } from "react"; // import useEffect hook from React to perform side effects such as fetching data
import { useDispatch } from "react-redux"; // import useDispatch hook from React-Redux to dispatch actions to the Redux store

const useGetSuggestedUsers = () => { // define a custom hook useGetSuggestedUsers to fetch suggested users from the backend API
    const dispatch = useDispatch(); // initialize dispatch function to send actions to the Redux store

    useEffect(() => { // use useEffect hook to execute the fetch logic when the component mounts
        const fetchSuggestedUsers = async () => { // define an asynchronous function fetchSuggestedUsers to handle API requests
            try { // start a try block to catch errors during the API request
                const res = await axios.get( // call axios.get to send a GET request to the backend server
                    'http://localhost:8080/api/v1/user/suggested', // specify the endpoint to fetch suggested users
                    { withCredentials: true } // include credentials (cookies or tokens) for authenticated requests
                );

                if (res.data.success) { // check if the API response indicates a successful request
                    dispatch( // call dispatch to send an action to the Redux store
                        setSuggestedUsers(res.data.users) // call setSuggestedUsers with the users array from the response to update Redux state
                    );
                }
            } catch (error) { // catch any errors thrown during the API call
                console.log(error); // log the error object to the console for debugging
            }
        }

        fetchSuggestedUsers(); // invoke fetchSuggestedUsers to execute the API request immediately when the effect runs
    }, []); // pass an empty dependency array to run the effect only once when the component mounts
};

export default useGetSuggestedUsers; // export the custom hook useGetSuggestedUsers as the default export for reuse in components
