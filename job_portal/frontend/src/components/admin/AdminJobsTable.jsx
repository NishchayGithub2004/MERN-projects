import React, { useEffect, useState } from 'react' // import react library to create components, useEffect for running side effects, and useState for managing local state
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table' // import table ui components to display job listings in a tabular structure
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import popover ui components to show dropdown actions for each job
import { Edit2, Eye, MoreHorizontal } from 'lucide-react' // import icons representing edit, view, and menu options
import { useSelector } from 'react-redux' // import useSelector hook to read state data from redux store
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate between pages

const AdminJobsTable = () => { // define a functional component named 'AdminJobsTable' to display and filter the list of admin jobs
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job) // extract 'allAdminJobs' array and 'searchJobByText' filter text from redux job slice

    const [filterJobs, setFilterJobs] = useState(allAdminJobs) // define state variable 'filterJobs' initialized with all jobs to hold currently filtered jobs and 'setFilterJobs' to update it

    const navigate = useNavigate() // call useNavigate hook to get navigation function for redirecting user to specific pages

    useEffect(() => { // define side effect to update filtered job list whenever job data or search text changes
        const filteredJobs = allAdminJobs.filter((job) => { // create a new array 'filteredJobs' by filtering 'allAdminJobs' based on search text
            if (!searchJobByText) { // check if search text is empty meaning no filter is applied
                return true // include all jobs when search text is empty
            }
            return ( // otherwise check if job title or company name includes search text
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || // include job if its title matches search text ignoring case
                job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase()) // include job if its company name matches search text ignoring case
            )
        }) // close filter callback
        setFilterJobs(filteredJobs) // update local state 'filterJobs' with new filtered results
    }, [allAdminJobs, searchJobByText]) // run effect whenever 'allAdminJobs' or 'searchJobByText' changes to keep job list updated

    return ( // return jsx to render job table with interactive actions
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
                    {
                        filterJobs?.map((job) => ( // iterate over 'filterJobs' array to render each job record in the table
                            <tr key={job._id}> 
                                <TableCell>{job?.company?.name}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>{job?.createdAt.split("T")[0]}</TableCell> 
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger> 
                                        <PopoverContent className="w-32">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${job._id}`)} // navigate to company edit page using the job's id when edit option is selected
                                                className='flex items-center gap-2 w-fit cursor-pointer'
                                            >
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} // navigate to applicants list page for the selected job id when applicants option is clicked
                                                className='flex items-center w-fit gap-2 cursor-pointer mt-2'
                                            >
                                                <Eye className='w-4' />
                                                <span>Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable // export AdminJobsTable component as default to make it reusable in other modules