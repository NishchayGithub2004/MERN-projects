import { setAllJobs } from '@/redux/jobSlice'; // import 'setAllJobs' function to update state of jobs in the redux store
import { JOB_API_END_POINT } from '@/utils/constant'; // import URL of job related backend API endpoint to access it
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { useEffect } from 'react'; // import 'useEffect' hook to perform side effects in functional components
import { useDispatch, useSelector } from 'react-redux'; // import 'useDispatch' hook to dispatch actions to redux store and 'useSelector' hook to select state from the Redux store

const useGetAllJobs = () => { // create a custom hook to fetch all jobs from the backend
    const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to the redux store
    const { searchedQuery } = useSelector(store => store.job); // select 'searchedQuery' state from the redux store

    useEffect(() => {
        const fetchAllJobs = async () => { // create a function to fetch all jobs
            try {
                const res = await axios.get( // make a GET request using 'axios' library
                    `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, // this is the URL to make GET request to
                    { withCredentials: true } // send cookies to the backend
                );
                if (res.data.success) { // if data is fetched from backend successfully
                    dispatch(setAllJobs(res.data.jobs)); // dispatch fetched data and set jobs state in the redux store to it
                }
            } catch (error) { // if any error occurs while fetching jobs from backend
                console.log(error); // log the error to the console to know what error occured
            }
        };
        fetchAllJobs(); // call the function to fetch jobs
    }, []); // run this effect only once (when the component it is being used in mounts) by keeping dependency array empty
};

export default useGetAllJobs; // export the hook to be used in other parts of the application