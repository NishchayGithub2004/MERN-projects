import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create an manage state variables
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' library to access redux slices from redux store
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate user to different pages

const AdminJobsTable = () => { // create a functional component called 'AdminJobsTable' to render table of jobs created by the admin
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job) // extract 'allAdminJobs' and 'searchJobByText' states from 'job' slice of redux store
    // first state contains all jobs posted by the user, and second state contains search string used to search for a job

    const [filterJobs, setFilterJobs] = useState(allAdminJobs) // create a state variable 'filterJobs' to store the filtered jobs with initial value of 'allAdminJobs' ie all jobs posted by the user and a function called 'setFilterJobs' to change its value

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

    // create a side-effect that runs when jobs posted by user or search string to search for a job changes, iterate over 'allAdminJobs' ie all jobs created by the user
    // if 'searchJobByText' is empty ie search string is not provided, return all jobs, else return jobs whose title or company name matches the search string (make it case-insensitive by making all searches in lower case)
    
    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true
            
            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
            )
        })
        setFilterJobs(filteredJobs)
    }, [allAdminJobs, searchJobByText])

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => ( // iterate over jobs filtered by the search string
                        <tr key={job._id}> {/* unique ID of the job works as its unique identifier in the table */}
                            {/* for current row, render company name, job title, and date of creation as cells */}
                            <TableCell>{job?.company?.name}</TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div
                                            onClick={() => navigate(`/admin/companies/${job._id}`)} // clicking on 'Edit' button takes user to the job details
                                            className='flex items-center gap-2 w-fit cursor-pointer'
                                        >
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>
                                        <div
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} // clicking on 'Applicants' button takes user to list of applicants for the job
                                            className='flex items-center w-fit gap-2 cursor-pointer mt-2'
                                        >
                                            <Eye className='w-4' />
                                            <span>Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable