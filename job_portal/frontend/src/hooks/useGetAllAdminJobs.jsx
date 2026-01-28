import { setAllAdminJobs } from '@/redux/jobSlice'; // import 'setAllAdminJobs' function to update state of jobs posted by admin
import { JOB_API_END_POINT } from '@/utils/constant'; // import URL of job related backend API endpoint to access it
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { useEffect } from 'react'; // import 'useEffect' hook to perform side effects in functional components
import { useDispatch } from 'react-redux'; // import 'useDispatch' hook to dispatch actions to redux store

const useGetAllAdminJobs = () => { // create a custom hook to fetch all jobs posted by admin from the backend
    const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to the redux store

    useEffect(() => {
        const fetchAllAdminJobs = async () => { // create a function to fetch all jobs posted by admin
            try {
                const res = await axios.get( // make a GET request using 'axios' library
                    `${JOB_API_END_POINT}/getadminjobs`, // this is the URL to make GET request to
                    { withCredentials: true } // send cookies to the backend
                );
                if (res.data.success) { // if data is fetched from backend successfully
                    dispatch(setAllAdminJobs(res.data.jobs)); // dispatch fetched data and set admin jobs state in the redux store to it
                }
            } catch (error) { // if any error occurs while fetching admin jobs from backend
                console.log(error); // log the error to the console to know what error occured
            }
        };
        fetchAllAdminJobs(); // call the function to fetch admin jobs
    }, []); // run this effect only once (when the component it is being used in mounts) by keeping dependency array empty
};

export default useGetAllAdminJobs; // export the hook to be used in other parts of the application