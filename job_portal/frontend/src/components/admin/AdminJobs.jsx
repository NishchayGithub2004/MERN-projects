import React, { useEffect, useState } from 'react' // import react library to create components, useEffect for side effects, and useState for local state management
import Navbar from '../shared/Navbar' // import Navbar component to display top navigation bar
import { Input } from '../ui/input' // import Input component from UI library to allow user text input
import { Button } from '../ui/button' // import Button component from UI library to create clickable buttons
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically redirect users between routes
import { useDispatch } from 'react-redux' // import useDispatch hook to dispatch actions to redux store
import AdminJobsTable from './AdminJobsTable' // import AdminJobsTable component to display list of admin job records
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs' // import custom hook that fetches all admin job data from api
import { setSearchJobByText } from '@/redux/jobSlice' // import action creator to update job search filter text in redux store

const AdminJobs = () => { // define a functional component named 'AdminJobs' to manage job listings and filter input logic
    useGetAllAdminJobs() // call custom hook to fetch all admin jobs when the component mounts

    const [input, setInput] = useState("") // define local state 'input' initialized as empty string to store user search text and 'setInput' function to update it

    const navigate = useNavigate() // call useNavigate to get navigation function for route redirection

    const dispatch = useDispatch() // call useDispatch to get dispatch function for sending redux actions

    useEffect(() => { // define side effect that executes whenever 'input' changes
        dispatch( // call dispatch to send action to redux store
            setSearchJobByText( // call action creator to generate an action for updating search text
                input // pass current input state as payload to update search filter value in redux
            )
        ) // close dispatch call
    }, [input]) // specify dependency array containing 'input' so effect re-runs when user modifies search text

    return ( // return jsx structure to render navbar, search input, button, and job table
        <div>
            <Navbar /> 
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input 
                        className="w-fit"
                        placeholder="Filter by name, role"
                        onChange={(e) => setInput(e.target.value)} // update input state with new text when user types in search field
                    />
                    <Button onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button> {/* navigate to job creation page when button is clicked */}
                </div>
                <AdminJobsTable /> {/* render table component displaying all admin job listings */}
            </div>
        </div>
    )
}

export default AdminJobs // export AdminJobs component as default for use in other modules
