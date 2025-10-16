import React, { useState } from 'react' // import React and useState hook to manage local state in this component
import Navbar from '../shared/Navbar' // import Navbar component for consistent header layout
import { Label } from '../ui/label' // import Label component for form labeling
import { Input } from '../ui/input' // import Input component for text input
import { Button } from '../ui/button' // import Button component for actions
import { useNavigate } from 'react-router-dom' // import useNavigate hook for route navigation
import axios from 'axios' // import axios for HTTP requests
import { COMPANY_API_END_POINT } from '@/utils/constant' // import company API endpoint constant
import { toast } from 'sonner' // import toast notification utility for success/error messages
import { useDispatch } from 'react-redux' // import useDispatch hook to dispatch Redux actions
import { setSingleCompany } from '@/redux/companySlice' // import Redux action to set single company data

const CompanyCreate = () => { // define a function component CompanyCreate for creating a new company
    const navigate = useNavigate(); // call useNavigate to programmatically navigate between routes
    
    const [companyName, setCompanyName] = useState(); // define a state variable 'companyName' to store the input field value
    
    const dispatch = useDispatch(); // call useDispatch to get the Redux dispatch function
    
    const registerNewCompany = async () => { // define an async function to handle new company registration
        try {
            const res = await axios.post( // send POST request using axios to register new company
                `${COMPANY_API_END_POINT}/register`, // API endpoint for registering company
                { companyName }, // send companyName as request body
                {
                    headers: { // set request headers
                        'Content-Type': 'application/json' // specify content type as JSON
                    },
                    withCredentials: true // include cookies for authentication
                }
            );
            
            if (res?.data?.success) { // check if response indicates successful registration
                dispatch( // dispatch Redux action to update store with new company data
                    setSingleCompany(res.data.company) // pass company object from response as payload
                );
                
                toast.success(res.data.message); // show success notification with response message
                
                const companyId = res?.data?.company?._id; // extract company ID from response for navigation
                
                navigate(`/admin/companies/${companyId}`); // navigate to the company details/edit page
            }
        } catch (error) {
            console.log(error); // log any error if API call fails
        }
    }
    
    return (
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
                    onChange={(e) => setCompanyName(e.target.value)} // update companyName state with input value
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate("/admin/companies")} // navigate back to companies page on cancel
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={registerNewCompany} // call function to register new company when clicked
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate
