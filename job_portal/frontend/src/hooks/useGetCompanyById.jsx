import { setSingleCompany } from '@/redux/companySlice'; // import setSingleCompany action creator from companySlice to update redux state with data of a specific company
import { setAllJobs } from '@/redux/jobSlice'; // import setAllJobs action creator from jobSlice though not used here, typically used to store job listings
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'; // import api endpoint constants for company and job-related backend requests
import axios from 'axios'; // import axios to make http requests for fetching company data
import { useEffect } from 'react'; // import useEffect hook to perform side effects like api calls after component mounts
import { useDispatch } from 'react-redux'; // import useDispatch hook to dispatch redux actions

const useGetCompanyById = (companyId) => { // define custom hook useGetCompanyById that accepts companyId to fetch and store a specific company's data
    const dispatch = useDispatch(); // initialize dispatch function to send actions to redux store
    
    useEffect(() => { // run effect whenever companyId or dispatch changes to ensure data stays updated
        const fetchSingleCompany = async () => { // define async function fetchSingleCompany to request company data from backend
            try { // use try block to safely handle api request and potential errors
                const res = await axios.get( // make http get request using axios to fetch company data
                    `${COMPANY_API_END_POINT}/get/${companyId}`, // dynamically append companyId to endpoint to request specific company details
                    { withCredentials: true } // include credentials for authentication during the request
                );
                console.log(res.data.company); // log company data from api response for debugging purposes
                if (res.data.success) { // check if api response indicates success
                    dispatch(setSingleCompany(res.data.company)); // dispatch setSingleCompany action with fetched data to update redux store
                }
            } catch (error) { // handle any errors that occur during api request
                console.log(error); // log error details to console for debugging
            }
        };
        fetchSingleCompany(); // immediately invoke fetchSingleCompany after component mounts to fetch company data
    }, [companyId, dispatch]); // re-run effect if companyId or dispatch reference changes to maintain correct data
};

export default useGetCompanyById; // export custom hook as default so it can be reused in other components to fetch a company's details by id