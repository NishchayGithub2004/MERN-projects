import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner' // import 'toast' function from 'sonner' library to render toast/pop-up messages
import { APPLICATION_API_END_POINT } from '@/utils/constant' // import URL to make applications related backend requests to
import axios from 'axios' // import 'axios' library to make HTTP requests to backend

const shortlistingStatus = ["Accepted", "Rejected"] // create an array of possible applications status

const ApplicantsTable = () => { // create a functional component called 'ApplicantsTable' to render table of applicants and their details
    const { applicants } = useSelector(store => store.application) // extract 'applicants' state from 'application' slice of redux store

    const statusHandler = async (status, id) => { // create a function called 'statusHandler' to update application status, it takes ID of job application and updated status as arguments
        try {
            axios.defaults.withCredentials = true // send cookies with the backend request for authenticatiom
            const res = await axios.post( // make a POST request to the backend to update application status
                `${APPLICATION_API_END_POINT}/status/${id}/update`, // URL to make POST request to
                { status } // send updated status to the backend
            )
            
            if (res.data.success) toast.success(res.data.message) // if backend sends a response successfully, render a toast/pop-up message showing response data
        } catch (error) { // if any error occurs while updating application status
            toast.error(error.response.data.message) // render a toast/pop-up message showing error message given by the backend response
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => ( // if applicants of a job exist, iterate over them
                        <tr key={item._id}> {/* unique ID of applicant acts as it's unique identifier in the table */}
                            {/* render applicant's full name, email, phone number, resume name and link to it (if it exists), and date at which applicant applied for the job */}
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a
                                        className="text-blue-600 cursor-pointer"
                                        href={item?.applicant?.profile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>NA</span> // otherwise render NA
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="float-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        {shortlistingStatus.map((status, index) => ( // iterate over shortlisting status options
                                            <div
                                                onClick={() => statusHandler(status, item?._id)} // clicking the status option calls 'statusHandler' function to update the status
                                                key={index} // index of status option acts as its unique identifier
                                                className='flex w-fit items-center my-2 cursor-pointer'
                                            >
                                                <span>{status}</span> {/* render status option */}
                                            </div>
                                        ))}
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

export default ApplicantsTable