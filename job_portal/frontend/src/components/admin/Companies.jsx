import React, { useEffect, useState } from 'react' // import React along with useEffect for running side effects and useState for managing local state
import Navbar from '../shared/Navbar' // import Navbar component to display the top navigation bar
import { Input } from '../ui/input' // import Input component for taking user input
import { Button } from '../ui/button' // import Button component for clickable button functionality
import CompaniesTable from './CompaniesTable' // import CompaniesTable component to display list of companies
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate to other routes
import useGetAllCompanies from '@/hooks/useGetAllCompanies' // import custom hook to fetch all companies from backend API
import { useDispatch } from 'react-redux' // import useDispatch hook to send actions to Redux store
import { setSearchCompanyByText } from '@/redux/companySlice' // import Redux action creator to update search text filter in company slice

const Companies = () => { // define a function component Companies to manage and display company list with search functionality
    useGetAllCompanies(); // call custom hook to fetch all companies when component mounts

    const [input, setInput] = useState(""); // define a state variable 'input' initialized with empty string and 'setInput' to update it on change
    
    const navigate = useNavigate(); // call useNavigate hook to get navigation function for redirecting to different routes
    
    const dispatch = useDispatch(); // call useDispatch to get function for dispatching Redux actions

    useEffect(() => { // define side effect that triggers when 'input' changes
        dispatch( // dispatch Redux action to update search text for filtering companies
            setSearchCompanyByText( // call action creator to create action object with search text payload
                input // pass current input value as argument to update Redux store filter
            )
        );
    }, [input]); // add 'input' as dependency so effect runs whenever input changes
    
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)} // update input state when user types by extracting value from event target
                    />
                    <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button> {/* navigate to company creation page when button is clicked */}
                </div>
                <CompaniesTable /> 
            </div>
        </div>
    )
}

export default Companies
