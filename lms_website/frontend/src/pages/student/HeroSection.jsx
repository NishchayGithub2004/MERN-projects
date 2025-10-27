import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI library
import { Input } from "@/components/ui/input"; // import 'Input' component from shadCN UI library
import React, { useState } from "react"; // import 'useState' hook to manage states
import { useNavigate } from "react-router-dom"; // import 'useNavigate' hook for programmatic navigation

const HeroSection = () => { // define a functional component named 'HeroSection' that doesn't take any props
    const [searchQuery, setSearchQuery] = useState(""); // using 'useState' hook, create a state variable named 'searchQuery' with empty string as initial value and a function named 'setSearchQuery' to modify it's value
    
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate programmatically

    const searchHandler = (e) => { // define a function named 'searchHandler' that takes an event object as argument
        e.preventDefault(); // prevent default form submission behavior of submitting form as soon as it is submitted, this is done to do some side work before submitting the form

        if (searchQuery.trim() !== "") { // if 'searchQuery' is not empty after removing all white spaces
            navigate(`/course/search?query=${searchQuery}`) // navigate user to search result page
        }

        setSearchQuery(""); // reset 'searchQuery' to empty string
    }

    return (
        <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-white text-4xl font-bold mb-4">
                    Find the Best Courses for You
                </h1>
                <p className="text-gray-200 dark:text-gray-400 mb-8">
                    Discover, Learn, and Upskill with our wide range of courses
                </p>

                <form onSubmit={searchHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // when value of this input field changes, call 'setSearchQuery' function for new input value
                        placeholder="Search Courses"
                        className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <Button 
                        type="submit"
                        className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Search
                    </Button>
                </form>

                <Button 
                    onClick={() => navigate(`/course/search?query`)} // clicking this button redirects user to search result page
                    className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200"
                >
                    Explore Courses
                </Button>
            </div>
        </div>
    );
};

export default HeroSection;
