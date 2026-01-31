import React, { useState } from 'react' // import 'useState' hook to create and manage state variables
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate user to different pages
import axios from 'axios' // import 'axios' library to send HTTP requests to the backend
import { COMPANY_API_END_POINT } from '@/utils/constant' // import URL to send company related backend requests to
import { toast } from 'sonner' // import 'toast' function from 'sonner' library to render toast/pop-up messages
import { useDispatch } from 'react-redux' // import 'useDispatch' hook from 'react-redux' library to dispatch actions to state variables of redux slices to update their values
import { setSingleCompany } from '@/redux/companySlice' // import 'setSingleCompany' function from 'companySlice' to update a single company's data

const CompanyCreate = () => { // create a functional component named 'CompanyCreate' to render company creation page
    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

    const [companyName, setCompanyName] = useState() // create a state variable 'companyName' to store the name of the company being created and a function called 'setCompanyName' to change its value

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to state variables of redux slices to update their values

    const registerNewCompany = async () => { // create a function called 'registerNewCompany' to register a new company
        try {
            const res = await axios.post( // make a POST request to the backend
                `${COMPANY_API_END_POINT}/register`, // URL to make backend request to
                { companyName }, // company name to be registered
                {
                    headers: { 'Content-Type': 'application/json' }, // company name is being sent in JSON format
                    withCredentials: true // cookies are also sent with the request for authentication
                }
            )

            if (res?.data?.success) { // if response successfully sends some data back
                dispatch(setSingleCompany(res.data.company)) // dispatch response data to 'singleCompany' state
                toast.success(res.data.message) // render toast/pop-up message sent by backend on successfully executing the request 
                const companyId = res?.data?.company?._id // get company's unique ID
                navigate(`/admin/companies/${companyId}`) // redirect to the page containing details of company with this unique ID
            }
        } catch (error) { // if any error occurs while registering new company
            console.log(error) // log the error to the console to know what error occurred
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
                    onChange={(e) => setCompanyName(e.target.value)} // update value of 'companyName' state with the value entered by user
                />
                
                <div className='flex items-center gap-2 my-10'>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/admin/companies")} // clicking this button takes user to the page containing details of companies of the user
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={registerNewCompany} // clicking this button calls 'registerNewCompany' function to register the new company
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate