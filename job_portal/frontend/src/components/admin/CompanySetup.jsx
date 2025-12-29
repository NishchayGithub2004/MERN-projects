import React, { useEffect, useState } from 'react' // import React to create components and use hooks for managing state and side effects
import Navbar from '../shared/Navbar' // import Navbar component to maintain consistent page header
import { Button } from '../ui/button' // import reusable Button component for interactive actions
import { ArrowLeft, Loader2 } from 'lucide-react' // import icons for navigation and loading feedback
import { Label } from '../ui/label' // import Label component to describe input fields
import { Input } from '../ui/input' // import Input component to handle user text or file inputs
import axios from 'axios' // import axios library to make HTTP requests
import { COMPANY_API_END_POINT } from '@/utils/constant' // import constant variable containing API endpoint URL
import { useNavigate, useParams } from 'react-router-dom' // import hooks to manage navigation and read route parameters
import { toast } from 'sonner' // import toast to display success or error notifications
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state
import useGetCompanyById from '@/hooks/useGetCompanyById' // import custom hook to fetch single company details by id

const CompanySetup = () => { // define a functional component named CompanySetup to manage and update company details
    const params = useParams() // extract route parameters such as company id from URL

    useGetCompanyById(params.id) // call custom hook with company id to fetch existing company data from backend

    const [input, setInput] = useState({ // create state object to store form field values
        name: "", // store company name entered by user
        description: "", // store company description entered by user
        website: "", // store company website URL entered by user
        location: "", // store company location entered by user
        file: null // store selected logo file from user input
    })

    const { singleCompany } = useSelector(store => store.company) // access singleCompany object from Redux store to get fetched data

    const [loading, setLoading] = useState(false) // create loading state to indicate submission or data processing

    const navigate = useNavigate() // get navigation function to redirect user programmatically

    const changeEventHandler = (e) => { // define function to handle text input changes
        setInput({ ...input, [e.target.name]: e.target.value }) // dynamically update specific input field using computed key name
    }

    const changeFileHandler = (e) => { // define function to handle file upload input changes
        const file = e.target.files?.[0] // retrieve first selected file from input field
        setInput({ ...input, file }) // update file property in state with selected file
    }

    const submitHandler = async (e) => { // define async function to handle form submission event
        e.preventDefault() // prevent default browser reload behavior when form is submitted

        const formData = new FormData() // create new FormData instance to append form values for multipart submission
        formData.append("name", input.name) // append name field to form data payload
        formData.append("description", input.description) // append description field to form data payload
        formData.append("website", input.website) // append website field to form data payload
        formData.append("location", input.location) // append location field to form data payload

        if (input.file) formData.append("file", input.file) // conditionally append logo file if one was selected

        try {
            setLoading(true) // set loading to true before making API request to show progress feedback

            const res = await axios.put( // make PUT request to update company record in database
                `${COMPANY_API_END_POINT}/update/${params.id}`, // build endpoint URL dynamically using company id
                formData, // send form data as request body
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // specify content type for file upload
                    withCredentials: true // include credentials to maintain user session
                }
            )

            if (res.data.success) { // check if response indicates successful update
                toast.success(res.data.message) // show success message notification to user
                navigate("/admin/companies") // redirect user to companies listing page after successful update
            }
        } catch (error) {
            console.log(error) // log error to console for debugging purposes
            toast.error(error.response.data.message) // show error message from backend response to user
        } finally {
            setLoading(false) // reset loading state to false after completion of API call
        }
    }

    useEffect(() => { // use effect to prefill input fields when company data is fetched
        setInput({
            name: singleCompany.name || "", // assign company name from store or fallback to empty string
            description: singleCompany.description || "", // assign description from store or fallback to empty string
            website: singleCompany.website || "", // assign website from store or fallback to empty string
            location: singleCompany.location || "", // assign location from store or fallback to empty string
            file: singleCompany.file || null // assign logo file reference from store or fallback to null
        })
    }, [singleCompany]) // re-run effect whenever singleCompany changes in Redux store

    return (
        <div>
            <Navbar /> 
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}> {/* handle form submission through submitHandler when user clicks update */}
                    <div className='flex items-center gap-5 p-8'>
                        <Button 
                            onClick={() => navigate("/admin/companies")} // trigger navigation to companies list on back button click
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
                                onChange={changeEventHandler} // call changeEventHandler to update name field when user types
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler} // call changeEventHandler to update description field when user types
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler} // call changeEventHandler to update website field when user types
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler} // call changeEventHandler to update location field when user types
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler} // call changeFileHandler to store selected file in state
                            />
                        </div>
                    </div>
                    {
                        loading 
                        ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> 
                        : <Button type="submit" className="w-full my-4">Update</Button> // trigger form submission if not loading
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup // export CompanySetup component as default to use in routing or import elsewhere