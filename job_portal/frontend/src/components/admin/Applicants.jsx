import React, { useEffect } from 'react' // import react library to create components and useEffect hook to handle side effects like api calls
import Navbar from '../shared/Navbar' // import Navbar component to render top navigation bar
import ApplicantsTable from './ApplicantsTable' // import ApplicantsTable component to display applicants list
import axios from 'axios' // import axios library to perform http requests to backend
import { APPLICATION_API_END_POINT } from '@/utils/constant' // import constant variable storing base url for application related api endpoints
import { useParams } from 'react-router-dom' // import useParams hook to access dynamic route parameters such as job id
import { useDispatch, useSelector } from 'react-redux' // import useDispatch to send actions and useSelector to access redux store data
import { setAllApplicants } from '@/redux/applicationSlice' // import redux action creator to update applicants list in global store

const Applicants = () => { // define a functional component named 'Applicants' to display job applicants for a specific job
    const params = useParams() // call useParams hook to get dynamic route params like job id from url

    const dispatch = useDispatch() // call useDispatch to get dispatch function for sending redux actions

    const { applicants } = useSelector(store => store.application) // destructure 'applicants' object from 'application' slice in redux store to access applicants data

    useEffect(() => { // define side effect to fetch applicants when component mounts
        const fetchAllApplicants = async () => { // define async function to make api request and handle response
            try { 
                const res = await axios.get( // make get request to backend server to fetch applicants data for a job
                    `${APPLICATION_API_END_POINT}/${params.id}/applicants`, // dynamically build api endpoint using job id from route params
                    { withCredentials: true } // include credentials for authentication when making api request
                ) 
                dispatch( // call dispatch to send redux action with fetched data
                    setAllApplicants( // call action creator to create redux action for updating applicants data
                        res.data.job // pass job object from api response which contains applicants array as payload
                    )
                ) 
            } catch (error) { // handle error if api call fails
                console.log(error) // log error object to console for debugging purpose
            }
        } 
        fetchAllApplicants() // call the async function to initiate api call and fetch applicants
    }, []) // provide empty dependency array so effect runs only once when component first renders

    return ( // return jsx to render navbar, heading, and applicants table
        <div>
            <Navbar /> 
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>
                    Applicants {applicants?.applications?.length} 
                </h1> 
                <ApplicantsTable /> 
            </div>
        </div>
    )
}

export default Applicants // export Applicants component as default to use it in other parts of the app