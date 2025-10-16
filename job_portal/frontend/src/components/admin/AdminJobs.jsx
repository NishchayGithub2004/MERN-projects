import React, { useEffect, useState } from 'react' // import React along with useEffect for side effects and useState for state management
import Navbar from '../shared/Navbar' // import Navbar component for displaying top navigation
import { Input } from '../ui/input' // import Input component from the UI library
import { Button } from '../ui/button' // import Button component from the UI library
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically change routes
import { useDispatch } from 'react-redux' // import useDispatch hook to send actions to the Redux store
import AdminJobsTable from './AdminJobsTable' // import AdminJobsTable component that lists all admin jobs
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs' // import custom hook to fetch all admin job data
import { setSearchJobByText } from '@/redux/jobSlice' // import Redux action creator to update job search filter text

const AdminJobs = () => { // define a function component named AdminJobs that manages job listings and search filter
    useGetAllAdminJobs(); // call custom hook to fetch all jobs from API when component mounts

    const [input, setInput] = useState(""); // define state variable 'input' initialized to empty string and setter 'setInput' to update it on user input

    const navigate = useNavigate(); // call useNavigate to get function that allows navigation to different routes

    const dispatch = useDispatch(); // call useDispatch to get function used for dispatching Redux actions

    useEffect(() => { // define side effect that triggers whenever 'input' changes
        dispatch( // dispatch Redux action to update job search text in the global store
            setSearchJobByText( // call action creator that creates action with payload containing current input value
                input // pass current input value as argument to update search filter
            )
        );
    }, [input]); // re-run effect every time 'input' state changes

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name, role"
                        onChange={(e) => setInput(e.target.value)} // update input state whenever user types by reading event target value
                    />
                    <Button onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button> {/* navigate to job creation page when button is clicked */}
                </div>
                <AdminJobsTable />
            </div>
        </div>
    )
}

export default AdminJobs
