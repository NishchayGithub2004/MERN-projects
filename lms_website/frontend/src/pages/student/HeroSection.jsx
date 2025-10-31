import { Button } from "@/components/ui/button"; // import Button component from shadcn/ui for interactive buttons
import { Input } from "@/components/ui/input"; // import Input component from shadcn/ui for text input fields
import React, { useState } from "react"; // import React and useState hook to manage internal state
import { useNavigate } from "react-router-dom"; // import useNavigate hook to programmatically redirect users

const HeroSection = () => { // define functional component HeroSection representing the top hero section of the homepage
    const [searchQuery, setSearchQuery] = useState(""); // create searchQuery state to store user’s input and setSearchQuery function to update it
    const navigate = useNavigate(); // initialize navigate to programmatically change routes

    const searchHandler = (e) => { // define handler to manage form submission for search
        e.preventDefault(); // prevent default form submission to handle search manually
        if (searchQuery.trim() !== "") { // check if input is not empty after trimming whitespace
            navigate(`/course/search?query=${searchQuery}`); // redirect user to course search page with query parameter
        }
        setSearchQuery(""); // reset input field after submission
    };

    return (
        <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center"> {/* container for hero section with gradient background */}
            <div className="max-w-3xl mx-auto"> {/* wrapper to center content and limit width */}
                <h1 className="text-white text-4xl font-bold mb-4"> {/* main heading for hero section */}
                    Find the Best Courses for You
                </h1>
                <p className="text-gray-200 dark:text-gray-400 mb-8"> {/* subheading describing the purpose */}
                    Discover, Learn, and Upskill with our wide range of courses
                </p>

                <form onSubmit={searchHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"> {/* search form with input and button */}
                    <Input
                        type="text" // specify input type as text
                        value={searchQuery} // bind current state value to input
                        onChange={(e) => setSearchQuery(e.target.value)} // update searchQuery on user typing
                        placeholder="Search Courses" // display placeholder text inside input
                        className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" // styling for text input
                    />
                    <Button 
                        type="submit" // define button as form submit type
                        className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800" // apply styling and hover effects
                    >
                        Search {/* button label */}
                    </Button>
                </form>

                <Button 
                    onClick={() => navigate(`/course/search?query`)} // navigate to general search results when clicked
                    className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200" // styling for explore button
                >
                    Explore Courses {/* label for secondary action button */}
                </Button>
            </div>
        </div>
    );
};

export default HeroSection; // export HeroSection for use in other components or pages