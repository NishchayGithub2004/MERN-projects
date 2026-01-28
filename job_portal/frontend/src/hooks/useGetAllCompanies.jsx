import { setCompanies } from '@/redux/companySlice'; // import 'setCompanies' function to update state of companies in the redux store
import { COMPANY_API_END_POINT } from '@/utils/constant'; // import URL of company related backend API endpoint to access it
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { useEffect } from 'react'; // import 'useEffect' hook to perform side effects in functional components
import { useDispatch } from 'react-redux'; // import 'useDispatch' hook to dispatch actions to redux store

const useGetAllCompanies = () => { // create a custom hook to fetch all companies from the backend
    const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to the redux store

    useEffect(() => {
        const fetchCompanies = async () => { // create a function to fetch all companies
            try {
                const res = await axios.get( // make a GET request using 'axios' library
                    `${COMPANY_API_END_POINT}/get`, // this is the URL to make GET request to
                    { withCredentials: true } // send cookies to the backend
                );
                if (res.data.success) { // if data is fetched from backend successfully
                    dispatch(setCompanies(res.data.companies)); // dispatch fetched data and set companies state in the redux store to it
                }
            } catch (error) { // if any error occurs while fetching companies from backend
                console.log(error); // log the error to the console to know what error occured
            }
        };
        fetchCompanies(); // call the function to fetch companies
    }, []); // run this effect only once (when the component it is being used in mounts) by keeping dependency array empty
};

export default useGetAllCompanies; // export the hook to be used in other parts of the application