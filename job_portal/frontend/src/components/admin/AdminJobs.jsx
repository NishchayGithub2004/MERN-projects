import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create an manage state variables
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate to different pages
import { useDispatch } from 'react-redux' // import 'useDispatch' hook to dispatch actions to redux slices to change values to state variables
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs' // import custom hook 'useGetAllAdminJobs' to get all jobs created by the user
import { setSearchJobByText } from '@/redux/jobSlice' // import 'setSearchJobByText' function from 'jobSlice' of redux store to search job by text

const AdminJobs = () => { // create a functional component called 'AdminJobs' to render and see jobs created by the user
    useGetAllAdminJobs() // call custom hook 'useGetAllAdminJobs' to get all jobs created by the user

    const [input, setInput] = useState("") // create a state variable 'input' to store the text entered by the user with initial value of empty string and a function called 'setInput' to change its value

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate b/w different pages

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update value of state variables

    // create a side-effect that re-runs when value of 'input' variable changes, it dispatches new value of 'input' to 'searchJobByText' state using 'setSearchJobByText' function
    
    useEffect(() => {
        dispatch(setSearchJobByText(input))
    }, [input])

    return (
        <div>
            <Navbar />

            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name, role"
                        onChange={(e) => setInput(e.target.value)} // when value of this input field changes, update value of 'input' state variable
                    />
                    <Button onClick={() => navigate("/admin/jobs/create")}> {/* when this button is clicked, navigate to the page where user can create the job */}
                        New Jobs
                    </Button>
                </div>
                <AdminJobsTable />
            </div>
        </div>
    )
}

export default AdminJobs