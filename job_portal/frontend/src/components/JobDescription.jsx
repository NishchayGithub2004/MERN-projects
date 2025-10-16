import React, { useEffect, useState } from 'react' // import React and hooks useEffect for side-effects and useState for local state management
import { Badge } from './ui/badge' // import Badge component for displaying tags
import { Button } from './ui/button' // import Button component for user interactions
import { useParams } from 'react-router-dom'; // import useParams hook to access route parameters
import axios from 'axios'; // import axios for HTTP requests
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'; // import API endpoint constants for jobs and applications
import { setSingleJob } from '@/redux/jobSlice'; // import Redux action to update single job in the store
import { useDispatch, useSelector } from 'react-redux'; // import Redux hooks to dispatch actions and select state
import { toast } from 'sonner'; // import toast for notifications

const JobDescription = () => { // define a function component JobDescription to display job details and handle job application
    const { singleJob } = useSelector(store => store.job); // select singleJob from Redux store to get current job data

    const { user } = useSelector(store => store.auth); // select current user from Redux store for authentication checks

    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false; // check if current user has already applied to this job by checking applications array; default to false if undefined

    const [isApplied, setIsApplied] = useState(isIntiallyApplied); // initialize local state isApplied with whether user has already applied; setIsApplied updates this state

    const params = useParams(); // get route parameters from URL

    const jobId = params.id; // extract job ID from route parameters

    const dispatch = useDispatch(); // get Redux dispatch function to update store

    const applyJobHandler = async () => { // define a function to handle job application when user clicks "Apply Now"
        try {
            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`, // construct API endpoint URL for applying to job
                { withCredentials: true } // include credentials like cookies for authentication
            );

            if (res.data.success) { // check if API response indicates successful application
                setIsApplied(true); // update local state to reflect that user has applied
                
                const updatedSingleJob = { 
                    ...singleJob, // copy existing singleJob data
                    applications: [
                        ...singleJob.applications, 
                        { applicant: user?._id } // add current user's application to applications array
                    ] 
                }
                
                dispatch(setSingleJob(updatedSingleJob)); // update Redux store to reflect new application for real-time UI update
                
                toast.success(res.data.message); // show success toast notification
            }
        } catch (error) { // handle errors during API request
            console.log(error); // log error to console for debugging
            toast.error(error.response.data.message); // show error toast notification
        }
    }

    useEffect(() => { // define side-effect to fetch single job details when jobId, dispatch, or user changes
        const fetchSingleJob = async () => { // define an async function to fetch job data
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${jobId}`, // construct API endpoint URL for fetching single job
                    { withCredentials: true } // include credentials like cookies for authentication
                );

                if (res.data.success) { // check if API response is successful
                    dispatch(setSingleJob(res.data.job)); // update Redux store with fetched job data
                    
                    setIsApplied(
                        res.data.job.applications.some(application => application.applicant === user?._id)
                    ); // sync local isApplied state with fetched data
                }
            } catch (error) { // handle errors during fetch
                console.log(error); // log error to console
            }
        }

        fetchSingleJob(); // call async function to fetch job data
    }, [jobId, dispatch, user?._id]); // run effect when jobId, dispatch function, or user ID changes

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
                    onClick={isApplied ? null : applyJobHandler} 
                    // conditionally attach applyJobHandler if user hasn't applied; null disables click
                    disabled={isApplied} 
                    // disable button if user has already applied
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'} 
                    {/* dynamically change button text based on isApplied state */}
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
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1> {/* split createdAt ISO string to display only date */}
            </div>
        </div>
    )
}

export default JobDescription // export JobDescription component as default export
