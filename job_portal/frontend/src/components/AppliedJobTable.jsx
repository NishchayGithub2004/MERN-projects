import React from 'react' // import React library to define a functional component
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table' // import table UI components for structured display
import { Badge } from './ui/badge' // import Badge component to visually show job status
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state

const AppliedJobTable = () => { // define a function component AppliedJobTable to display all applied jobs
    const { allAppliedJobs } = useSelector(store => store.job); // extract allAppliedJobs array from job slice of Redux store

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
                        allAppliedJobs.length <= 0  // check if there are no applied jobs
                        ? <span>You haven't applied any job yet.</span>  // display message if no jobs found
                        : allAppliedJobs.map((appliedJob) => ( // iterate over each job in allAppliedJobs array
                            <TableRow key={appliedJob._id}> {/* assign unique key using job ID */}
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell> {/* extract and display date from createdAt by splitting ISO string */}
                                <TableCell>{appliedJob.job?.title}</TableCell> {/* display the job title from nested job object */}
                                <TableCell>{appliedJob.job?.company?.name}</TableCell> {/* display company name from nested company object */}
                                <TableCell className="text-right">
                                    <Badge 
                                        className={`${appliedJob?.status === "rejected" 
                                            ? 'bg-red-400' 
                                            : appliedJob.status === 'pending' 
                                            ? 'bg-gray-400' 
                                            : 'bg-green-400'}`} // dynamically assign background color based on job status
                                    >
                                        {appliedJob.status.toUpperCase()} {/* convert status text to uppercase for emphasis */}
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

export default AppliedJobTable // export AppliedJobTable component for use in other parts of the app
