import { setSingleCompany } from '@/redux/companySlice' // import setSingleCompany action creator from companySlice to update Redux state with a specific company's data
import { setAllJobs } from '@/redux/jobSlice' // import setAllJobs action creator from jobSlice (although not used in this hook) to update Redux state with job listings
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant' // import API endpoint constants for company and job-related requests
import axios from 'axios' // import axios library to perform HTTP requests to the backend
import { useEffect } from 'react' // import useEffect hook from React to execute side effects after component mounting
import { useDispatch } from 'react-redux' // import useDispatch hook from react-redux to dispatch actions to the Redux store

const useGetCompanyById = (companyId) => { // define a custom hook named useGetCompanyById that takes companyId as an argument to fetch data for a specific company
    const dispatch = useDispatch(); // initialize dispatch function for sending actions to the Redux store
    
    useEffect(() => { // call useEffect to perform the fetch operation whenever companyId or dispatch changes
        const fetchSingleCompany = async () => { // define an asynchronous function fetchSingleCompany to request a company's data from the API
            try { // start a try block to handle potential API errors
                const res = await axios.get( // make an HTTP GET request using axios to fetch a specific company's data
                    `${COMPANY_API_END_POINT}/get/${companyId}`, // construct the API URL dynamically using the companyId
                    { withCredentials: true } // include credentials like cookies in the request for authentication
                );
                
                console.log(res.data.company); // log the retrieved company data to the console for debugging
                
                if (res.data.success) { // check if the response indicates success through the success property
                    dispatch( // dispatch an action to update Redux state with the fetched company data
                        setSingleCompany(res.data.company) // call setSingleCompany with res.data.company to store the single company's data in Redux
                    );
                }
            } catch (error) { // catch any errors that occur during the API request
                console.log(error); // log the error object to the console for debugging
            }
        }
        
        fetchSingleCompany(); // invoke fetchSingleCompany immediately to start fetching company data
    }, [companyId, dispatch]); // provide companyId and dispatch as dependencies to re-run the effect if either changes
}

export default useGetCompanyById; // export the custom hook as the default export to be reused across components for fetching a single company's data
