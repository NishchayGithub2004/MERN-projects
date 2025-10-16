import React, { useState } from 'react' // import React and useState hook for managing component state
import Navbar from '../shared/Navbar' // import Navbar component for consistent page header
import { Label } from '../ui/label' // import Label component for input labeling
import { Input } from '../ui/input' // import Input component for user input fields
import { Button } from '../ui/button' // import Button component for actions
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store data
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select' // import Select components for dropdown functionality
import axios from 'axios' // import axios for API requests
import { JOB_API_END_POINT } from '@/utils/constant' // import constant containing job API endpoint
import { toast } from 'sonner' // import toast notification library
import { useNavigate } from 'react-router-dom' // import hook for programmatic navigation
import { Loader2 } from 'lucide-react' // import Loader2 icon for loading spinner

const companyArray = []; // define an empty array variable (not used here but declared globally)

const PostJob = () => { // define a functional component for posting a new job
    const [input, setInput] = useState({ // define state to manage all job form input values
        title: "", // store job title
        description: "", // store job description
        requirements: "", // store job requirements
        salary: "", // store offered salary
        location: "", // store job location
        jobType: "", // store job type (e.g., full-time, part-time)
        experience: "", // store required experience level
        position: 0, // store number of positions available
        companyId: "" // store selected company ID
    });

    const [loading, setLoading] = useState(false); // define state to track loading state during API call

    const navigate = useNavigate(); // call useNavigate to redirect user after job creation

    const { companies } = useSelector(store => store.company); // extract companies array from Redux store

    const changeEventHandler = (e) => { // define function to handle input field changes
        setInput({ ...input, [e.target.name]: e.target.value }); // dynamically update the changed field in input state using computed property
    };

    const selectChangeHandler = (value) => { // define function to handle dropdown company selection
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value); // find the selected company by comparing lowercase names
        setInput({ ...input, companyId: selectedCompany._id }); // update companyId in state with selected company’s ID
    };

    const submitHandler = async (e) => { // define asynchronous function to handle job form submission
        e.preventDefault(); // prevent page reload after form submission

        try {
            setLoading(true); // set loading state to true during API call

            const res = await axios.post( // send POST request to job API endpoint to create a new job
                `${JOB_API_END_POINT}/post`, // use endpoint constant for cleaner code
                input, // send all input field values as JSON payload
                {
                    headers: { 'Content-Type': 'application/json' }, // set request header to JSON
                    withCredentials: true // include cookies for authentication
                }
            );

            if (res.data.success) { // check if the response indicates success
                toast.success(res.data.message); // show success message to user
                navigate("/admin/jobs"); // redirect to admin jobs page after success
            }
        } catch (error) {
            toast.error(error.response.data.message); // display error message from server response
        } finally {
            setLoading(false); // set loading state to false after API call completes
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form 
                    onSubmit={submitHandler} // trigger submitHandler when form is submitted
                    className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'
                >
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler} // call changeEventHandler to update title
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler} // call changeEventHandler to update description
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler} // call changeEventHandler to update requirements
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler} // call changeEventHandler to update salary
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler} // call changeEventHandler to update location
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler} // call changeEventHandler to update jobType
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler} // call changeEventHandler to update experience
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Postion</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler} // call changeEventHandler to update number of positions
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length > 0 && ( // render company select dropdown only if companies exist
                                <Select onValueChange={selectChangeHandler}> {/* call selectChangeHandler when option changes */}
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                companies.map((company) => { // iterate through all companies to create options
                                                    return (
                                                        <SelectItem value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>
                    {
                        loading 
                        ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
                        : <Button type="submit" className="w-full my-4">Post New Job</Button> // handle button state dynamically
                    }
                    {
                        companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a jobs</p> // show warning if no companies exist
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob
