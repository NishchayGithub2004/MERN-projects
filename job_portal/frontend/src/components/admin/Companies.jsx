import React, { useEffect, useState } from 'react' // import React to define a component and include useEffect for handling side effects and useState for managing local state
import Navbar from '../shared/Navbar' // import Navbar component to render the top navigation bar for the page
import { Input } from '../ui/input' // import Input component to take user input for company search
import { Button } from '../ui/button' // import Button component to trigger actions on click
import CompaniesTable from './CompaniesTable' // import CompaniesTable component to display fetched list of companies in tabular form
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically redirect user to a new route
import useGetAllCompanies from '@/hooks/useGetAllCompanies' // import custom hook to fetch all company records from backend API
import { useDispatch } from 'react-redux' // import useDispatch hook to obtain dispatch function for Redux actions
import { setSearchCompanyByText } from '@/redux/companySlice' // import Redux action to update company search text in global state

const Companies = () => { // define a functional component named 'Companies' to manage and display company list with search functionality
    useGetAllCompanies(); // call custom hook to fetch all companies when the component mounts to populate the table data

    const [input, setInput] = useState("") // declare state variable 'input' with initial value as empty string to store search text and 'setInput' to update it dynamically

    const navigate = useNavigate() // call useNavigate to get navigation function that enables route changes programmatically

    const dispatch = useDispatch() // call useDispatch to get function that allows sending Redux actions to the store

    useEffect(() => { // define side effect to execute whenever input value changes
        dispatch( // call dispatch to send Redux action for updating search filter text
            setSearchCompanyByText( // call Redux action creator that generates an action with input text as payload
                input // pass current input value to update search text in Redux state
            )
        )
    }, [input]) // include input as dependency so this effect runs only when input value changes

    return ( // return the component UI structure to render navigation bar, search field, button, and company table
        <div>
            <Navbar /> 
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)} // update input state whenever user types a character in input field
                    />
                    <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button> {/* navigate to company creation page when the button is clicked */}
                </div>
                <CompaniesTable /> {/* render the CompaniesTable component to display list of all fetched companies */}
            </div>
        </div>
    )
}

export default Companies // export Companies component as default to make it usable in other modules
