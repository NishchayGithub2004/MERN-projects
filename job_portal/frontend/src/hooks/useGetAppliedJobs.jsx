import { setAllAppliedJobs } from "@/redux/jobSlice"; // import setAllAppliedJobs action creator from jobSlice to update redux state with list of applied jobs
import { APPLICATION_API_END_POINT } from "@/utils/constant"; // import APPLICATION_API_END_POINT constant containing base url for application-related api requests
import axios from "axios"; // import axios to perform http requests for fetching applied job data
import { useEffect } from "react"; // import useEffect hook to perform side effects like api calls after component mount
import { useDispatch } from "react-redux"; // import useDispatch to send actions to redux store

const useGetAppliedJobs = () => { // define custom hook useGetAppliedJobs to fetch all jobs user has applied for and update redux store
    const dispatch = useDispatch(); // initialize dispatch function to enable sending actions to redux store

    useEffect(() => { // execute effect after component mount to start fetching applied jobs
        const fetchAppliedJobs = async () => { // define asynchronous function fetchAppliedJobs to request applied job data from backend
            try { // use try block to safely handle api request and possible errors
                const res = await axios.get( // make http get request using axios to fetch applied jobs
                    `${APPLICATION_API_END_POINT}/get`, // construct endpoint by appending '/get' to application api base url
                    { withCredentials: true } // include credentials for authentication when making the request
                );
                console.log(res.data); // log api response data to console for debugging and verification
                if (res.data.success) { // check if api response indicates successful data retrieval
                    dispatch(setAllAppliedJobs(res.data.application)); // dispatch setAllAppliedJobs action with fetched data to update redux store
                }
            } catch (error) { // catch any errors that occur during api request
                console.log(error); // log error details to console for debugging
            }
        };
        fetchAppliedJobs(); // immediately call fetchAppliedJobs after mount to initiate data fetching
    }, []); // pass empty dependency array so effect runs only once during component lifecycle
};

export default useGetAppliedJobs; // export custom hook as default so it can be reused to fetch applied jobs in different components