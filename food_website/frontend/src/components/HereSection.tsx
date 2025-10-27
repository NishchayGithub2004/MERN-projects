import { useState } from "react"; // import useState hook to manage state
import { Input } from "./ui/input"; // import Input component from shadCN UI library
import { Search } from "lucide-react"; // import Search icon from lucide-react library
import { Button } from "./ui/button"; // import Button component from shadCN UI library
import HereImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom"; // import useNavigate hook from react-router-dom library to navigate programmatically

const HereSection = () => {
    const [searchText, setSearchText] = useState<string>(""); // using useState hook, create a state variable 'searchText' with empty string as initial value and function 'setSearchText' to change it's value
    
    const navigate = useNavigate(); // create an instance of useNavigate hook to navigate programmatically
    
    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:w-[40%]">
                <div className="flex flex-col gap-5">
                    <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">Order Food anytime & anywhere</h1>
                    <p className="text-gray-500">Hey! Our Delicious food is waiting for you, we are always near to you.</p>
                </div>
                <div className="relative flex items-center gap-2">
                    <Input
                        type="text"
                        value={searchText}
                        placeholder="Search restaurant by name, city & country"
                        onChange={(e) => setSearchText(e.target.value)} // when input value of this field changes, call 'setSearchText' state function to update the value of 'searchText' state variable
                        className="pl-10 shadow-lg"
                    />
                    <Search className="text-gray-500 absolute inset-y-2 left-2" />
                    <Button onClick={() => navigate(`/search/${searchText}`)} className="bg-orange hover:bg-hoverOrange">Search</Button> {/* clicking this button redirects user to this dynamic URL */}
                </div>
            </div>
            <div>
                <img
                    src={HereImage}
                    alt=""
                    className="object-cover w-full max-h-[500px]"
                />
            </div>
        </div>
    );
};

export default HereSection;