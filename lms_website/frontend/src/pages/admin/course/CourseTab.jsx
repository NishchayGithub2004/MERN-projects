import RichTextEditor from "@/components/RichTextEditor"; // import RichTextEditor component for handling course description input
import { Button } from "@/components/ui/button"; // import Button component from local UI library
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // import Card-related UI components for layout
import { Input } from "@/components/ui/input"; // import Input component for text and file inputs
import { Label } from "@/components/ui/label"; // import Label component for form fields
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import Select-related UI components for dropdowns
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi"; // import API hooks for editing, fetching, and publishing courses
import { Loader2 } from "lucide-react"; // import Loader2 icon for loading spinner
import React, { useEffect, useState } from "react"; // import React and hooks useEffect, useState
import { useNavigate, useParams } from "react-router-dom"; // import useNavigate and useParams for navigation and route params
import { toast } from "sonner"; // import toast for notifications

const CourseTab = () => { // define a function CourseTab to handle editing and publishing a course
    const [input, setInput] = useState({ // declare state input object with default empty values for course fields
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });

    const params = useParams(); // call useParams to get route parameters from the URL
    
    const courseId = params.courseId; // extract courseId from params object
    
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId); // call useGetCourseByIdQuery with courseId to fetch course details

    const [publishCourse, { }] = usePublishCourseMutation(); // destructure publishCourse mutation function without using returned state

    useEffect(() => { // define a side effect to populate input state when course data is available
        if (courseByIdData?.course) { // check if course exists in courseByIdData
            const course = courseByIdData?.course; // assign course object
            setInput({ // update input state with course details
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]); // run effect when courseByIdData changes

    const [previewThumbnail, setPreviewThumbnail] = useState(""); // declare state previewThumbnail for showing selected image preview
    
    const navigate = useNavigate(); // call useNavigate to programmatically redirect user

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation(); // destructure editCourse mutation function and state values

    const changeEventHandler = (e) => { // define a function changeEventHandler to update input state on input change
        const { name, value } = e.target; // destructure name and value from event target
        setInput({ ...input, [name]: value }); // spread existing input and update changed field
    };

    const selectCategory = (value) => { // define a function selectCategory to set category value
        setInput({ ...input, category: value }); // spread input and update category field
    };
    
    const selectCourseLevel = (value) => { // define a function selectCourseLevel to set courseLevel value
        setInput({ ...input, courseLevel: value }); // spread input and update courseLevel field
    };
    
    const selectThumbnail = (e) => { // define a function selectThumbnail to handle file input for course thumbnail
        const file = e.target.files?.[0]; // access first file from event target files
        if (file) { // check if file exists
            setInput({ ...input, courseThumbnail: file }); // update input with file object
            const fileReader = new FileReader(); // create new FileReader instance
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result); // set previewThumbnail with fileReader result after loading
            fileReader.readAsDataURL(file); // read file as data URL for preview
        }
    };

    const updateCourseHandler = async () => { // define a function updateCourseHandler to update course details
        const formData = new FormData(); // create new FormData instance
        formData.append("courseTitle", input.courseTitle); // append courseTitle to formData
        formData.append("subTitle", input.subTitle); // append subTitle to formData
        formData.append("description", input.description); // append description to formData
        formData.append("category", input.category); // append category to formData
        formData.append("courseLevel", input.courseLevel); // append courseLevel to formData
        formData.append("coursePrice", input.coursePrice); // append coursePrice to formData
        formData.append("courseThumbnail", input.courseThumbnail); // append courseThumbnail file to formData
        await editCourse({ // call editCourse mutation
            formData, // pass formData containing course fields
            courseId // pass courseId for course identification
        });
    };

    const publishStatusHandler = async (action) => { // define a function publishStatusHandler to toggle publish/unpublish status
        try {
            const response = await publishCourse({ // call publishCourse mutation
                courseId, // pass courseId to identify course
                query: action // pass action ("true" or "false") as query
            });
            if (response.data) { // check if response contains data
                refetch(); // refetch course data after publishing status update
                toast.success(response.data.message); // show success message from API response
            }
        } catch (error) { // handle error case
            toast.error("Failed to publish or unpublish course"); // show error toast
        }
    };

    useEffect(() => { // define a side effect to handle editCourse response
        if (isSuccess) { // check if editCourse was successful
            toast.success(data.message || "Course update."); // show success message
        }
        if (error) { // check if error occurred
            toast.error(error.data.message || "Failed to update course"); // show error toast
        }
    }, [isSuccess, error]); // run effect when isSuccess or error changes

    if (courseByIdLoading) return <h1>Loading...</h1>; // conditionally render loading state if course data is loading

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button
                        disabled={courseByIdData?.course.lectures.length === 0} // disable button if no lectures exist
                        variant="outline" // set button variant to outline
                        onClick={() => publishStatusHandler( // call publishStatusHandler on click
                            courseByIdData?.course.isPublished ? "false" : "true" // pass "false" if already published, otherwise "true"
                        )}
                    >
                        {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"} 
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text" // input type set to text
                            name="courseTitle" // input name attribute set to courseTitle
                            value={input.courseTitle} // bind value to input.courseTitle
                            onChange={changeEventHandler} // call changeEventHandler on change
                            placeholder="Ex. Fullstack developer" // input placeholder text
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} /> {/* pass input and setInput props to RichTextEditor */}
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select
                                defaultValue={input.category} // set default value to input.category
                                onValueChange={selectCategory} // call selectCategory when value changes
                            >
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
                        <div>
                            <Label>Course Level</Label>
                            <Select
                                defaultValue={input.courseLevel} // set default value to input.courseLevel
                                onValueChange={selectCourseLevel} // call selectCourseLevel when value changes
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number" // input type set to number
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file" // input type set to file
                            onChange={selectThumbnail} // call selectThumbnail on change
                            accept="image/*" // accept only image file types
                            className="w-fit"
                        />
                        {previewThumbnail && (
                            <img
                                src={previewThumbnail} // bind src to previewThumbnail state
                                className="e-64 my-2"
                                alt="Course Thumbnail"
                            />
                        )}
                    </div>
                    <div>
                        <Button
                            onClick={() => navigate("/admin/course")} // navigate back to course list on click
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading} // disable button while editCourse mutation is loading
                            onClick={updateCourseHandler} // call updateCourseHandler on click
                        >
                            {isLoading ? ( // show loader if isLoading, else show "Save"
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;
