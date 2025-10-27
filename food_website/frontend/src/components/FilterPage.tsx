import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' hook to manage restaurant state
import { Button } from "./ui/button"; // import 'Button' component from shadCN UI library
import { Checkbox } from "./ui/checkbox"; // import 'Checkbox' component from shadCN UI library
import { Label } from "./ui/label"; // import 'Label' component from shadCN UI library

export type FilterOptionsState = { // create a custom data type 'FilterOptionsState' that contains properties 'id' and 'label' of type string
    id: string;
    label: string;
};

const filterOptions: FilterOptionsState[] = [ // create an array of 'FilterOptionsState' type and initialize it with some values
    { id: "burger", label: "Burger" },
    { id: "thali", label: "Thali" },
    { id: "biryani", label: "Biryani" },
    { id: "momos", label: "Momos" },
];

const FilterPage = () => {
    const { setAppliedFilter, appliedFilter, resetAppliedFilter } = useRestaurantStore(); // extracct these things from the 'useRestaurantStore' hook
    
    const appliedFilterHandler = (value: string) => { // create a function 'appliedFilterHandler' that takes a string as argument to filter items based on the applied filter
        setAppliedFilter(value); // call the 'setAppliedFilter' function from the 'useRestaurantStore' hook and pass the 'value' argument to it
    };
    
    return (
        <div className="md:w-72">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">Filter by cuisines</h1>
                <Button variant={"link"} onClick={resetAppliedFilter}>Reset</Button> {/* render a button clicking which calls 'resetAppliedFilter' function to remove filter */}
            </div>
            {filterOptions.map((option) => ( // iterate over the 'filterOptions' array as 'option'
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                        id={option.id} // set the 'id' prop of 'Checkbox' component to 'option.id'
                        checked={appliedFilter.includes(option.label)} // this checkbox is checked if 'option.label' is included in the 'appliedFilter' array
                        onClick={() => appliedFilterHandler(option.label)} // clicking this checkbox calls 'appliedFilterHandler' function and passes 'option.label' as argument
                    />
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option.label}</Label> {/* render label 'option.label' for current checkbox */}
                </div>
            ))}
        </div>
    );
};

export default FilterPage;