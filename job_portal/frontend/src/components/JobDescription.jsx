import React, { useEffect, useState } from 'react' // import React library to define component and use hooks for managing side-effects and state
import { Badge } from './ui/badge' // import Badge UI component to visually display job details like tags
import { Button } from './ui/button' // import Button UI component to handle user actions such as applying for a job
import { useParams } from 'react-router-dom' // import hook to access URL parameters like job ID for fetching job data
import axios from 'axios' // import axios library to perform HTTP requests to backend API
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant' // import API endpoint constants for cleaner and maintainable URL management
import { setSingleJob } from '@/redux/jobSlice' // import Redux action creator to update single job data in global state
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to access state (useSelector) and dispatch actions (useDispatch)
import { toast } from 'sonner' // import toast utility to display success or error notifications to user

const JobDescription = () => { // define a functional component named JobDescription to display a specific job and allow application handling
    const { singleJob } = useSelector(store => store.job) // extract singleJob from job slice in Redux store to get currently selected job data

    const { user } = useSelector(store => store.auth) // extract authenticated user information from Redux store to check login and application status

    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false // determine if user has already applied to this job; return false if data not available

    const [isApplied, setIsApplied] = useState(isIntiallyApplied) // initialize local state isApplied with initial application status and allow updates when user applies

    const params = useParams() // retrieve dynamic route parameters such as job ID from URL

    const jobId = params.id // store extracted job ID from params for API calls and state updates

    const dispatch = useDispatch() // get dispatch function from Redux to update store when job data or application status changes

    const applyJobHandler = async () => { // define asynchronous function to handle job application when user clicks apply button
        try { // start error handling block to catch failed API calls
            const res = await axios.get( // send GET request to backend API to apply for job
                `${APPLICATION_API_END_POINT}/apply/${jobId}`, // dynamically construct endpoint URL using job ID
                { withCredentials: true } // include credentials such as cookies for authentication
            )

            if (res.data.success) { // check if API response indicates successful job application
                setIsApplied(true) // update local state to reflect that user has applied successfully
                
                const updatedSingleJob = { // create updated job object reflecting new application state
                    ...singleJob, // copy all existing job details
                    applications: [ // update applications list with current user's new application
                        ...singleJob.applications, 
                        { applicant: user?._id } // add logged-in user's ID as applicant
                    ]
                }

                dispatch(setSingleJob(updatedSingleJob)) // dispatch Redux action to update singleJob data in store for real-time UI update

                toast.success(res.data.message) // show success notification message from API response
            }
        } catch (error) { // catch block to handle request or server errors
            console.log(error) // log error to console for debugging purposes
            toast.error(error.response.data.message) // display error notification message to user
        }
    }

    useEffect(() => { // define effect to fetch job data whenever jobId, dispatch, or user ID changes
        const fetchSingleJob = async () => { // define asynchronous helper function to fetch single job details
            try { // handle errors during fetch process
                const res = await axios.get( // send GET request to backend to fetch job data
                    `${JOB_API_END_POINT}/get/${jobId}`, // dynamically construct endpoint using job ID
                    { withCredentials: true } // include credentials for authenticated request
                )

                if (res.data.success) { // check if job fetch operation succeeded
                    dispatch(setSingleJob(res.data.job)) // update Redux store with fetched job data
                    
                    setIsApplied( // synchronize local application state with server response
                        res.data.job.applications.some(application => application.applicant === user?._id) // check if current user already applied
                    )
                }
            } catch (error) { // catch API or network errors
                console.log(error) // log error for debugging to developer console
            }
        }

        fetchSingleJob() // immediately invoke fetch function to get job data on component mount or dependency change
    }, [jobId, dispatch, user?._id]) // re-run effect when jobId, dispatch reference, or user ID changes

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : applyJobHandler} // attach click handler only if user hasn't applied to avoid duplicate requests
                    disabled={isApplied} // disable button if user already applied to prevent further interaction
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'} {/* dynamically render button text based on application status */}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1> {/* extract and show only date part from ISO string for clarity */}
            </div>
        </div>
    )
}

export default JobDescription // export JobDescription component as default for external use
