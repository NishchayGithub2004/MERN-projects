import React from 'react' // import React to define the functional component
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table' // import table UI components for displaying applicant data
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'; // import popover components for dropdown menu functionality
import { MoreHorizontal } from 'lucide-react'; // import horizontal menu icon for the popover trigger
import { useSelector } from 'react-redux'; // import useSelector hook to access Redux store data
import { toast } from 'sonner'; // import toast library to show success or error notifications
import { APPLICATION_API_END_POINT } from '@/utils/constant'; // import constant containing API endpoint for application operations
import axios from 'axios'; // import axios to make HTTP requests

const shortlistingStatus = ["Accepted", "Rejected"]; // define an array containing possible applicant shortlisting statuses

const ApplicantsTable = () => { // define a function component ApplicantsTable to display and manage applicant data
    const { applicants } = useSelector( // destructure 'applicants' from Redux store using useSelector hook
        store => store.application // access 'application' slice from Redux store that contains applicants list
    );

    const statusHandler = async ( // define an asynchronous function to handle updating applicant status
        status, // argument 'status' holds the selected status value (Accepted or Rejected)
        id // argument 'id' holds the unique identifier of the applicant record
    ) => {
        console.log('called'); // log message for debugging whenever function executes
        
        try {
            axios.defaults.withCredentials = true; // enable axios to send cookies for authentication in requests
            
            const res = await axios.post( // make POST request to backend to update applicant status
                `${APPLICATION_API_END_POINT}/status/${id}/update`, // construct API URL dynamically using applicant ID
                { status } // send an object containing the updated status value as request body
            );
            
            console.log(res); // log full response for debugging
            
            if (res.data.success) { // check if the response indicates success
                toast.success(res.data.message); // show success toast notification with server-provided message
            }
        } catch (error) { // catch any errors thrown during the request
            toast.error(error.response.data.message); // display error message from server in toast notification
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
                    {
                        applicants && applicants?.applications?.map((item) => ( // iterate over all applicant records to render rows dynamically
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.applicant?.profile?.resume // check if resume file exists for applicant
                                            ? <a 
                                                className="text-blue-600 cursor-pointer" 
                                                href={item?.applicant?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                              >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                              </a> // render clickable link if resume exists
                                            : <span>NA</span> // render "NA" if resume not available
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
                                                shortlistingStatus.map((status, index) => { // map through shortlisting statuses (Accepted/Rejected)
                                                    return (
                                                        <div 
                                                            onClick={() => statusHandler(status, item?._id)} // call statusHandler with selected status and applicant ID
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

export default ApplicantsTable
