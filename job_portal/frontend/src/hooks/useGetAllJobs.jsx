import { setAllJobs } from '@/redux/jobSlice' // import the setAllJobs action creator from jobSlice to update Redux state with fetched job data
import { JOB_API_END_POINT } from '@/utils/constant' // import JOB_API_END_POINT constant that stores the base API URL for job-related requests
import axios from 'axios' // import axios library to make HTTP requests to the backend
import { useEffect } from 'react' // import useEffect hook from React to perform side effects after component mounting
import { useDispatch, useSelector } from 'react-redux' // import useDispatch to dispatch actions and useSelector to select state slices from Redux store

const useGetAllJobs = () => { // define a custom hook named useGetAllJobs to fetch all jobs from the backend and update Redux state
    const dispatch = useDispatch(); // initialize dispatch function to send actions to the Redux store

    const { searchedQuery } = useSelector(store => store.job); // extract searchedQuery from the job slice of Redux store to use as a search keyword for fetching jobs

    useEffect(() => { // call useEffect to execute the fetch operation after the component mounts
        const fetchAllJobs = async () => { // define an asynchronous function fetchAllJobs to request jobs from the API
            try { // start a try block to handle potential errors during the API request
                const res = await axios.get( // make an HTTP GET request using axios to fetch jobs
                    `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, // append the searchedQuery as a query parameter to filter jobs based on keyword
                    { withCredentials: true } // include credentials like cookies in the request for authentication
                );

                if (res.data.success) { // check if the response indicates success through the success property
                    dispatch( // dispatch an action to update the Redux store with the fetched jobs
                        setAllJobs(res.data.jobs) // call setAllJobs with res.data.jobs to store all jobs in Redux state
                    );
                }
            } catch (error) { // catch any errors that occur during the request
                console.log(error); // log the error object to the console for debugging
            }
        }

        fetchAllJobs(); // invoke the fetchAllJobs function immediately after component mount to start fetching job data
    }, []); // provide an empty dependency array so the effect runs only once after mounting
}

export default useGetAllJobs; // export the custom hook as the default export to reuse across components for fetching job data
