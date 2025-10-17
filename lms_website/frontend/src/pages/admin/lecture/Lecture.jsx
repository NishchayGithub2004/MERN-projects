import { Edit } from "lucide-react"; // import Edit icon from lucide-react for editing action
import React from "react"; // import React library to define the component
import { useNavigate } from "react-router-dom"; // import useNavigate hook for programmatic navigation

const Lecture = ({ lecture, courseId, index }) => { // define a function component Lecture with props lecture, courseId, and index
    const navigate = useNavigate(); // call useNavigate hook to get navigation function
    
    const goToUpdateLecture = () => { // define a function to navigate to the lecture update page
        navigate(`${lecture._id}`); // navigate to route using lecture's unique _id
    };
    
    return (
        <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
            <h1 className="font-bold text-gray-800 dark:text-gray-100">
                Lecture - {index + 1}: {lecture.lectureTitle}
            </h1>
            <Edit
                onClick={goToUpdateLecture} 
                size={20}
                className=" cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            />
        </div>
    );
};

export default Lecture;
