import React, { useEffect } from 'react' // import 'useEffect' hook to run side-effects
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { APPLICATION_API_END_POINT } from '@/utils/constant' // import the URL to make applications related backend request to
import { useParams } from 'react-router-dom' // import 'useParams' hook from 'react-router-dom' library to get URL parameters and their values
import { useDispatch, useSelector } from 'react-redux' // from 'react-redux' library, import 'useDispatch' hook to dispatch actions through functions to update value of state variables and 'useSelector' hook to access state variables of slices of redux store
import { setAllApplicants } from '@/redux/applicationSlice' // import 'setAllApplicants' function from 'applicationSlice' to update value of 'applicants' state variable

const Applicants = () => { // create a functional component called 'Applicants' 
    const params = useParams() // create an instance of 'useParams' hook to use it to get URL parameters and their values

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions through functions to update value of state variables

    const { applicants } = useSelector(store => store.application) // import 'applicants' object from 'application' slice of redux store to get applications data

    useEffect(() => { // use 'useEffect' hook to run side-effects
        const fetchAllApplicants = async () => { // create a function called 'fetchAllApplicants' to fetch all applicants
            try {
                const res = await axios.get( // make a GET request to the backend to fetch all applicants
                    `${APPLICATION_API_END_POINT}/${params.id}/applicants`, // URL to make backend request to
                    { withCredentials: true } // send cookies with the request for authentication
                )

                dispatch(setAllApplicants(res.data.job)) // dispatch response data of the backend to 'applicants' state using 'setAllApplicants' function
            } catch (error) { // if any error occurs while fetching all applications
                console.log(error) // log the error to the console to know what error occured
            }
        }

        fetchAllApplicants() // call the function to execute it
    }, []) // this side-effect runs only once (when the component mounts)

    return (
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>
                    Applicants {applicants?.applications?.length} {/* render the number of applicants for a job */}
                </h1>

                <ApplicantsTable /> {/* render the table of details of all applicants */}
            </div>
        </div>
    )
}

export default Applicants