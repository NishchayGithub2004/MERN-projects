import { setCompanies } from '@/redux/companySlice'; // import setCompanies action creator from companySlice to update redux store with fetched company list
import { COMPANY_API_END_POINT } from '@/utils/constant'; // import COMPANY_API_END_POINT constant containing base url for company-related api requests
import axios from 'axios'; // import axios to perform http requests for retrieving company data from backend
import { useEffect } from 'react'; // import useEffect hook to run side effects such as data fetching after component mount
import { useDispatch } from 'react-redux'; // import useDispatch hook to obtain dispatch function for sending actions to redux store

const useGetAllCompanies = () => { // define custom hook useGetAllCompanies to fetch company data and store it in redux state
    const dispatch = useDispatch(); // initialize dispatch to enable dispatching actions that modify redux state

    useEffect(() => { // run effect once after component mounts to trigger company data fetching
        const fetchCompanies = async () => { // define asynchronous function fetchCompanies to handle company data retrieval
            try { // use try block to safely handle request and potential errors
                const res = await axios.get( // make http get request to backend to fetch all companies
                    `${COMPANY_API_END_POINT}/get`, // form complete api endpoint by appending '/get' to base company api endpoint
                    { withCredentials: true } // include authentication credentials such as cookies for secure request
                );
                console.log('called'); // log message to confirm api call was executed
                if (res.data.success) { // verify response indicates successful data retrieval
                    dispatch(setCompanies(res.data.companies)); // dispatch setCompanies action with fetched data to update redux store
                }
            } catch (error) { // handle any network or response errors
                console.log(error); // log error details to console for debugging purposes
            }
        };
        fetchCompanies(); // immediately call fetchCompanies to start fetching company data after component mounts
    }, []); // pass empty dependency array so effect executes only once during component lifecycle
};

export default useGetAllCompanies; // export custom hook as default to reuse it for fetching company data in multiple components