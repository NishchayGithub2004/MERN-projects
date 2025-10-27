import { Checkbox } from "@/components/ui/checkbox"; // import 'Checkbox' component from shadCN UI library
import { Label } from "@/components/ui/label"; // import Label component for checkbox labels
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import Select components for price sorting dropdown
import { Separator } from "@/components/ui/separator"; // import Separator component to divide sections
import React, { useState } from "react"; // import React and useState hook

// define an array of objects of properties 'id' and 'label'
const categories = [
    { id: "nextjs", label: "Next JS" },
    { id: "data science", label: "Data Science" },
    { id: "frontend development", label: "Frontend Development" },
    { id: "fullstack development", label: "Fullstack Development" },
    { id: "mern stack development", label: "MERN Stack Development" },
    { id: "backend development", label: "Backend Development" },
    { id: "javascript", label: "Javascript" },
    { id: "python", label: "Python" },
    { id: "docker", label: "Docker" },
    { id: "mongodb", label: "MongoDB" },
    { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => { // define a functional component named 'Filter' that takes 'handleFilterChange' as prop
    const [selectedCategories, setSelectedCategories] = useState([]); // using 'useState' hook, create a state variable 'selectedCategories' initialized as an empty array and 'setSelectedCategories' function to modify the array
    const [sortByPrice, setSortByPrice] = useState(""); // using 'useState' hook, create a state variable 'sortByPrice' initialized as an empty string and 'setSortByPrice' function to modify the state variable

    const handleCategoryChange = (categoryId) => { // create a function named 'handleCategoryChange' that takes 'categoryId' as argument
        setSelectedCategories((prevCategories) => { // create a function named 'setSelectedCategories' function inside it that takes 'prevCategories' as argument
            const newCategories = prevCategories.includes(categoryId) // if 'prevCategories' include 'categoryId'
                ? prevCategories.filter((id) => id !== categoryId) // filter out values in 'prevCategories' for whom, value of 'id' is not equal to 'categoryId'
                : [...prevCategories, categoryId]; // otherwise, copy pre-existing values of 'prevCategories' using spread operator and add 'categoryId' to it

            handleFilterChange(newCategories, sortByPrice); // call 'handleFilterChange' function for 'newCategories' and 'sortByPrice' to filter out as per new categories with selectee sorting option for prices
            
            return newCategories; // return new categories that are sorted by price as per choose method (increasing or decreasing)
        });
    };

    const selectByPriceHandler = (selectedValue) => { // handle sorting by price
        setSortByPrice(selectedValue); // update sort state
        handleFilterChange(selectedCategories, selectedValue); // call parent handler with updated filters
    }

    return (
        <div className="w-full md:w-[20%]">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
                <Select onValueChange={selectByPriceHandler}> {/* when a value is selected, 'selectByPriceHandler' function is called */}
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by price</SelectLabel>
                            <SelectItem value="low">Low to High</SelectItem>
                            <SelectItem value="high">High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4" />
            <div>
                <h1 className="font-semibold mb-2">CATEGORY</h1>
                {categories.map((category) => (
                    <div className="flex items-center space-x-2 my-2" key={category.id}>
                        <Checkbox
                            id={category.id} 
                            onCheckedChange={() => handleCategoryChange(category.id)} // when this checkbox is checked, 'handleCategoryChange' function is called with value of property 'id' of 'category' object as argument
                        />
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {category.label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter;
