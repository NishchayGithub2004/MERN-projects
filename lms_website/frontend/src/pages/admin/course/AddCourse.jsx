import { Button } from "@/components/ui/button"; // import button component from local UI library for form actions
import { Input } from "@/components/ui/input"; // import input component from local UI library for text input fields
import { Label } from "@/components/ui/label"; // import label component for form field labels
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import select components to create dropdown options
import { useCreateCourseMutation } from "@/features/api/courseApi"; // import custom RTK query hook for triggering course creation API mutation
import { Loader2 } from "lucide-react"; // import loader icon for showing loading animation on submit
import React, { useEffect, useState } from "react"; // import React library and hooks useState, useEffect for state management and side effects
import { useNavigate } from "react-router-dom"; // import useNavigate hook for programmatic route navigation
import { toast } from "sonner"; // import toast notification library to show feedback messages

const AddCourse = () => { // define a functional component 'AddCourse' to handle new course creation logic and UI
    const [courseTitle, setCourseTitle] = useState(""); // create state variable 'courseTitle' initialized as empty string to store input value
    const [category, setCategory] = useState(""); // create state variable 'category' initialized as empty string to store selected dropdown value

    const [ // destructure mutation hook to perform create course API operation
        createCourse, // function to call API and create a new course
        { data, isLoading, error, isSuccess } // object containing response data, loading status, error, and success status
    ] = useCreateCourseMutation(); // call useCreateCourseMutation to enable API interaction for course creation

    const navigate = useNavigate(); // get navigation function from useNavigate hook to redirect user after operations

    const getSelectedCategory = (value) => { // define function 'getSelectedCategory' to update category state when dropdown value changes
        setCategory(value); // update 'category' state with selected dropdown value
    };

    const createCourseHandler = async () => { // define async function 'createCourseHandler' to submit course creation form
        await createCourse({ // call mutation function with payload containing course details
            courseTitle, // send course title entered by user
            category // send selected category for the course
        });
    };

    useEffect(() => { // use useEffect hook to perform side effects when API call completes
        if (isSuccess) { // check if API call was successful
            toast.success(data?.message || "Course created."); // display success message from API or fallback message
            navigate("/admin/course"); // navigate to course listing page after successful creation
        }
    }, [isSuccess, error]); // run effect when success or error state changes

    return (
        <div className="flex-1 mx-10"> {/* define main container with responsive layout */}
            <div className="mb-4"> {/* define section for form header */}
                <h1 className="font-bold text-xl"> {/* render title text */}
                    Lets add course, add some basic course details for your new course
                </h1>
                <p className="text-sm"> {/* render subtitle text */}
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus, laborum!
                </p>
            </div>
            <div className="space-y-4"> {/* define section for input fields with spacing */}
                <div> {/* title input section */}
                    <Label>Title</Label> {/* render label for input */}
                    <Input
                        type="text" // specify input type as text
                        value={courseTitle} // bind input value to courseTitle state
                        onChange={(e) => setCourseTitle(e.target.value)} // update courseTitle state when user types
                        placeholder="Your Course Name" // placeholder text for input
                    />
                </div>
                <div> {/* category select dropdown section */}
                    <Label>Category</Label> {/* render label for dropdown */}
                    <Select onValueChange={getSelectedCategory}> {/* attach event handler to update selected category */}
                        <SelectTrigger className="w-[180px]"> {/* render dropdown trigger button */}
                            <SelectValue placeholder="Select a category" /> {/* render placeholder text */}
                        </SelectTrigger>
                        <SelectContent> {/* render dropdown content area */}
                            <SelectGroup> {/* group dropdown options */}
                                <SelectLabel>Category</SelectLabel> {/* label for dropdown group */}
                                <SelectItem value="Next JS">Next JS</SelectItem> {/* render dropdown item for category */}
                                <SelectItem value="Data Science">Data Science</SelectItem>
                                <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                <SelectItem value="Javascript">Javascript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Docker">Docker</SelectItem>
                                <SelectItem value="MongoDB">MongoDB</SelectItem>
                                <SelectItem value="HTML">HTML</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2"> {/* define button group layout */}
                    <Button
                        variant="outline" // apply outlined button style
                        onClick={() => navigate("/admin/course")} // navigate back to course list page on click
                    >
                        Back {/* render button text */}
                    </Button>
                    <Button
                        disabled={isLoading} // disable button while API call is loading
                        onClick={createCourseHandler} // call handler function when user clicks button
                    >
                        {isLoading ? ( // conditional rendering: show loading spinner if API is processing
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* render loader icon with spin animation */}
                                Please wait {/* show waiting message */}
                            </>
                        ) : (
                            "Create" // show "Create" text if not loading
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCourse; // export AddCourse component for route use