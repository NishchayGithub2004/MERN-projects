import React from 'react' // import React to enable JSX syntax and create functional components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table' // import table-related UI components to render structured job data
import { Badge } from './ui/badge' // import Badge component to visually represent job status
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state

const AppliedJobTable = () => { // define a functional component named 'AppliedJobTable' to display a list of all jobs the user has applied to
    const { allAppliedJobs } = useSelector(store => store.job) // extract 'allAppliedJobs' array from the Redux job slice to access user's applied jobs
    
    return (
        <div>
            <Table> 
                <TableCaption>A list of your applied jobs</TableCaption> 
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead> 
                        <TableHead>Job Role</TableHead> 
                        <TableHead>Company</TableHead> 
                        <TableHead className="text-right">Status</TableHead> 
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 // check if the user hasn't applied to any job
                        ? <span>You haven't applied any job yet.</span> // display message when no jobs exist
                        : allAppliedJobs.map((appliedJob) => ( // iterate over each applied job to display its details
                            <TableRow key={appliedJob._id}> {/* assign unique key to each row for React rendering optimization */}
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell> {/* extract and display only the date part from job creation timestamp */}
                                <TableCell>{appliedJob.job?.title}</TableCell> {/* display the title of the applied job */}
                                <TableCell>{appliedJob.job?.company?.name}</TableCell> {/* display the company name associated with the applied job */}
                                <TableCell className="text-right">
                                    <Badge 
                                        className={`${appliedJob?.status === "rejected" 
                                            ? 'bg-red-400' // apply red background if job application is rejected
                                            : appliedJob.status === 'pending' 
                                            ? 'bg-gray-400' // apply gray background if job application is pending
                                            : 'bg-green-400' // apply green background if job application is accepted
                                        }`}
                                    >
                                        {appliedJob.status.toUpperCase()} {/* display job status text in uppercase */}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable // export the component to make it usable in other parts of the app
