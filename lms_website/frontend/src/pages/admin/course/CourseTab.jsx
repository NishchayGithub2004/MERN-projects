import RichTextEditor from "@/components/RichTextEditor"; // import RichTextEditor component for handling rich text description input
import { Button } from "@/components/ui/button"; // import Button component from local UI library for form actions
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components for layout and structure
import { Input } from "@/components/ui/input"; // import Input component for text, number, and file fields
import { Label } from "@/components/ui/label"; // import Label component for input field captions
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import Select components for dropdown inputs
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi"; // import API hooks to fetch, edit, and publish course data
import { Loader2 } from "lucide-react"; // import Loader2 icon to show spinner during loading
import React, { useEffect, useState } from "react"; // import React and hooks useEffect, useState for reactivity and side effects
import { useNavigate, useParams } from "react-router-dom"; // import useNavigate for routing and useParams to get courseId from URL
import { toast } from "sonner"; // import toast for success and error notifications

const CourseTab = () => { // define a functional component named 'CourseTab' to manage course editing and publishing UI logic
    const [input, setInput] = useState({ // declare state 'input' as object to hold editable course fields
        courseTitle: "", // initialize with empty course title
        subTitle: "", // initialize with empty subtitle
        description: "", // initialize with empty description
        category: "", // initialize with empty category
        courseLevel: "", // initialize with empty course level
        coursePrice: "", // initialize with empty course price
        courseThumbnail: "", // initialize with empty thumbnail
    });

    const params = useParams(); // get route parameters from URL
    const courseId = params.courseId; // extract courseId value from params object

    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId); // call API to fetch course data by courseId and destructure response

    const [publishCourse] = usePublishCourseMutation(); // get publishCourse mutation function to toggle publish/unpublish state

    useEffect(() => { // run side effect when fetched course data changes
        if (courseByIdData?.course) { // check if course data exists
            const course = courseByIdData.course; // assign fetched course object
            setInput({ // update 'input' state with course data
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "", // reset file field since backend file URL is not editable directly
            });
        }
    }, [courseByIdData]); // dependency ensures update when courseByIdData changes

    const [previewThumbnail, setPreviewThumbnail] = useState(""); // declare state for storing preview image URL of selected thumbnail

    const navigate = useNavigate(); // get navigate function to redirect user between admin routes

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation(); // get mutation function and states for editing a course

    const changeEventHandler = (e) => { // define handler to update text/number fields
        const { name, value } = e.target; // extract name and value from target
        setInput({ ...input, [name]: value }); // update corresponding field inside input state
    };

    const selectCategory = (value) => { // define handler for category selection
        setInput({ ...input, category: value }); // update category in input state
    };

    const selectCourseLevel = (value) => { // define handler for course level selection
        setInput({ ...input, courseLevel: value }); // update courseLevel in input state
    };

    const selectThumbnail = (e) => { // define handler to process file input for thumbnail
        const file = e.target.files?.[0]; // get selected file
        if (file) { // check if file exists
            setInput({ ...input, courseThumbnail: file }); // save file object into input state
            const reader = new FileReader(); // create FileReader instance
            reader.onloadend = () => setPreviewThumbnail(reader.result); // update previewThumbnail after file is read
            reader.readAsDataURL(file); // read file as data URL to preview image
        }
    };

    const updateCourseHandler = async () => { // define handler to send updated course data to API
        const formData = new FormData(); // create FormData object for multipart request
        formData.append("courseTitle", input.courseTitle); // append title to formData
        formData.append("subTitle", input.subTitle); // append subtitle
        formData.append("description", input.description); // append description
        formData.append("category", input.category); // append category
        formData.append("courseLevel", input.courseLevel); // append course level
        formData.append("coursePrice", input.coursePrice); // append course price
        formData.append("courseThumbnail", input.courseThumbnail); // append thumbnail file
        await editCourse({ formData, courseId }); // call mutation with formData and courseId
    };

    const publishStatusHandler = async (action) => { // define function to toggle publish/unpublish status
        try {
            const response = await publishCourse({ courseId, query: action }); // call API mutation with courseId and query
            if (response.data) { // if success response exists
                refetch(); // re-fetch course data to reflect updated status
                toast.success(response.data.message); // show success toast message
            }
        } catch { // handle potential API failure
            toast.error("Failed to publish or unpublish course"); // show error toast
        }
    };

    useEffect(() => { // run side effect when editCourse mutation result changes
        if (isSuccess) toast.success(data.message || "Course updated."); // show success toast on successful update
        if (error) toast.error(error.data?.message || "Failed to update course"); // show error toast if update fails
    }, [isSuccess, error]); // depend on mutation states

    if (courseByIdLoading) return <h1>Loading...</h1>; // render loading message while course data is being fetched

    return (
        <Card> {/* container card for edit form layout */}
            <CardHeader className="flex flex-row justify-between"> {/* header with title and action buttons */}
                <div>
                    <CardTitle>Basic Course Information</CardTitle> {/* section title */}
                    <CardDescription>Make changes to your course details below.</CardDescription> {/* section description */}
                </div>
                <div className="space-x-2"> {/* container for action buttons */}
                    <Button
                        disabled={courseByIdData?.course.lectures.length === 0} // disable if course has no lectures
                        variant="outline" // use outlined button style
                        onClick={() => publishStatusHandler( // toggle publish status on click
                            courseByIdData?.course.isPublished ? "false" : "true" // unpublish if already published, else publish
                        )}
                    >
                        {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"} {/* show dynamic button text */}
                    </Button>
                    <Button>Remove Course</Button> {/* placeholder for course deletion */}
                </div>
            </CardHeader>
            <CardContent> {/* main content area */}
                <div className="space-y-4 mt-5"> {/* vertical spacing between inputs */}
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text" // text input for course title
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler} // update title on change
                            placeholder="Ex. Fullstack Developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Learn Fullstack Development in 2 Months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} /> // pass state and setter to RichTextEditor
                    </div>
                    <div className="flex items-center gap-5"> {/* grouped inputs for category, level, price */}
                        <div>
                            <Label>Category</Label>
                            <Select defaultValue={input.category} onValueChange={selectCategory}> // handle category select
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
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
                        <div>
                            <Label>Course Level</Label>
                            <Select defaultValue={input.courseLevel} onValueChange={selectCourseLevel}> // handle level select
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select level" />
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
                                type="number" // numeric input for price
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
                            type="file" // file input for uploading thumbnail
                            onChange={selectThumbnail}
                            accept="image/*" // restrict to image types
                            className="w-fit"
                        />
                        {previewThumbnail && ( // conditionally render preview if available
                            <img src={previewThumbnail} className="h-64 my-2 rounded" alt="Course Thumbnail" />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/admin/course")} variant="outline">Cancel</Button> // navigate back to course list
                        <Button disabled={isLoading} onClick={updateCourseHandler}> // call update handler on click
                            {isLoading ? ( // render loading spinner if mutation is in progress
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Save" // render button text when idle
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab; // export component for external use