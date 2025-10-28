import React from 'react' // import react library to create components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table' // import table ui components to display applicant data in a structured format
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import popover ui components to show dropdown menu for actions
import { MoreHorizontal } from 'lucide-react' // import horizontal menu icon used as popover trigger
import { useSelector } from 'react-redux' // import useSelector hook to access state data from redux store
import { toast } from 'sonner' // import toast library to display success or error notifications
import { APPLICATION_API_END_POINT } from '@/utils/constant' // import constant that defines base api endpoint for application operations
import axios from 'axios' // import axios library to send http requests to backend

const shortlistingStatus = ["Accepted", "Rejected"] // define array of possible applicant statuses used for shortlisting decisions

const ApplicantsTable = () => { // define functional component 'ApplicantsTable' to display and manage applicant records
    const { applicants } = useSelector(store => store.application) // extract 'applicants' object from 'application' slice in redux store to access all applicant data

    const statusHandler = async ( // define asynchronous function to handle applicant status updates
        status, // parameter 'status' represents selected status value such as 'Accepted' or 'Rejected'
        id // parameter 'id' represents unique applicant identifier
    ) => {
        try {
            axios.defaults.withCredentials = true // enable axios to send cookies with requests for authentication
            const res = await axios.post( // send post request to backend api to update applicant status
                `${APPLICATION_API_END_POINT}/status/${id}/update`, // construct api endpoint dynamically using applicant id
                { status } // include updated status value in request body to inform server of status change
            ) 
            console.log(res) // log response object for debugging purposes
            if (res.data.success) { // check if server response indicates successful status update
                toast.success(res.data.message) // display success toast with message returned from server
            }
        } catch (error) { // handle any exceptions thrown during api call
            toast.error(error.response.data.message) // show error toast with message received from backend
        }
    }

    return ( // return jsx to render table of applicants with action controls
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
                    {
                        applicants && applicants?.applications?.map((item) => ( // iterate through each applicant in 'applications' array to render table rows
                            <tr key={item._id}> 
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.applicant?.profile?.resume // check if resume file exists in applicant's profile
                                            ? <a 
                                                className="text-blue-600 cursor-pointer" 
                                                href={item?.applicant?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                              >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                              </a> // render clickable link to resume file when available
                                            : <span>NA</span> // display 'NA' when resume not found
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell> 
                                <TableCell className="float-right cursor-pointer">
                                    <Popover> 
                                        <PopoverTrigger>
                                            <MoreHorizontal /> 
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => { // iterate through 'shortlistingStatus' array to render status options
                                                    return (
                                                        <div 
                                                            onClick={() => statusHandler(status, item?._id)} // call statusHandler with selected status and applicant id on click
                                                            key={index} 
                                                            className='flex w-fit items-center my-2 cursor-pointer'
                                                        >
                                                            <span>{status}</span> 
                                                        </div>
                                                    )
                                                })
                                            }
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

export default ApplicantsTable // export ApplicantsTable component as default so it can be reused in other files