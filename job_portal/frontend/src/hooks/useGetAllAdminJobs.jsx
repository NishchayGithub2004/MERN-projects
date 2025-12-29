import { setAllAdminJobs } from '@/redux/jobSlice'; // import setAllAdminJobs action creator from jobSlice to update redux state with list of admin jobs
import { JOB_API_END_POINT } from '@/utils/constant'; // import JOB_API_END_POINT constant containing base url for job-related api requests
import axios from 'axios'; // import axios to perform http requests for fetching data from backend
import { useEffect } from 'react'; // import useEffect hook from react to execute side effects like api calls after component mount
import { useDispatch } from 'react-redux'; // import useDispatch hook to obtain redux dispatch function for dispatching actions

const useGetAllAdminJobs = () => { // define custom hook useGetAllAdminJobs to fetch admin jobs from backend and store them in redux state
    const dispatch = useDispatch(); // initialize dispatch to enable sending actions to redux store

    useEffect(() => { // execute a side effect after component mount to fetch all admin jobs once
        const fetchAllAdminJobs = async () => { // define asynchronous function fetchAllAdminJobs to perform api request for admin job data
            try { // use try block to handle potential request or network errors safely
                const res = await axios.get( // make an http get request using axios to fetch admin jobs data from backend server
                    `${JOB_API_END_POINT}/getadminjobs`, // construct full api endpoint url by appending '/getadminjobs' to base job api endpoint
                    { withCredentials: true } // include credentials in request to authenticate admin user with cookies or tokens
                );
                if (res.data.success) { // check if response indicates success in data retrieval
                    dispatch(setAllAdminJobs(res.data.jobs)); // dispatch setAllAdminJobs with fetched jobs to update redux store
                }
            } catch (error) { // handle any errors encountered during api call
                console.log(error); // output error details to console for debugging
            }
        };
        fetchAllAdminJobs(); // immediately invoke fetchAllAdminJobs to initiate data fetch after component mounts
    }, []); // provide empty dependency array to ensure effect runs only once during component lifecycle
};

export default useGetAllAdminJobs; // export custom hook as default so it can be reused by components that need admin job data