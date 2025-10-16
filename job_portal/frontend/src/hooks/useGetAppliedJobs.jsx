import { setAllAppliedJobs } from "@/redux/jobSlice"; // import the setAllAppliedJobs action creator from jobSlice to update Redux state with jobs the user has applied for
import { APPLICATION_API_END_POINT } from "@/utils/constant"; // import APPLICATION_API_END_POINT constant that stores the base API URL for application-related requests
import axios from "axios" // import axios library to perform HTTP requests to the backend
import { useEffect } from "react" // import useEffect hook from React to perform side effects after component mounts
import { useDispatch } from "react-redux" // import useDispatch hook from react-redux to dispatch actions to the Redux store

const useGetAppliedJobs = () => { // define a custom hook named useGetAppliedJobs to fetch all applied jobs and update Redux state
    const dispatch = useDispatch(); // initialize dispatch function for sending actions to the Redux store

    useEffect(() => { // call useEffect to execute the API fetch operation after the component mounts
        const fetchAppliedJobs = async () => { // define an asynchronous function fetchAppliedJobs to request applied jobs from the API
            try { // start a try block to handle potential request errors
                const res = await axios.get( // make an HTTP GET request using axios to fetch applied job data
                    `${APPLICATION_API_END_POINT}/get`, // construct the API URL by appending '/get' to APPLICATION_API_END_POINT
                    { withCredentials: true } // include credentials like cookies in the request for authentication
                );

                console.log(res.data); // log the response data to the console for debugging purposes

                if (res.data.success) { // check if the response indicates success through the success property
                    dispatch( // dispatch an action to update Redux state with the fetched applied jobs
                        setAllAppliedJobs(res.data.application) // call setAllAppliedJobs with res.data.application to store all applied jobs in Redux state
                    );
                }
            } catch (error) { // catch and handle any errors that occur during the request
                console.log(error); // log the error object to the console for debugging
            }
        }

        fetchAppliedJobs(); // invoke the fetchAppliedJobs function immediately after component mount to start fetching applied jobs
    }, []); // provide an empty dependency array so this effect runs only once after mounting
};

export default useGetAppliedJobs; // export the custom hook as the default export to be reused across components for fetching applied jobs
