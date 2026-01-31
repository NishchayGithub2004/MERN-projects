import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create an manage state variables
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate to different pages
import useGetAllCompanies from '@/hooks/useGetAllCompanies' // import custom hook 'useGetAllCompanies' to get all companies in the database
import { useDispatch } from 'react-redux' // import 'useDispatch' hook from 'react-redux' library to dispatch actions to update values of state variables
import { setSearchCompanyByText } from '@/redux/companySlice' // import 'setSearchCompanyByText' function from 'companySlice' of redux store to search job by text

const Companies = () => { // create a functional component named 'Companies' to render all companies in the database
    useGetAllCompanies() // call custom hook 'useGetAllCompanies' to get all companies in the database

    const [input, setInput] = useState("") // create a state variable 'input' to store the text entered by the user with initial value of empty string and a function called 'setInput' to change its value

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate b/w different pages

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update values of state variables

    // create a side-effect that re-runs when value of 'input' variable changes, it dispatches new value of 'input' to 'searchCompanyByText' state using 'setSearchCompanyByText' function

    useEffect(() => {
        dispatch(setSearchCompanyByText(input))
    }, [input])

    return (
        <div>
            <Navbar />
            
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)} // when value of this input field changes, update value of 'input' state variable
                    />
                    <Button onClick={() => navigate("/admin/companies/create")}> {/* when this button is clicked, navigate to the page where user can create the company */}
                        New Company
                    </Button>
                </div>
                
                <CompaniesTable /> {/* render the table of companies and their details */}
            </div>
        </div>
    )
}

export default Companies