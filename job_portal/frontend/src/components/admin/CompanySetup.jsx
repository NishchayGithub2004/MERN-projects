import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create an manage state variables
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { COMPANY_API_END_POINT } from '@/utils/constant' // import URL to make company related backend requests to
import { useNavigate, useParams } from 'react-router-dom' // from 'react-router-dom' library, import 'useNavigate' hook to navigate user to different pages and 'useParams' to access and use URL parameters
import { toast } from 'sonner' // import 'toast' function from 'sonner' library to render toast/pop-up messages
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' library to access and use values of state variables of slices of redux store
import useGetCompanyById from '@/hooks/useGetCompanyById' // import custom hook 'useGetCompanyById' to get details of a company

const CompanySetup = () => { // create a functional component called 'CompanySetup' to render details of a company
    const params = useParams() // create an instance of 'useParams' hook to use it to access and use URL parameters

    useGetCompanyById(params.id) // call custom hook 'useGetCompanyById' to get details of a company by passing company's unique ID extracted from URL parameters as argument

    // create a state variable called 'input' which is an object that contains the following details about company as properties: name, description, website, location and file
    // initial values of all properties as empty strings (except 'file' which has an initial value of null) and a function called 'setInput' to change values of these properties 

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    })

    const { singleCompany } = useSelector(store => store.company) // access 'singleCompany' state variable from 'company' slice of redux store

    const [loading, setLoading] = useState(false) // create a state variable called 'loading' with initial value of false and a function called 'setLoading' to change it's value

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

    const changeEventHandler = (e) => { // create a function called 'changeEventHandler' to change value of a property of 'input' object as per value typed in an input field
        setInput({ ...input, [e.target.name]: e.target.value }) // copy pre-existing values of 'input' object properties and change value of a property of 'input' object as per value typed in it's respective input field
    }

    const changeFileHandler = (e) => { // create a function called 'changeFileHandler' to change value of 'file' property of 'input' object as per file selected in a file input field, it takes event object as an argument
        const file = e.target.files?.[0] // extract file selected in a file input field
        setInput({ ...input, file }) // copy pre-existing values of 'input' object properties and change value of 'file' property of 'input' object as per file selected in a file input field
    }

    const submitHandler = async (e) => { // create a function called 'submitHandler' to handle form submission, it takes an event object as argument
        e.preventDefault() // prevent default behavior of submitting form right after clicking submit button to do some things before submitting the form

        const formData = new FormData() // create an object of 'FormData' class to send form data to the backend

        // to form data object, add name, description, website, location and file (if provided) as properties

        formData.append("name", input.name)
        formData.append("description", input.description)
        formData.append("website", input.website)
        formData.append("location", input.location)

        if (input.file) formData.append("file", input.file)

        try {
            setLoading(true) // set value of 'loading' state to true to show loading spinner

            const res = await axios.put( // make a PUT request to the backend to update company details
                `${COMPANY_API_END_POINT}/update/${params.id}`, // URL to make backend request to
                formData, // updated company data to send to the backend
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // send the data in the form of form data
                    withCredentials: true // send cookies to the backend for authentication
                }
            )

            if (res.data.success) { // if response sends a response successfully
                toast.success(res.data.message) // render a toast/pop-up message to show success message given by the backend
                navigate("/admin/companies") // navigate to the page where user can see all companies
            }
        } catch (error) { // if an error occurs while updating company details
            console.log(error) // log the error to the console to know what error occured
            toast.error(error.response.data.message) // render a toast/pop-up message to show error message given by the backend
        } finally {
            setLoading(false) // finally set value of 'loading' state to false to hide loading spinner
        }
    }

    // create a side-effect that re-runs when value of 'singleCompany' state variable changes, it updates value of 'input' state variable as per value of 'singleCompany' state variable
    
    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    }, [singleCompany])

    return (
        <div>
            <Navbar />

            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}> {/* submitting this form calls 'submitHandler' function */}
                    <div className='flex items-center gap-5 p-8'>
                        <Button
                            onClick={() => navigate("/admin/companies")} // clicking this button takes user to the page where user can see all companies
                            variant="outline"
                            className="flex items-center gap-2 text-gray-500 font-semibold"
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        {/* render input fields for name, description, website, location and file */}

                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {
                        loading // if value of 'loading' state is true, render loading spinner, otherwise render button clicking which submits the form
                        ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button>
                        : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup