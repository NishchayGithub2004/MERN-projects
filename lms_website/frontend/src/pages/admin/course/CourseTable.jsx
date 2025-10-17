import { Badge } from "@/components/ui/badge"; // import Badge component for showing course status
import { Button } from "@/components/ui/button"; // import Button component for actions
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // import Table-related components for tabular layout
import { useGetCreatorCourseQuery } from "@/features/api/courseApi"; // import custom hook to fetch creator's courses from API
import { Edit } from "lucide-react"; // import Edit icon from lucide-react
import React from "react"; // import React to define component
import { useNavigate } from "react-router-dom"; // import useNavigate for navigation between routes

const CourseTable = () => { // define a function component CourseTable with no arguments
    const { data, isLoading } = useGetCreatorCourseQuery(); // call useGetCreatorCourseQuery hook to fetch courses and extract data, isLoading

    const navigate = useNavigate(); // call useNavigate to get navigation function for programmatic route changes

    if (isLoading) return <h1>Loading...</h1>; // check if courses are still loading and display loading text if true

    return (
        <div>
            <Button onClick={() => navigate(`create`)}>Create a new course</Button> 
            {/* navigate to course creation page when button is clicked */}

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
                    {data.courses.map((course) => ( // iterate over courses array and render each course in a table row
                        <TableRow key={course._id}> {/* use course._id as unique key for React rendering */}
                            <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell> 
                            {/* show course price or 'NA' if not available */}
                            
                            <TableCell> 
                                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> 
                                {/* show badge with course status based on isPublished */}
                            </TableCell>

                            <TableCell>{course.courseTitle}</TableCell> {/* display course title */}
                            
                            <TableCell className="text-right">
                                <Button 
                                    size='sm' 
                                    variant='ghost' 
                                    onClick={() => navigate(`${course._id}`)} // navigate to course detail/edit page using course._id
                                >
                                    <Edit /> {/* render edit icon inside button */}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CourseTable;
