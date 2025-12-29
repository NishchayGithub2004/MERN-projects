import { setAllJobs } from '@/redux/jobSlice'; // import setAllJobs action creator from jobSlice to update redux store with fetched job listings
import { JOB_API_END_POINT } from '@/utils/constant'; // import JOB_API_END_POINT constant containing base url for job-related api endpoints
import axios from 'axios'; // import axios to perform http requests for retrieving job data from backend
import { useEffect } from 'react'; // import useEffect hook to run side effects like api calls after component mount
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch for dispatching actions and useSelector for accessing redux state slices

const useGetAllJobs = () => { // define custom hook useGetAllJobs to fetch all job listings and update redux state accordingly
    const dispatch = useDispatch(); // initialize dispatch to enable dispatching actions to redux store
    const { searchedQuery } = useSelector(store => store.job); // extract searchedQuery from job slice of redux state to filter jobs by search keyword

    useEffect(() => { // run effect after component mount to initiate job data fetching
        const fetchAllJobs = async () => { // define asynchronous function fetchAllJobs to make api request for job listings
            try { // use try block to safely handle request errors
                const res = await axios.get( // perform http get request to backend api to retrieve job data
                    `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, // append search query parameter to endpoint for keyword-based job filtering
                    { withCredentials: true } // include credentials in request for authentication and session handling
                );
                if (res.data.success) { // verify api response indicates successful data retrieval
                    dispatch(setAllJobs(res.data.jobs)); // dispatch setAllJobs action with fetched jobs to update redux store
                }
            } catch (error) { // catch any network or api-related errors
                console.log(error); // log error details to console for debugging
            }
        };
        fetchAllJobs(); // immediately invoke fetchAllJobs after component mounts to start fetching job listings
    }, []); // pass empty dependency array to ensure effect executes only once during component lifecycle
};

export default useGetAllJobs; // export custom hook as default to reuse it for fetching all jobs across different components