import React, { useState } from 'react' // import React to define component and useState hook to manage local state
import Navbar from '../shared/Navbar' // import Navbar component for consistent top navigation
import { Label } from '../ui/label' // import Label component to describe input fields
import { Input } from '../ui/input' // import Input component to capture user text or number inputs
import { Button } from '../ui/button' // import Button component for clickable UI actions
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store data
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select' // import dropdown components for company selection
import axios from 'axios' // import axios library to perform HTTP requests
import { JOB_API_END_POINT } from '@/utils/constant' // import predefined API endpoint constant for job operations
import { toast } from 'sonner' // import toast function to show feedback notifications
import { useNavigate } from 'react-router-dom' // import hook to programmatically navigate between routes
import { Loader2 } from 'lucide-react' // import loader icon to visually indicate loading process

const PostJob = () => { // define a functional component named PostJob to handle job posting functionality
    const [input, setInput] = useState({ // define state to hold all form input values for job posting
        title: "", // store title of the job
        description: "", // store job description entered by user
        requirements: "", // store job requirements input by user
        salary: "", // store salary amount offered for job
        location: "", // store job location input
        jobType: "", // store job type value like full-time or part-time
        experience: "", // store experience level required for job
        position: 0, // store number of available job positions
        companyId: "" // store ID of selected company from dropdown
    })

    const [loading, setLoading] = useState(false) // define loading state to control submission spinner visibility

    const navigate = useNavigate() // get navigation function to redirect after successful submission

    const { companies } = useSelector(store => store.company) // extract companies list from Redux store for dropdown rendering

    const changeEventHandler = (e) => { // define handler to update text input state values dynamically
        setInput({ ...input, [e.target.name]: e.target.value }) // update respective field in input state using computed key name
    }

    const selectChangeHandler = (value) => { // define handler to manage dropdown company selection
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value) // find matching company object using lowercase name comparison
        setInput({ ...input, companyId: selectedCompany._id }) // update input state with selected company’s unique id
    }

    const submitHandler = async (e) => { // define async handler to manage job form submission logic
        e.preventDefault() // prevent page reload caused by default form behavior

        try {
            setLoading(true) // activate loading state before making API call

            const res = await axios.post( // send POST request to backend server to create new job entry
                `${JOB_API_END_POINT}/post`, // use job endpoint constant for clean and consistent URL
                input, // send input state as JSON body to server
                {
                    headers: { 'Content-Type': 'application/json' }, // set content type header for JSON payload
                    withCredentials: true // include cookies for authentication with server
                }
            )

            if (res.data.success) { // check API response for successful job creation
                toast.success(res.data.message) // display success message via toast notification
                navigate("/admin/jobs") // redirect user to admin job listing page after success
            }
        } catch (error) {
            toast.error(error.response.data.message) // show backend error message if request fails
        } finally {
            setLoading(false) // deactivate loading state once API call finishes
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
                                onChange={changeEventHandler} // call changeEventHandler to update job title in state
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler} // call changeEventHandler to update description in state
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler} // call changeEventHandler to update requirements field
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler} // call changeEventHandler to update salary field
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler} // call changeEventHandler to update location field
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler} // call changeEventHandler to update jobType field
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler} // call changeEventHandler to update experience field
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler} // call changeEventHandler to update number of positions field
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length > 0 && ( // conditionally render dropdown only when companies array is not empty
                                <Select onValueChange={selectChangeHandler}> {/* trigger selectChangeHandler when user selects company */}
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                companies.map((company) => { // iterate through companies array to display each company name
                                                    return (
                                                        <SelectItem value={company?.name?.toLowerCase()}>{company.name}</SelectItem> // render company option with lowercase value for matching
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
                        ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> 
                        : <Button type="submit" className="w-full my-4">Post New Job</Button> // submit form to create new job when not loading
                    }
                    {
                        companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a jobs</p> // show warning if no companies are available
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob // export PostJob component as default for routing or import in other modules