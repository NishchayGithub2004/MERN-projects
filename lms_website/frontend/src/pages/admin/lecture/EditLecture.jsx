import { Button } from "@/components/ui/button"; // import Button component for creating a consistent clickable UI element
import { ArrowLeft } from "lucide-react"; // import ArrowLeft icon to visually represent back navigation
import React from "react"; // import React to define a functional component
import { Link, useParams } from "react-router-dom"; // import Link for client-side navigation and useParams to access route parameters
import LectureTab from "./LectureTab"; // import LectureTab component that manages lecture editing logic and UI

const EditLecture = () => { // define a functional component named 'EditLecture' to provide an interface for editing lectures
    const params = useParams(); // call useParams to access the dynamic route parameters from the URL
    const courseId = params.courseId; // extract courseId from params object to identify which course’s lecture is being edited

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Link to={`/admin/course/${courseId}/lecture`}> {/* link to navigate back to the course lecture list page */}
                        <Button 
                            size="icon" // specify button size to be icon-sized for compact UI
                            variant="outline" // set variant to outline for visual distinction
                            className="rounded-full" // apply rounded style for circular icon button
                        >
                            <ArrowLeft size={16} /> {/* render arrow icon inside button for back navigation */}
                        </Button>
                    </Link>
                    <h1 className="font-bold text-xl">Update Your Lecture</h1> {/* heading indicating purpose of this page */}
                </div>
            </div>
            <LectureTab /> {/* render LectureTab component which contains the main lecture editing form and logic */}
        </div>
    );
};

export default EditLecture; // export EditLecture component for use in other modules