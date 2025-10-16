import React, { useEffect, useState } from 'react' // import React and hooks for state and lifecycle management
import Navbar from '../shared/Navbar' // import Navbar for consistent layout
import { Button } from '../ui/button' // import Button component for actions
import { ArrowLeft, Loader2 } from 'lucide-react' // import icons for UI elements
import { Label } from '../ui/label' // import Label component for input labels
import { Input } from '../ui/input' // import Input component for text and file inputs
import axios from 'axios' // import axios for HTTP requests
import { COMPANY_API_END_POINT } from '@/utils/constant' // import constant defining company API endpoint
import { useNavigate, useParams } from 'react-router-dom' // import hooks for navigation and route parameters
import { toast } from 'sonner' // import toast notification utility
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store
import useGetCompanyById from '@/hooks/useGetCompanyById' // import custom hook to fetch single company data

const CompanySetup = () => { // define a function component CompanySetup for editing company details
    const params = useParams(); // call useParams to get dynamic route parameters like company id

    useGetCompanyById(params.id); // call custom hook to fetch company data based on id parameter

    const [input, setInput] = useState({ // define input state to manage form fields
        name: "", // store company name
        description: "", // store company description
        website: "", // store company website
        location: "", // store company location
        file: null // store uploaded logo file
    });

    const { singleCompany } = useSelector(store => store.company); // extract singleCompany data from Redux store

    const [loading, setLoading] = useState(false); // define loading state to manage form submission feedback

    const navigate = useNavigate(); // call useNavigate to handle page navigation

    const changeEventHandler = (e) => { // define a function to handle input field changes
        setInput({ ...input, [e.target.name]: e.target.value }); // update the respective field dynamically using computed property name
    }

    const changeFileHandler = (e) => { // define a function to handle file input changes
        const file = e.target.files?.[0]; // extract the first file selected by user
        setInput({ ...input, file }); // update the file property in input state
    }

    const submitHandler = async (e) => { // define an async function to handle form submission
        e.preventDefault(); // prevent default form submission behavior

        const formData = new FormData(); // create a new FormData instance to handle multipart form data
        formData.append("name", input.name); // append company name to form data
        formData.append("description", input.description); // append description to form data
        formData.append("website", input.website); // append website URL to form data
        formData.append("location", input.location); // append location to form data

        if (input.file) { // check if file is uploaded
            formData.append("file", input.file); // append logo file to form data
        }

        try {
            setLoading(true); // set loading to true before API call

            const res = await axios.put( // send PUT request to update company details
                `${COMPANY_API_END_POINT}/update/${params.id}`, // construct endpoint dynamically with company ID
                formData, // send form data containing all fields
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // set content type header for file upload
                    withCredentials: true // include credentials for authentication
                }
            );

            if (res.data.success) { // check if the update was successful
                toast.success(res.data.message); // show success message using toast
                navigate("/admin/companies"); // navigate back to companies list
            }
        } catch (error) {
            console.log(error); // log the error for debugging
            toast.error(error.response.data.message); // show error message from API response
        } finally {
            setLoading(false); // set loading to false after API call completes
        }
    }

    useEffect(() => { // useEffect to prefill form fields with fetched company data
        setInput({
            name: singleCompany.name || "", // prefill name or default to empty string
            description: singleCompany.description || "", // prefill description
            website: singleCompany.website || "", // prefill website
            location: singleCompany.location || "", // prefill location
            file: singleCompany.file || null // prefill file (if available)
        })
    }, [singleCompany]); // run effect whenever singleCompany updates

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}> {/* handle form submission with submitHandler */}
                    <div className='flex items-center gap-5 p-8'>
                        <Button 
                            onClick={() => navigate("/admin/companies")} // navigate back to companies page on click
                            variant="outline" 
                            className="flex items-center gap-2 text-gray-500 font-semibold"
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler} // update name state on change
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler} // update description state on change
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler} // update website state on change
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler} // update location state on change
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler} // update file state on file selection
                            />
                        </div>
                    </div>
                    {
                        loading 
                        ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
                        : <Button type="submit" className="w-full my-4">Update</Button> // submit form when not loading
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup
