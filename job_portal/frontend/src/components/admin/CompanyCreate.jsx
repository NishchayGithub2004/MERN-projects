import React, { useState } from 'react' // import React to define the component and include useState for managing local input state
import Navbar from '../shared/Navbar' // import Navbar component to render consistent top header across pages
import { Label } from '../ui/label' // import Label component to display input field labels
import { Input } from '../ui/input' // import Input component to accept user text input
import { Button } from '../ui/button' // import Button component to perform clickable actions
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate between routes
import axios from 'axios' // import axios library to send HTTP requests to backend API
import { COMPANY_API_END_POINT } from '@/utils/constant' // import predefined constant containing company API base URL
import { toast } from 'sonner' // import toast utility to show success or error notifications
import { useDispatch } from 'react-redux' // import useDispatch hook to dispatch Redux actions
import { setSingleCompany } from '@/redux/companySlice' // import Redux action creator to set single company details in store

const CompanyCreate = () => { // define a functional component named 'CompanyCreate' to handle new company creation process
    const navigate = useNavigate() // call useNavigate to get navigation function for redirecting between admin routes

    const [companyName, setCompanyName] = useState() // define a state variable 'companyName' to hold user input for new company name

    const dispatch = useDispatch() // call useDispatch to obtain dispatch function for sending Redux actions

    const registerNewCompany = async () => { // define asynchronous function to register a new company by sending API request
        try {
            const res = await axios.post( // send POST request to backend API to create a new company
                `${COMPANY_API_END_POINT}/register`, // specify API endpoint for registering new company
                { companyName }, // send company name in request body to backend
                {
                    headers: { 'Content-Type': 'application/json' }, // set header to indicate JSON data type
                    withCredentials: true // include authentication cookies in the request
                }
            )
            if (res?.data?.success) { // check if API response indicates successful company registration
                dispatch( // send Redux action to update global store with newly created company data
                    setSingleCompany(res.data.company) // call Redux action creator passing company object as payload
                )
                toast.success(res.data.message) // display toast notification with success message from response
                const companyId = res?.data?.company?._id // extract newly created company ID from response
                navigate(`/admin/companies/${companyId}`) // redirect user to the specific company’s details or edit page
            }
        } catch (error) {
            console.log(error) // log any caught error to console for debugging
        }
    }

    return ( // return JSX structure to render input form and action buttons for creating a company
        <div>
            <Navbar /> 
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>
                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                    onChange={(e) => setCompanyName(e.target.value)} // update companyName state with current input value on every keystroke
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/admin/companies")} // navigate back to main companies page when cancel button is clicked
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={registerNewCompany} // trigger registerNewCompany function to create a new company on button click
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate // export CompanyCreate component as default to make it accessible in route configuration