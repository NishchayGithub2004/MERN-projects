import { Button } from "@/components/ui/button"; // import Button component for reusable button UI
import { ArrowLeft } from "lucide-react"; // import ArrowLeft icon for back navigation button
import React from "react"; // import React library to define the component
import { Link, useParams } from "react-router-dom"; // import Link for navigation and useParams to access route parameters
import LectureTab from "./LectureTab"; // import LectureTab component to render lecture editing UI

const EditLecture = () => { // define a function component EditLecture to handle lecture editing
    const params = useParams(); // call useParams hook to access dynamic route parameters from the URL
    
    const courseId = params.courseId; // extract courseId parameter from URL params and store it in a variable
    
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Link to={`/admin/course/${courseId}/lecture`}> 
                        <Button size="icon" variant="outline" className="rounded-full">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <h1 className="font-bold text-xl">Update Your Lecture</h1>
                </div>
            </div>
            <LectureTab />
        </div>
    );
};

export default EditLecture;
