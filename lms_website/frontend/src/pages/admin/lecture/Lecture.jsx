import { Edit } from "lucide-react"; // import Edit icon from lucide-react to provide clickable edit functionality
import React from "react"; // import React library to create functional component
import { useNavigate } from "react-router-dom"; // import useNavigate hook to enable programmatic route navigation

// define a functional component named 'Lecture' to display lecture info and handle navigation for editing, which takes following props:
const Lecture = ({ 
    lecture, // contains data object for a specific lecture
    courseId, // holds unique identifier of course to which the lecture belongs
    index // represents numerical position of the lecture in the list
}) => { 
    const navigate = useNavigate(); // call useNavigate to get navigation function used for redirecting programmatically

    const goToUpdateLecture = () => { // define function goToUpdateLecture to redirect user to the edit lecture route
        navigate(`${lecture._id}`); // navigate to a route dynamically built with lecture._id to edit that specific lecture
    };

    return (
        <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
            <h1 className="font-bold text-gray-800 dark:text-gray-100">
                Lecture - {index + 1}: {lecture.lectureTitle}
            </h1>
            <Edit 
                onClick={goToUpdateLecture} // attach click handler to icon to trigger navigation to update lecture
                size={20} // set icon size for consistent UI scaling
                className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" // apply hover styles and pointer cursor for interactivity
            />
        </div>
    );
};

export default Lecture; // export Lecture component for use in other modules