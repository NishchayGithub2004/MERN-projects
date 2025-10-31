import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' hook to handle restaurant filtering logic and state
import { Button } from "./ui/button"; // import 'Button' component for reset filter action
import { Checkbox } from "./ui/checkbox"; // import 'Checkbox' component to display filter options as selectable items
import { Label } from "./ui/label"; // import 'Label' component to provide text descriptions for each checkbox

export type FilterOptionsState = { // define a custom type 'FilterOptionsState' representing structure of each filter option
    id: string; // unique identifier for each filter option
    label: string; // display label for the filter option
};

const filterOptions: FilterOptionsState[] = [ // define an array of filter options for available cuisines
    { id: "burger", label: "Burger" },
    { id: "thali", label: "Thali" },
    { id: "biryani", label: "Biryani" },
    { id: "momos", label: "Momos" },
];

const FilterPage = () => { // define a functional component named 'FilterPage' to render cuisine-based filters
    const { setAppliedFilter, appliedFilter, resetAppliedFilter } = useRestaurantStore(); // extract state and functions from 'useRestaurantStore' hook to manage applied filters

    const appliedFilterHandler = (value: string) => { // define a function to update applied filters when a checkbox is clicked
        setAppliedFilter(value); // call 'setAppliedFilter' with selected cuisine value to toggle it in global filter state
    };
    
    return (
        <div className="md:w-72">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">Filter by cuisines</h1> {/* render heading for filter section */}
                <Button variant={"link"} onClick={resetAppliedFilter}>Reset</Button> {/* clicking this resets all applied filters using 'resetAppliedFilter' */}
            </div>
            {filterOptions.map((option) => ( // iterate through each 'option' in 'filterOptions' to render individual checkbox with label
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                        id={option.id} // assign checkbox id to match corresponding filter option id
                        checked={appliedFilter.includes(option.label)} // determine checked state based on whether current label exists in applied filters array
                        onClick={() => appliedFilterHandler(option.label)} // on click, toggle the selected filter by invoking 'appliedFilterHandler'
                    />
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option.label} {/* render readable label text for current cuisine filter */}
                    </Label>
                </div>
            ))}
        </div>
    );
};

export default FilterPage; // export 'FilterPage' component as default for use in other components