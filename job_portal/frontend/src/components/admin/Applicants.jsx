import React, { useEffect } from 'react' // import React and useEffect hook to handle side effects like API calls
import Navbar from '../shared/Navbar' // import Navbar component for top navigation
import ApplicantsTable from './ApplicantsTable' // import ApplicantsTable component to display list of applicants
import axios from 'axios'; // import axios library to make HTTP requests
import { APPLICATION_API_END_POINT } from '@/utils/constant'; // import constant that stores the base URL for application-related API endpoints
import { useParams } from 'react-router-dom'; // import useParams hook to access dynamic route parameters like job ID
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch to send Redux actions and useSelector to access Redux store data
import { setAllApplicants } from '@/redux/applicationSlice'; // import Redux action creator to set list of all applicants in store

const Applicants = () => { // define a function component Applicants to display job applicants for a specific job
    const params = useParams(); // call useParams to extract dynamic parameters (like job ID) from the route

    const dispatch = useDispatch(); // call useDispatch to get dispatch function for sending Redux actions

    const { applicants } = useSelector( // destructure 'applicants' from Redux store using useSelector hook
        store => store.application // access 'application' slice from Redux store to retrieve applicants data
    );

    useEffect(() => { // define side effect to fetch all applicants when the component first mounts
        const fetchAllApplicants = async () => { // define an asynchronous function to make API call for fetching applicants
            try {
                const res = await axios.get( // make GET request to backend using axios to fetch all applicants for a specific job
                    `${APPLICATION_API_END_POINT}/${params.id}/applicants`, // dynamically construct API URL using job ID from params
                    { withCredentials: true } // include credentials like cookies for authentication
                );

                dispatch( // dispatch Redux action to update global state with fetched applicants
                    setAllApplicants( // call Redux action creator to create an action with fetched job data as payload
                        res.data.job // pass job object (which contains applicants) from API response
                    )
                );
            } catch (error) { // handle any errors that occur during API call
                console.log(error); // log error details to console for debugging
            }
        }

        fetchAllApplicants(); // invoke the asynchronous function to fetch applicants
    }, []); // run this effect only once when the component mounts

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1> 
                <ApplicantsTable /> 
            </div>
        </div>
    )
}

export default Applicants
