import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create an manage state variables
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom' // import 'useParams' hook to get the job id from the URL by accessing URL parameters
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant' // import job applications and job URLs to make backend requests to
import { setSingleJob } from '@/redux/jobSlice' // import 'setSingleJob' function from 'jobSlice' of redux store to set job details
import { useDispatch, useSelector } from 'react-redux' // from 'react-redux' library, import 'useDispatch' hook to dispatch actions through functions to update value of state variables and 'useSelector' hook to access state variables of slices of redux store
import { toast } from 'sonner' // import 'toast' function from 'sonner' library to display toast/pop-up notifications

const JobDescription = () => { // create a functional component named 'JobDescription' to render job description UI
    const { singleJob } = useSelector(store => store.job) // import 'singleJob' state from 'job' slice of redux store to get the currently selected job details
    
    const { user } = useSelector(store => store.auth) // import 'user' state from 'auth' slice of redux store to get the currently logged in user details

    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false // check if the current user has already applied for the job and store it in variable 'isInitiallyApplied'

    const [isApplied, setIsApplied] = useState(isIntiallyApplied) // create a state variable 'isApplied' to track if the current user has applied for the job

    const params = useParams() // create an instance of 'useParams' hook use it to get the job id from the URL by accessing URL parameters
    
    const jobId = params.id // store unique ID of job from URL parameters in 'jobId' variable

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update value of state variables

    const applyJobHandler = async () => { // create a function called 'applyJobHandler' to apply to a job
        try {
            const res = await axios.get( // make a GET request to the backend URL
                `${APPLICATION_API_END_POINT}/apply/${jobId}`, // URL to make backend request to
                { withCredentials: true } // send cookies with the request to the backend for authentication
            )

            if (res.data.success) { // if backend successfully sends a response
                setIsApplied(true) // set value of state variable 'isApplied' to true

                // create an object called 'updatedSingleJob' that copies existing current job details and add current job to it's 'applications' array property

                const updatedSingleJob = {
                    ...singleJob,
                    applications: [
                        ...singleJob.applications,
                        { applicant: user?._id }
                    ]
                }

                dispatch(setSingleJob(updatedSingleJob)) // dispatch updated job details object to 'singleJob' state using 'setSingleJob' function
                
                toast.success(res.data.message) // display success toast/pop-up notification
            }
        } catch (error) { // if any error occurs while applying to a job
            console.log(error) // log the error to the console to know what error occurred
            toast.error(error.response.data.message) // display error toast/pop-up notification
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => { // create a function called 'fetchSingleJob' to fetch job details
            try {
                const res = await axios.get( // make a GET request to the backend
                    `${JOB_API_END_POINT}/get/${jobId}`, // URL to make backend request to
                    { withCredentials: true } // send cookies to the backend also for authentication
                )

                if (res.data.success) { // if backend successfully sends a response
                    dispatch(setSingleJob(res.data.job)) // dispatch job details object to 'singleJob' state using 'setSingleJob' function
                    // set value of 'isApplied' to true if the current user has already applied for the job
                    setIsApplied(
                        res.data.job.applications.some(
                            application => application.applicant === user?._id
                        )
                    )
                }
            } catch (error) { // if any error occurs while fetching job details
                console.log(error) // log the error to the console to know what error occurred
            }
        }

        fetchSingleJob() // call the function to execute it
    }, [jobId, dispatch, user?._id]) // re-run the function when user's unique ID, job' unique ID or dispatch function changes

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1> {/* render job title */}
                    
                    <div className='flex items-center gap-2 mt-4'>
                        {/* render number of vacancies available for the job, type of job, and salary of the job as badges */}
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">
                            {singleJob?.postion} Positions
                        </Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">
                            {singleJob?.jobType}
                        </Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">
                            {singleJob?.salary}LPA
                        </Badge>
                    </div>
                </div>

                <Button
                    onClick={isApplied ? null : applyJobHandler} // clicking the job calls 'applyJobHandler' function if value of 'isApplied' is false ie user hasn't applied for the job
                    disabled={isApplied} // disable the button if value of 'isApplied' is true user has already applied for the job
                    className={`rounded-lg ${isApplied // apply styles based on value of 'isApplied'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                        }`}
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'} {/* render text based on 'isApplied' value */}
                </Button>
            </div>
            
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            
            <div className='my-4'>
                {/* render job title, location, description, experience required, salary, total applicants and date job was posted */}

                <h1 className='font-bold my-1'>
                    Role:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.title}
                    </span>
                </h1>
                <h1 className='font-bold my-1'>
                    Location:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.location}
                    </span>
                </h1>
                <h1 className='font-bold my-1'>
                    Description:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.description}
                    </span>
                </h1>
                <h1 className='font-bold my-1'>
                    Experience:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.experience} yrs
                    </span>
                </h1>
                <h1 className='font-bold my-1'>
                    Salary:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.salary}LPA
                    </span>
                </h1>
                <h1 className='font-bold my-1'>
                    Total Applicants:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.applications?.length}
                    </span>
                </h1>
                <h1 className='font-bold my-1'>
                    Posted Date:
                    <span className='pl-4 font-normal text-gray-800'>
                        {singleJob?.createdAt.split("T")[0]}
                    </span>
                </h1>
            </div>
        </div>
    )
}

export default JobDescription