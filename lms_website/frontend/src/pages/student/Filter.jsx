import { Checkbox } from "@/components/ui/checkbox"; // import Checkbox component from shadcn/ui to let users select multiple categories
import { Label } from "@/components/ui/label"; // import Label component for checkbox labeling
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // import select-related components for price sorting
import { Separator } from "@/components/ui/separator"; // import Separator component to visually separate UI sections
import React, { useState } from "react"; // import React and useState hook to manage component states

const categories = [ // define array of category objects with id and label for filtering
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

const Filter = ({ handleFilterChange }) => { // define functional component Filter to manage category and price filters
    const [selectedCategories, setSelectedCategories] = useState([]); // initialize selectedCategories as empty array to track selected category ids
    const [sortByPrice, setSortByPrice] = useState(""); // initialize sortByPrice as empty string to store sorting preference

    const handleCategoryChange = (categoryId) => { // define handler to toggle category selection based on id
        setSelectedCategories((prevCategories) => { // update category list based on previous selections
            const newCategories = prevCategories.includes(categoryId) // check if category already selected
                ? prevCategories.filter((id) => id !== categoryId) // remove category if it's already selected
                : [...prevCategories, categoryId]; // otherwise, add category to selection list
            handleFilterChange(newCategories, sortByPrice); // call parent handler to apply new category filters with current sorting
            return newCategories; // return updated category list
        });
    };

    const selectByPriceHandler = (selectedValue) => { // define handler for sorting option change
        setSortByPrice(selectedValue); // update sortByPrice state with selected value
        handleFilterChange(selectedCategories, selectedValue); // call parent handler to apply new sorting with current categories
    };

    return (
        <div className="w-full md:w-[20%]"> {/* container for filter panel with responsive width */}
            <div className="flex items-center justify-between"> {/* header section for filter title and sorting dropdown */}
                <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1> {/* section heading */}
                <Select onValueChange={selectByPriceHandler}> {/* select dropdown for sorting by price */}
                    <SelectTrigger> {/* trigger button for dropdown */}
                        <SelectValue placeholder="Sort by" /> {/* placeholder shown before selection */}
                    </SelectTrigger>
                    <SelectContent> {/* dropdown menu content */}
                        <SelectGroup> {/* group of related items */}
                            <SelectLabel>Sort by price</SelectLabel> {/* label describing dropdown purpose */}
                            <SelectItem value="low">Low to High</SelectItem> {/* option to sort in ascending order */}
                            <SelectItem value="high">High to Low</SelectItem> {/* option to sort in descending order */}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4" /> {/* horizontal divider between sorting and category section */}
            <div> {/* container for category checkboxes */}
                <h1 className="font-semibold mb-2">CATEGORY</h1> {/* subheading for categories */}
                {categories.map((category) => ( // iterate over categories to render each checkbox with label
                    <div className="flex items-center space-x-2 my-2" key={category.id}> {/* wrapper for checkbox and label */}
                        <Checkbox
                            id={category.id} // assign unique id to each checkbox
                            onCheckedChange={() => handleCategoryChange(category.id)} // toggle category selection on change
                        />
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {category.label} {/* display category label */}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter; // export Filter component for use in other parts of the application