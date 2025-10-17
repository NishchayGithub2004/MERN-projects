import { Button } from "@/components/ui/button"; // import Button component from local UI library
import { Input } from "@/components/ui/input"; // import Input component from local UI library
import { Label } from "@/components/ui/label"; // import Label component from local UI library
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import multiple Select-related components for dropdowns
import { useCreateCourseMutation } from "@/features/api/courseApi"; // import custom hook for creating a course API mutation
import { Loader2 } from "lucide-react"; // import Loader2 icon from lucide-react for loading spinner
import React, { useEffect, useState } from "react"; // import React and hooks useEffect, useState
import { useNavigate } from "react-router-dom"; // import useNavigate hook for programmatic navigation
import { toast } from "sonner"; // import toast notification library

const AddCourse = () => { // define a function AddCourse to handle course creation page UI and logic
    const [courseTitle, setCourseTitle] = useState(""); // declare state courseTitle with initial value "" and updater setCourseTitle
    const [category, setCategory] = useState(""); // declare state category with initial value "" and updater setCategory

    const [ // destructure return from useCreateCourseMutation to handle course creation API
        createCourse, // function to trigger the course creation mutation
        { data, isLoading, error, isSuccess } // destructured object containing API response data, loading state, error, and success status
    ] = useCreateCourseMutation();

    const navigate = useNavigate(); // call useNavigate to programmatically redirect user between routes

    const getSelectedCategory = (value) => { // define a function getSelectedCategory to update category state when user selects a category
        setCategory(value); // call setCategory with value argument to set selected category
    };

    const createCourseHandler = async () => { // define a function createCourseHandler to handle course creation logic
        await createCourse({ // call createCourse mutation function with object argument
            courseTitle, // pass courseTitle state value as courseTitle key
            category // pass category state value as category key
        });
    };

    useEffect(() => { // call useEffect to handle side effects after API response
        if (isSuccess) { // check if course creation mutation is successful
            toast.success( // call toast.success to show success notification
                data?.message || "Course created." // pass custom message from API response or fallback string
            );
            navigate("/admin/course"); // call navigate to redirect to course list page after success
        }
    }, [isSuccess, error]); // dependency array ensures effect runs when isSuccess or error changes

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    Lets add course, add some basic course details for your new course
                </h1>
                <p className="text-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
                    laborum!
                </p>
            </div>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text" // input type set to text
                        value={courseTitle} // bind value to courseTitle state
                        onChange={(e) => setCourseTitle(e.target.value)} // call setCourseTitle with input value on change
                        placeholder="Your Course Name" // input placeholder text
                    />
                </div>
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={getSelectedCategory}> {/* pass getSelectedCategory as callback to update category */}
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="Next JS">Next JS</SelectItem>
                                <SelectItem value="Data Science">Data Science</SelectItem>
                                <SelectItem value="Frontend Development">
                                    Frontend Development
                                </SelectItem>
                                <SelectItem value="Fullstack Development">
                                    Fullstack Development
                                </SelectItem>
                                <SelectItem value="MERN Stack Development">
                                    MERN Stack Development
                                </SelectItem>
                                <SelectItem value="Javascript">Javascript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Docker">Docker</SelectItem>
                                <SelectItem value="MongoDB">MongoDB</SelectItem>
                                <SelectItem value="HTML">HTML</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline" // set button variant to outline
                        onClick={() => navigate("/admin/course")} // call navigate to go back to course list on click
                    >
                        Back
                    </Button>
                    <Button
                        disabled={isLoading} // disable button if isLoading is true
                        onClick={createCourseHandler} // call createCourseHandler function on click
                    >
                        {isLoading ? ( // conditional rendering: show loader if loading, else show "Create"
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Create"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
