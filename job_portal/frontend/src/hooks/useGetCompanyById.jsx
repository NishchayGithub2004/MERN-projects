import { setSingleCompany } from '@/redux/companySlice'; // import 'setSingleCompany' function to update state of single company in the redux store
import { COMPANY_API_END_POINT } from '@/utils/constant'; // import URL of company related backend API endpoint to access it
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { useEffect } from 'react'; // import 'useEffect' hook to perform side effects in functional components
import { useDispatch } from 'react-redux'; // import 'useDispatch' hook to dispatch actions to redux store

const useGetCompanyById = (companyId) => { // create a custom hook to fetch a single company's data from the backend
    const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to the redux store
    
    useEffect(() => { // run this effect only once (when the component it is being used in mounts) by keeping dependency array empty
        const fetchSingleCompany = async () => { // create a function to fetch a single company's data
            try {
                const res = await axios.get( // make a GET request using 'axios' library
                    `${COMPANY_API_END_POINT}/get/${companyId}`, // this is the URL to make GET request to
                    { withCredentials: true } // send cookies to the backend
                );
                if (res.data.success) { // if data is fetched from backend successfully
                    dispatch(setSingleCompany(res.data.company)); // dispatch fetched data and set single company state in the redux store to it
                }
            } catch (error) { // if any error occurs while fetching company data from backend
                console.log(error); // log the error to the console to know what error occured
            }
        };
        fetchSingleCompany(); // call the function to fetch a single company's data
    }, [companyId, dispatch]); // run this effect when company's ID changes ie when user navigates to a different company's page or when user refreshes the page (state is dispatched to redux slice again)
};

export default useGetCompanyById; // export the hook to be used in other parts of the application