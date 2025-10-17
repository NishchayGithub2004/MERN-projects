import { setPosts } from "@/redux/postSlice"; // import the setPosts action creator from postSlice to update Redux state with all posts
import axios from "axios"; // import axios library to make HTTP requests to the backend API
import { useEffect } from "react"; // import useEffect hook from React to perform side effects like fetching data
import { useDispatch } from "react-redux"; // import useDispatch hook from React-Redux to dispatch actions to the store

const useGetAllPost = () => { // define a custom hook useGetAllPost to fetch all posts from the backend API
    const dispatch = useDispatch(); // initialize dispatch function to send actions to the Redux store

    useEffect(() => { // use useEffect hook to trigger the post fetching logic when the component mounts
        const fetchAllPost = async () => { // define an asynchronous function fetchAllPost to handle API calls for fetching posts
            try { // start a try block to catch potential errors during the API request
                const res = await axios.get( // call axios.get to send a GET request to the backend endpoint
                    'http://localhost:8080/api/v1/post/all', // specify the API endpoint to retrieve all posts
                    { withCredentials: true } // include credentials (cookies or tokens) in the request for authentication
                );

                if (res.data.success) { // check if the response indicates a successful request
                    console.log(res.data.posts); // log the retrieved posts to the console for debugging
                    dispatch( // call dispatch to send an action to Redux store
                        setPosts(res.data.posts) // call setPosts with the posts array from the response to update Redux state
                    );
                }
            } catch (error) { // catch any errors thrown during the API request
                console.log(error); // log the error object to the console for debugging
            }
        }

        fetchAllPost(); // invoke fetchAllPost to initiate the API call when the component is mounted
    }, []); // pass an empty dependency array so the effect runs only once when the component mounts
};

export default useGetAllPost; // export the custom hook useGetAllPost as the default export for reuse in other components
