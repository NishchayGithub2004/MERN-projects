import { setAllAppliedJobs } from "@/redux/jobSlice"; // import 'setAllAppliedJobs' function to update state of applied jobs in the redux store
import { APPLICATION_API_END_POINT } from "@/utils/constant"; // import URL of application related backend API endpoint to access it
import axios from "axios"; // import 'axios' library to make HTTP requests to the backend
import { useEffect } from "react"; // import 'useEffect' hook to perform side effects in functional components
import { useDispatch } from "react-redux"; // import 'useDispatch' hook to dispatch actions to redux store

const useGetAppliedJobs = () => { // create a custom hook to fetch all jobs user has applied to from the backend
    const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to the redux store

    useEffect(() => { // run this effect only once (when the component it is being used in mounts) by keeping dependency array empty
        const fetchAppliedJobs = async () => { // create a function to fetch all applied jobs
            try {
                const res = await axios.get( // make a GET request using 'axios' library
                    `${APPLICATION_API_END_POINT}/get`, // this is the URL to make GET request to
                    { withCredentials: true } // send cookies to the backend
                );
                if (res.data.success) { // if data is fetched from backend successfully
                    dispatch(setAllAppliedJobs(res.data.application)); // dispatch fetched data and set applied jobs state in the redux store to it
                }
            } catch (error) { // if any error occurs while fetching applied jobs from backend
                console.log(error); // log the error to the console to know what error occured
            }
        };
        fetchAppliedJobs(); // call the function to fetch the jobs user has applied to
    }, []); // run this effect only once (when the component it is being used in mounts) by keeping dependency array empty
};

export default useGetAppliedJobs; // export the hook to be used in other parts of the application