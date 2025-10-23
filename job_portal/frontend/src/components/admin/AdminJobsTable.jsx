import React, { useEffect, useState } from 'react' // import React along with useEffect for side effects and useState for managing component state
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table' // import table components for structured job listing
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import popover components for displaying job actions in dropdown
import { Edit2, Eye, MoreHorizontal } from 'lucide-react' // import icons used for edit, view, and menu actions
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate between routes

const AdminJobsTable = () => { // define a function component AdminJobsTable to display and filter admin jobs
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job); // access job slice from Redux store to get 'allAdminJobs' array and 'searchJobByText' string from the slice

    const [filterJobs, setFilterJobs] = useState(allAdminJobs); // define state variable 'filterJobs' initialized with 'allAdminJobs' to store filtered job list
    
    const navigate = useNavigate(); // call useNavigate to get function for redirecting to different routes

    useEffect(() => { // define side effect to update filtered jobs whenever jobs or search text changes
        const filteredJobs = allAdminJobs.filter((job) => { // create a filtered list of jobs using array filter method, iterate every element of 'allAdminJobs' array as 'job'
            if (!searchJobByText) { // check if search text is empty ie no search filter is applied
                return true; // return all jobs if no search filter is applied
            };

            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || // check if job title contains search text (convert both to lower-case to disable case sensitivity)
                job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase()) // check if company name contains search text (convert both to lower-case to disable case sensitivity)
            );
        });
        
        setFilterJobs(filteredJobs); // update 'filterJobs' to 'filteredJobs'
    }, [allAdminJobs, searchJobByText]) // run this effect whenever jobs data or search text changes by writing both 'allAdminJobs' and 'searchJobByText' in dependency array
    
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent  posted jobs</TableCaption>
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
                        filterJobs?.map((job) => ( // iterate over filtered jobs array to render each job row
                            <tr>
                                <TableCell>{job?.company?.name}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>{job?.createdAt.split("T")[0]}</TableCell> 
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger> 
                                        <PopoverContent className="w-32">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${job._id}`)} // navigate to company edit page using job ID when edit option is clicked
                                                className='flex items-center gap-2 w-fit cursor-pointer'
                                            >
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} // navigate to applicants list page for the selected job ID
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

export default AdminJobsTable
