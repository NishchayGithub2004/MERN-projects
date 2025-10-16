import { setCompanies } from '@/redux/companySlice' // import the setCompanies action creator from companySlice to update Redux state with fetched company data
import { COMPANY_API_END_POINT } from '@/utils/constant' // import COMPANY_API_END_POINT constant that holds the base API URL for company-related requests
import axios from 'axios' // import axios library to perform HTTP requests to the backend
import { useEffect } from 'react' // import useEffect hook from React to execute side effects after component mounting
import { useDispatch } from 'react-redux' // import useDispatch hook from react-redux to dispatch actions to the Redux store

const useGetAllCompanies = () => { // define a custom hook named useGetAllCompanies to fetch all companies and store them in Redux
    const dispatch = useDispatch(); // initialize the dispatch function for sending actions to the Redux store

    useEffect(() => { // call useEffect to perform the fetch operation after the component mounts
        const fetchCompanies = async () => { // define an asynchronous function fetchCompanies to request all company data from the backend
            try { // start a try block to handle potential request errors
                const res = await axios.get( // make an HTTP GET request using axios to fetch company data from the API
                    `${COMPANY_API_END_POINT}/get`, // construct the API endpoint URL by appending '/get' to COMPANY_API_END_POINT
                    { withCredentials: true } // include credentials like cookies in the request to support authentication
                );

                console.log('called'); // log 'called' to the console to confirm that the function was executed

                if (res.data.success) { // check if the response indicates success through the success property
                    dispatch( // dispatch an action to update Redux state with the fetched companies
                        setCompanies(res.data.companies) // call setCompanies with res.data.companies to store all companies in the Redux store
                    );
                }
            } catch (error) { // catch and handle any errors that occur during the request
                console.log(error); // log the error object to the console for debugging
            }
        }

        fetchCompanies(); // invoke the fetchCompanies function immediately after the component mounts to fetch data
    }, []); // provide an empty dependency array so this effect runs only once after mounting
}

export default useGetAllCompanies; // export the custom hook as the default export to be reused across components for company data fetching
