import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' library to access slice from redux store

const AppliedJobTable = () => { // create a functional component named 'AppliedJobTable' to render a table of jobs user has applied to
    const { allAppliedJobs } = useSelector(store => store.job) // extract 'allAppliedJobs' array of objects from redux store's 'job' slice which contains all jobs user has applied to with job details in object properties form
    
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
                        allAppliedJobs.length <= 0 // if 'allAppliedJobs' array is empty, it means that user hasn't applied to any job
                        ? <span>You haven't applied any job yet.</span> // render this text in that case
                        : allAppliedJobs.map((appliedJob) => ( // otherwise iterate over objects present in 'allAppliedJobs' array ie jobs user has applied to as 'appliedJob'
                            <TableRow key={appliedJob._id}> {/* unique ID of job is the unique identifier of each row of the table */}
                                {/* render date at which current job was created by recruiter, title of current job, name of company that posted the current job as cells of the row */}
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Badge 
                                        className={`${appliedJob?.status === "rejected" // if current job's status is rejected
                                            ? 'bg-red-400' // render a red badge
                                            : appliedJob.status === 'pending' // if user is not rejected from current job but a response is pending
                                            ? 'bg-gray-400' // render a gray badge
                                            : 'bg-green-400' // if user is selected for the current job, render green badge
                                        }`}
                                    >
                                        {appliedJob.status.toUpperCase()} {/* render status of current job in uppercase letters */}
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

export default AppliedJobTable