import { Button } from "@/components/ui/button"; // import Button component for clickable actions
import { Input } from "@/components/ui/input"; // import Input component for search field
import React, { useState } from "react"; // import React and useState hook
import { useNavigate } from "react-router-dom"; // import useNavigate hook for programmatic navigation

const HeroSection = () => { // define a function HeroSection for the hero banner with search
    const [searchQuery, setSearchQuery] = useState(""); // state to track search input value
    const navigate = useNavigate(); // get navigate function for routing

    const searchHandler = (e) => { // define a function to handle search form submission
        e.preventDefault(); // prevent default form submission behavior

        if (searchQuery.trim() !== "") { // only navigate if search query is not empty
            navigate(`/course/search?query=${searchQuery}`) // navigate to search results page with query
        }

        setSearchQuery(""); // reset search input
    }

    return (
        <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-white text-4xl font-bold mb-4">
                    Find the Best Courses for You {/* hero section main heading */}
                </h1>
                <p className="text-gray-200 dark:text-gray-400 mb-8">
                    Discover, Learn, and Upskill with our wide range of courses {/* hero section subheading */}
                </p>

                <form onSubmit={searchHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
                    <Input
                        type="text" // set input type as text
                        value={searchQuery} // bind input value to state
                        onChange={(e) => setSearchQuery(e.target.value)} // update state on change
                        placeholder="Search Courses" // placeholder text
                        className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" // styling for input
                    />
                    <Button 
                        type="submit" // set button type as submit
                        className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Search {/* submit button for search */}
                    </Button>
                </form>

                <Button 
                    onClick={() => navigate(`/course/search?query`)} // navigate to generic course search page
                    className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200"
                >
                    Explore Courses {/* button to explore all courses */}
                </Button>
            </div>
        </div>
    );
};

export default HeroSection; // export HeroSection component for use in other parts of the app
