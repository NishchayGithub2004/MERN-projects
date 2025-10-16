import { setAllAdminJobs } from '@/redux/jobSlice' // import the setAllAdminJobs action creator from jobSlice to update the Redux store with admin job data
import { JOB_API_END_POINT } from '@/utils/constant' // import JOB_API_END_POINT constant that stores the base URL for job-related API requests
import axios from 'axios' // import axios library to make HTTP requests to the backend
import { useEffect } from 'react' // import useEffect hook from React to perform side effects like API calls after component mount
import { useDispatch } from 'react-redux' // import useDispatch hook from react-redux to dispatch actions to the Redux store

const useGetAllAdminJobs = () => { // define a custom hook named useGetAllAdminJobs to fetch all admin jobs and update the Redux state
    const dispatch = useDispatch(); // initialize the dispatch function to send actions to the Redux store

    useEffect(() => { // call useEffect to perform the job-fetching side effect when the component mounts
        const fetchAllAdminJobs = async () => { // define an asynchronous function fetchAllAdminJobs to fetch admin job data from the API
            try { // use try block to handle API requests safely
                const res = await axios.get( // make an HTTP GET request using axios to retrieve admin job data from the backend
                    `${JOB_API_END_POINT}/getadminjobs`, // construct the API URL by appending '/getadminjobs' to the JOB_API_END_POINT constant
                    { withCredentials: true } // include credentials like cookies in the request for authentication
                );

                if (res.data.success) { // check if the response data contains a success property set to true
                    dispatch( // dispatch an action to update the Redux store with fetched job data
                        setAllAdminJobs(res.data.jobs) // call setAllAdminJobs with res.data.jobs to store all admin jobs in the Redux state
                    );
                }
            } catch (error) { // handle any errors that occur during the API request
                console.log(error); // log the error to the console for debugging
            }
        }

        fetchAllAdminJobs(); // invoke the fetchAllAdminJobs function immediately after component mount to start data fetching
    }, []); // provide an empty dependency array so the effect runs only once after the component mounts
}

export default useGetAllAdminJobs; // export the custom hook as the default export so it can be reused across components
