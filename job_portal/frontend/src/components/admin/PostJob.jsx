import React, { useState } from 'react' // import 'useState' hook to create and manage state variables
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux' // import 'useSelector' hook to access states and functions from slices of redux store
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { JOB_API_END_POINT } from '@/utils/constant' // import URL to make job related backend requests to
import { toast } from 'sonner' // import 'toast' function of 'sonner' library to render toast/pop-up messages
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate to different pages
import { Loader2 } from 'lucide-react'

const PostJob = () => {
    // create a state variable called 'input' which is an object that contains the following details about job as properties: title, description, requirements, salary, location, job type, experience, position and
    // unique ID of company that posted the job, initial values of all properties as empty strings (except 'position' which has an initial value of 0) and a function called 'setInput' to change values of these properties 
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    })

    const [loading, setLoading] = useState(false) // create a state variable called 'loading' with initial value of false and a function called 'setLoading' to change it's value

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

    const { companies } = useSelector(store => store.company) // extract 'companies' state from 'company' slice of redux store

    const changeEventHandler = (e) => { // create a function called 'changeEventHandler' to change value of a property of 'input' object as per value typed in an input field
        setInput({ ...input, [e.target.name]: e.target.value }) // copy pre-existing values of 'input' object properties and change value of a property of 'input' object as per value typed in it's respective input field
    }

    const selectChangeHandler = (value) => { // create a function called 'selectChangeHandler' to update 'input' state variable when user selects a company from dropdown
        const selectedCompany = companies.find(
            (company) => company.name.toLowerCase() === value // find the company object from 'companies' array that matches the selected company's 'name' property value
        )
        setInput({ ...input, companyId: selectedCompany._id }) // update 'input' state variable's 'companyId' property with the selected company's ID
    }

    const submitHandler = async (e) => { // create a function called 'submitHandler' to handle form submission, it takes event object as argument
        e.preventDefault() // prevent default behavior of submitting form right after clicking submit button to do some things before submitting the form

        try {
            setLoading(true) // update value of 'loading' state variable with true to show loading spinner

            const res = await axios.post( // make a POST request to the backend
                `${JOB_API_END_POINT}/post`, // URL to make the backend request to
                input, // data to send to the backend
                {
                    headers: { 'Content-Type': 'application/json' }, // data is sent in JSON form
                    withCredentials: true // cookies are also sent with the backend for authentication
                }
            )

            if (res.data.success) { // if response sends a response successfully
                toast.success(res.data.message) // render a toast/pop-up message to show success message given by the backend
                navigate("/admin/jobs") // navigate to the page where user can see all jobs
            }
        } catch (error) { // if an error occurs while updating company details
            console.log(error) // log the error to the console to know what error occured
            toast.error(error.response.data.message) // render a toast/pop-up message to show error message given by the backend
        } finally {
            setLoading(false) // finally set value of 'loading' state to false to hide loading spinner
        }
    }

    return (
        <div>
            <Navbar />
            
            <div className='flex items-center justify-center w-screen my-5'>
                <form
                    onSubmit={submitHandler} // submitting this form calls 'submitHandler' function
                    className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'
                >
                    <div className='grid grid-cols-2 gap-2'>
                        {/* render input fields for job title, description, requirements, salary, location, job type, experience, no of positions and unique ID of company that posted the job */}                     

                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>No of Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length > 0 && ( // if companies 'array' is not empty, render options to select a company
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                companies.map((company) => ( // iterate over 'companies' array
                                                    <SelectItem
                                                        key={company._id} // unique ID of the company is the option's unique identifier
                                                        value={company?.name?.toLowerCase()} // this option's value goes into 'name' property of 'company' object in lowercase form
                                                    >
                                                        {company.name} {/* render company name as option */}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>
                    {
                        loading // if value of 'loading' state is true, render loading spinner, otherwise render button clicking which submits the form
                            ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button>
                            : <Button type="submit" className="w-full my-4">Post New Job</Button>
                    }
                    {
                        companies.length === 0 && ( // if 'companies' array is empty, render error message that no company is present so no job can be posted
                            <p className='text-xs text-red-600 font-bold text-center my-3'>
                                Please register a company first, before posting a job
                            </p>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob