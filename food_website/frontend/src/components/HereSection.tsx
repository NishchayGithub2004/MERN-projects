import { useState } from "react"; // import 'useState' hook to manage component state for search input
import { Input } from "./ui/input"; // import 'Input' component for search field UI
import { Search } from "lucide-react"; // import 'Search' icon to visually represent search functionality
import { Button } from "./ui/button"; // import 'Button' component for triggering search action
import HereImage from "@/assets/hero_pizza.png"; // import hero section image to display promotional graphic
import { useNavigate } from "react-router-dom"; // import 'useNavigate' hook to navigate between routes programmatically

const HereSection = () => { // define a functional component named 'HereSection' to render hero section with search functionality
    const [searchText, setSearchText] = useState<string>(""); // create state variable 'searchText' initialized as an empty string and 'setSearchText' function to update it dynamically on user input

    const navigate = useNavigate(); // initialize 'useNavigate' hook to handle route redirection when user performs search
    
    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:w-[40%]">
                <div className="flex flex-col gap-5">
                    <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
                        Order Food anytime & anywhere
                    </h1> {/* render main heading text promoting food ordering */}
                    <p className="text-gray-500">
                        Hey! Our Delicious food is waiting for you, we are always near to you.
                    </p> {/* render supportive subtext encouraging user to order */}
                </div>
                <div className="relative flex items-center gap-2">
                    <Input
                        type="text" // define input type as text to accept restaurant or location names
                        value={searchText} // bind current input value to 'searchText' state variable
                        placeholder="Search restaurant by name, city & country" // provide a descriptive placeholder for user guidance
                        onChange={(e) => setSearchText(e.target.value)} // when user types, update 'searchText' state with latest input value
                        className="pl-10 shadow-lg"
                    />
                    <Search className="text-gray-500 absolute inset-y-2 left-2" /> {/* render search icon inside input box for better UX */}
                    <Button
                        onClick={() => navigate(`/search/${searchText}`)} // clicking this navigates to dynamic route based on entered search text
                        className="bg-orange hover:bg-hoverOrange"
                    >
                        Search
                    </Button>
                </div>
            </div>
            <div>
                <img
                    src={HereImage} // render hero image asset for visual appeal
                    alt="" // provide empty alt since image is decorative
                    className="object-cover w-full max-h-[500px]" // ensure image fits well within layout
                />
            </div>
        </div>
    );
};

export default HereSection; // export 'HereSection' component for use in other pages