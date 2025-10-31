import { Badge } from "@/components/ui/badge"; // import Badge component to display course status visually (e.g., Published/Draft)
import { Button } from "@/components/ui/button"; // import Button component to trigger navigation or actions
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // import table UI components for structured tabular data display
import { useGetCreatorCourseQuery } from "@/features/api/courseApi"; // import custom hook to fetch courses created by the current user
import { Edit } from "lucide-react"; // import Edit icon to visually represent the edit action
import React from "react"; // import React to define functional component
import { useNavigate } from "react-router-dom"; // import useNavigate hook for programmatic route changes

const CourseTable = () => { // define functional component CourseTable to render list of creator's courses
    const { data, isLoading } = useGetCreatorCourseQuery(); // call useGetCreatorCourseQuery hook to fetch creator’s courses and destructure response data and loading state

    const navigate = useNavigate(); // call useNavigate to enable navigation between routes

    if (isLoading) return <h1>Loading...</h1>; // conditionally render loading message while data is being fetched

    return (
        <div>
            <Button onClick={() => navigate(`create`)}>Create a new course</Button> // call navigate function to go to course creation page on button click

            <Table> 
                <TableCaption>A list of your recent courses.</TableCaption> 
                <TableHeader> 
                    <TableRow> 
                        <TableHead className="w-[100px]">Price</TableHead> 
                        <TableHead>Status</TableHead> 
                        <TableHead>Title</TableHead> 
                        <TableHead className="text-right">Action</TableHead> 
                    </TableRow> 
                </TableHeader>
                <TableBody> 
                    {data.courses.map((course) => ( // iterate through data.courses array to render each course as a table row
                        <TableRow key={course._id}> // assign unique key as course._id for efficient React rendering
                            <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell> // display course price or "NA" if price is missing
                            <TableCell> 
                                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> // show badge indicating published or draft status based on isPublished boolean
                            </TableCell>
                            <TableCell>{course.courseTitle}</TableCell> // display course title from course data
                            <TableCell className="text-right"> 
                                <Button 
                                    size='sm' // set button size to small for compact layout
                                    variant='ghost' // apply ghost variant for minimal button styling
                                    onClick={() => navigate(`${course._id}`)} // navigate to individual course edit or detail page using course._id
                                > 
                                    <Edit /> // render Edit icon inside button for visual cue of edit action
                                </Button> 
                            </TableCell>
                        </TableRow>
                    ))} 
                </TableBody>
            </Table>
        </div>
    );
};

export default CourseTable; // export CourseTable component as default for use in other parts of the app