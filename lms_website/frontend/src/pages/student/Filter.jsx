import { Checkbox } from "@/components/ui/checkbox"; // import Checkbox component for category selection
import { Label } from "@/components/ui/label"; // import Label component for checkbox labels
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import Select components for price sorting dropdown
import { Separator } from "@/components/ui/separator"; // import Separator component to divide sections
import React, { useState } from "react"; // import React and useState hook

const categories = [ // define available course categories
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

const Filter = ({ handleFilterChange }) => { // define a function Filter to provide category and price filters
    const [selectedCategories, setSelectedCategories] = useState([]); // state to track selected categories
    const [sortByPrice, setSortByPrice] = useState(""); // state to track selected price sort option

    const handleCategoryChange = (categoryId) => { // handle selecting/unselecting categories
        setSelectedCategories((prevCategories) => {
            const newCategories = prevCategories.includes(categoryId) // check if category is already selected
                ? prevCategories.filter((id) => id !== categoryId) // remove if already selected
                : [...prevCategories, categoryId]; // add if not selected

            handleFilterChange(newCategories, sortByPrice); // call parent handler with updated filters
            return newCategories; // update state
        });
    };

    const selectByPriceHandler = (selectedValue) => { // handle sorting by price
        setSortByPrice(selectedValue); // update sort state
        handleFilterChange(selectedCategories, selectedValue); // call parent handler with updated filters
    }

    return (
        <div className="w-full md:w-[20%]">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1> {/* section title */}
                <Select onValueChange={selectByPriceHandler}> {/* dropdown to select price sort */}
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" /> {/* placeholder text */}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by price</SelectLabel> {/* label for dropdown group */}
                            <SelectItem value="low">Low to High</SelectItem> {/* option for ascending price */}
                            <SelectItem value="high">High to Low</SelectItem> {/* option for descending price */}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4" /> {/* separate sorting and category sections */}
            <div>
                <h1 className="font-semibold mb-2">CATEGORY</h1> {/* category section title */}
                {categories.map((category) => (
                    <div className="flex items-center space-x-2 my-2" key={category.id}>
                        <Checkbox
                            id={category.id} 
                            onCheckedChange={() => handleCategoryChange(category.id)} // handle checkbox toggle
                        />
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {category.label} {/* display category name */}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter; // export Filter component for use in other parts of the app
